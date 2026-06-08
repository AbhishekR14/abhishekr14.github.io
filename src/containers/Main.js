import React, {useEffect, useState} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import WorkExperience from "./workExperience/WorkExperience";
import Projects from "./projects/Projects";
import Achievement from "./achievement/Achievement";
import Footer from "../components/footer/Footer";
import Education from "./education/Education";
import ScrollToTopButton from "./topbutton/Top";
import Twitter from "./twitter-embed/twitter";
import Profile from "./profile/Profile";
import SplashScreen from "./splashScreen/SplashScreen";
import {splashScreen} from "../portfolio";
import {StyleProvider} from "../contexts/StyleContext";
import {useLocalStorage} from "../hooks/useLocalStorage";
import "./Main.scss";

const Main = () => {
  const darkPref = window.matchMedia("(prefers-color-scheme: dark)");
  const [isDark, setIsDark] = useLocalStorage("isDark", darkPref.matches);
  const [isShowingSplashAnimation, setIsShowingSplashAnimation] =
    useState(true);

  useEffect(() => {
    if (splashScreen.enabled) {
      const splashTimer = setTimeout(
        () => setIsShowingSplashAnimation(false),
        splashScreen.duration
      );
      return () => {
        clearTimeout(splashTimer);
      };
    }
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById("scroll-progress-bar");
    const onScroll = () => {
      if (!bar) return;
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      bar.style.width = Math.min(pct, 100) + "%";
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor glow (dark mode only)
  useEffect(() => {
    if (!isDark) return;
    const glow = document.getElementById("cursor-glow");
    const onMove = e => {
      if (!glow) return;
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [isDark]);

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    const selectors = [
      ".experience-card-dark",
      ".dark-card-mode",
      ".certificate-card"
    ].join(", ");

    const observe = () => {
      const elements = document.querySelectorAll(selectors);
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        {threshold: 0.1, rootMargin: "0px 0px -40px 0px"}
      );

      elements.forEach(el => observer.observe(el));
      return observer;
    };

    // Slight delay so React has rendered all children
    const timer = setTimeout(() => {
      const observer = observe();
      return () => observer && observer.disconnect();
    }, 300);

    return () => clearTimeout(timer);
  }, [isShowingSplashAnimation]);

  const changeTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div id="app-root" className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{isDark: isDark, changeTheme: changeTheme}}>
        {isShowingSplashAnimation && splashScreen.enabled ? (
          <SplashScreen />
        ) : (
          <>
            <div id="scroll-progress-bar" aria-hidden="true" />
            {isDark && <div id="cursor-glow" aria-hidden="true" />}
            <Header />
            <Greeting />
            <Skills />
            <WorkExperience />
            <Education />
            <Projects />
            <Achievement />
            <Twitter />
            <Profile />
            <Footer />
            <ScrollToTopButton />
          </>
        )}
      </StyleProvider>
    </div>
  );
};

export default Main;
