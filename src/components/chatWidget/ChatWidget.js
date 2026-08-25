import React, {useContext, useEffect, useRef, useState} from "react";
import StyleContext from "../../contexts/StyleContext";
import {streamChat, MAX_MESSAGE_CHARS} from "./chatClient";
import "./ChatWidget.scss";

/* Suggested questions. The first four are the empty state; the rest fill in as
   follow-ups once a visitor is in conversation. Anything already asked drops out
   of the list, so suggestions never repeat what is already on screen. */
const QUESTION_POOL = [
  "What is Abhishek working on right now?",
  "Walk me through his most interesting project",
  "How much production experience does he have?",
  "What kind of role is he looking for?",
  "What is his experience with AI and LLMs?",
  "Which languages and frameworks does he know best?",
  "Where has he worked before?",
  "What did he study?",
  "Has he led any migrations or rewrites?",
  "What awards or certifications does he have?",
  "How do I get in touch with him?"
];

const STARTER_QUESTIONS = QUESTION_POOL.slice(0, 4);
const FOLLOW_UP_COUNT = 3;
const COUNTER_THRESHOLD = 800;

/* The nudge appears once per browser session - long enough after load that it
   does not compete with the hero, and it disappears on its own. */
const TOOLTIP_SEEN_KEY = "chatWidgetNudgeSeen";
const TOOLTIP_DELAY_MS = 2500;
const TOOLTIP_VISIBLE_MS = 9000;

/* The trigger shows its label at the top of the page and shrinks to the icon
   once the visitor scrolls into the content, so it stops covering the page.
   Hysteresis: it collapses past COLLAPSE and only expands again below EXPAND,
   so a scroll that hovers on the boundary does not flicker. */
const SCROLL_COLLAPSE_AT = 140;
const SCROLL_EXPAND_AT = 60;

export default function ChatWidget() {
  const {isDark} = useContext(StyleContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [canRetry, setCanRetry] = useState(false);
  // Messages left in the visitor's rate-limit budget; null until the server says.
  const [remaining, setRemaining] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const transcriptRef = useRef(null);
  const abortRef = useRef(null);
  // Tracks whether the visitor has scrolled up to read; if so we leave them be.
  const isPinnedToBottom = useRef(true);

  /* Point out the widget once per session. sessionStorage rather than
     localStorage so a returning visitor is reminded on a fresh visit, but is
     not nagged on every scroll-triggered reload within one. */
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(TOOLTIP_SEEN_KEY) === "true";
    } catch (err) {
      // Private browsing can throw on storage access - just skip the nudge.
      return undefined;
    }
    if (seen) return undefined;

    const showTimer = setTimeout(() => setShowNudge(true), TOOLTIP_DELAY_MS);
    const hideTimer = setTimeout(
      () => setShowNudge(false),
      TOOLTIP_DELAY_MS + TOOLTIP_VISIBLE_MS
    );
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  /* Collapse the label once the visitor scrolls away from the top. Reads the
     scroll position through rAF so the handler itself stays cheap; Top.js
     assigns window.onscroll, which is a separate channel from addEventListener,
     so the two do not clobber each other. */
  useEffect(() => {
    let frame = 0;

    const evaluate = () => {
      frame = 0;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setIsCompact(current =>
        current ? y > SCROLL_EXPAND_AT : y > SCROLL_COLLAPSE_AT
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(evaluate);
    };

    evaluate(); // Handle a load that restores a mid-page scroll position.
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function dismissNudge() {
    setShowNudge(false);
    try {
      window.sessionStorage.setItem(TOOLTIP_SEEN_KEY, "true");
    } catch (err) {
      // Storage unavailable - the nudge simply reappears next load.
    }
  }

  // Focus into the input on open, back to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
      return () => clearTimeout(timer);
    }
    if (triggerRef.current) triggerRef.current.focus();
  }, [isOpen]);

  // Escape closes; Tab is trapped inside the panel while it is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = event => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'button, textarea, [href], input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen]);

  // Follow the newest message, unless the visitor has scrolled away from it.
  useEffect(() => {
    const node = transcriptRef.current;
    if (node && isPinnedToBottom.current) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages]);

  // Drop any in-flight request when the widget unmounts.
  useEffect(() => () => abortRef.current && abortRef.current.abort(), []);

  const handleTranscriptScroll = () => {
    const node = transcriptRef.current;
    if (!node) return;
    const distanceFromBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight;
    isPinnedToBottom.current = distanceFromBottom < 48;
  };

  async function send(text) {
    const question = text.trim();
    if (!question || isStreaming) return;

    setError(null);
    setCanRetry(false);
    setDraft("");
    isPinnedToBottom.current = true;

    const history = [...messages, {role: "user", content: question}];
    setMessages([...history, {role: "assistant", content: ""}]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await streamChat(
        history,
        delta => {
          setMessages(current => {
            const next = current.slice();
            const last = next[next.length - 1];
            next[next.length - 1] = {...last, content: last.content + delta};
            return next;
          });
        },
        controller.signal
      );

      if (result && typeof result.remaining === "number") {
        setRemaining(result.remaining);
      }

      // An empty assistant turn would render as a blank bubble.
      setMessages(current => {
        const last = current[current.length - 1];
        if (last && last.role === "assistant" && last.content === "") {
          setError("No response came back. Try again.");
          setCanRetry(true);
          return current.slice(0, -1);
        }
        return current;
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages(current => {
        const last = current[current.length - 1];
        return last && last.role === "assistant" && last.content === ""
          ? current.slice(0, -1)
          : current;
      });
      setError(err.message || "Something went wrong. Try again.");
      setCanRetry(Boolean(err.retryable));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function retry() {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    // Drop the failed exchange before replaying the question.
    const index = messages.lastIndexOf(lastUser);
    setMessages(messages.slice(0, index));
    setError(null);
    setCanRetry(false);
    send(lastUser.content);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(draft);
    }
  }

  const isEmpty = messages.length === 0;
  const lastMessage = messages[messages.length - 1];
  const waitingForFirstToken =
    isStreaming &&
    lastMessage &&
    lastMessage.role === "assistant" &&
    lastMessage.content === "";

  const asked = new Set(
    messages.filter(m => m.role === "user").map(m => m.content)
  );
  const followUps =
    !isEmpty && !isStreaming && !error && lastMessage.role === "assistant"
      ? QUESTION_POOL.filter(q => !asked.has(q)).slice(0, FOLLOW_UP_COUNT)
      : [];

  return (
    <div className={`chat-widget${isDark ? " chat-widget--dark" : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`chat-widget__trigger${
          isOpen ? " chat-widget__trigger--open" : ""
        }${!isOpen && isCompact ? " chat-widget__trigger--compact" : ""}`}
        aria-label={isOpen ? "Close the AI chatbox" : "Open the AI chatbox"}
        aria-expanded={isOpen}
        onClick={() => {
          dismissNudge();
          setIsOpen(open => !open);
        }}
      >
        <span className="chat-widget__trigger-icon" aria-hidden="true">
          {isOpen ? "✕" : "\u{1F4AC}"}
        </span>
        {/* Stays mounted so the collapse can animate; CSS clamps it to zero
            width. aria-hidden because the button's own label already covers it. */}
        {!isOpen && (
          <span className="chat-widget__trigger-label" aria-hidden="true">
            AI Chatbox
          </span>
        )}
      </button>

      {/* The container is column-reverse, so this must sit *after* the trigger
          in the DOM to render visually above it. Decorative - the trigger
          already announces itself, so this would only duplicate for a reader. */}
      {showNudge && !isOpen && (
        <div className="chat-widget__nudge" aria-hidden="true">
          <span>Questions about Abhishek? Ask the AI chatbox.</span>
          <button
            type="button"
            className="chat-widget__nudge-close"
            tabIndex={-1}
            onClick={dismissNudge}
          >
            {"✕"}
          </button>
        </div>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          className="chat-widget__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Ask about Abhishek"
        >
          <header className="chat-widget__header">
            <div>
              <p className="chat-widget__title">Ask about Abhishek</p>
              <p className="chat-widget__subtitle">
                His work, background and availability
              </p>
            </div>
            <button
              type="button"
              className="chat-widget__close"
              aria-label="Close the chat"
              onClick={() => setIsOpen(false)}
            >
              {"✕"}
            </button>
          </header>

          <div
            ref={transcriptRef}
            className="chat-widget__transcript"
            onScroll={handleTranscriptScroll}
            aria-live="polite"
            aria-atomic="false"
          >
            {isEmpty && (
              <div className="chat-widget__empty">
                <p className="chat-widget__greeting">
                  Hi - ask me anything about Abhishek's work and background.
                </p>
                <ul className="chat-widget__starters">
                  {STARTER_QUESTIONS.map(question => (
                    <li key={question}>
                      <button
                        type="button"
                        className="chat-widget__starter"
                        onClick={() => send(question)}
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-widget__message chat-widget__message--${message.role}`}
              >
                {message.content}
              </div>
            ))}

            {waitingForFirstToken && (
              <div className="chat-widget__typing" aria-label="Thinking">
                <span />
                <span />
                <span />
              </div>
            )}

            {followUps.length > 0 && (
              <div className="chat-widget__followups">
                <p className="chat-widget__followups-label">You could also ask</p>
                <ul className="chat-widget__followups-list">
                  {followUps.map(question => (
                    <li key={question}>
                      <button
                        type="button"
                        className="chat-widget__chip"
                        onClick={() => send(question)}
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="chat-widget__error" role="alert">
                <span>{error}</span>
                {canRetry && (
                  <button type="button" onClick={retry}>
                    Retry
                  </button>
                )}
              </div>
            )}

            {remaining !== null && remaining <= 2 && remaining > 0 && !error && (
              <p className="chat-widget__quota" role="status">
                {remaining === 1
                  ? "1 message left for now."
                  : `${remaining} messages left for now.`}
              </p>
            )}
          </div>

          <div className="chat-widget__composer">
            <textarea
              ref={inputRef}
              className="chat-widget__input"
              value={draft}
              placeholder="Ask a question..."
              rows={1}
              maxLength={MAX_MESSAGE_CHARS}
              disabled={isStreaming}
              aria-label="Your question"
              onChange={event => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chat-widget__send"
              aria-label="Send"
              disabled={isStreaming || draft.trim() === ""}
              onClick={() => send(draft)}
            >
              {"↑"}
            </button>
          </div>

          {draft.length > COUNTER_THRESHOLD && (
            <p className="chat-widget__counter">
              {draft.length} / {MAX_MESSAGE_CHARS}
            </p>
          )}

          <p className="chat-widget__disclaimer">
            AI-generated from Abhishek's notes - it can be wrong. Confirm
            anything important with him directly.
          </p>
        </div>
      )}
    </div>
  );
}
