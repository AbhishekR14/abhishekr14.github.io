# About Abhishek Ranjan

> Source of truth for the portfolio chatbot. Everything here is injected into the
> system prompt verbatim. If a fact is not in this file, the assistant will say it
> does not know - so add detail here rather than tweaking the prompt.
>
> Content below comes from the live site (`src/portfolio.js`) and Abhishek's
> resume (see `resume.md`, which is loaded alongside this file).

## Snapshot

Abhishek Ranjan is a Full Stack Engineer with 4 years of experience building
intelligent, end-to-end applications that combine LLMs, AI agents, and modern web
stacks (React, Next.js, Spring Boot). He shipped an MCP (Model Context Protocol)
server at Goldman Sachs that lets business users reach backend systems through
natural language. He works comfortably across the whole stack - REST APIs and
microservices through to React UIs and AI-augmented workflows - with a focus on
scalable architecture and production reliability.

He is currently based in India and is open to new opportunities. He is also open to reloate anywhere in the world.

## Current role

**Goldman Sachs - Associate Software Engineer (SDE 2), June 2025 – Present**

Day to day he works on a high-throughput trade surveillance platform: migrating
and maintaining Spring Boot microservices, building internal full-stack tooling,
and adding AI-facing interfaces to existing backend capabilities.

- Designed and implemented an MCP (Model Context Protocol) server so business users
  can interact with backend capabilities through a conversational interface,
  removing the dependency on UI layers.
- Led the end-to-end migration of multiple microservices from JDK 8 / Spring Boot 2
  to JDK 21 / Spring Boot 3, improving performance, security, and maintainability
  across both on-prem and Kubernetes deployments.
- Architected and built a full-stack Exceptions Management UI with an integrated
  approval workflow, replacing a high-effort manual legacy process. The automation
  cut operational overhead and improved data tracking for auditing.
- Contributed to a high-throughput trade surveillance system, onboarding Physical
  Equities and validating trades against regulatory and internal compliance rules.
- Improved system resilience with multi-cluster QA setups, failover testing, and
  monitoring via Prometheus and Alertmanager.

## Experience

### Goldman Sachs - Associate Software Engineer (SDE 2) (June 2025 – Present)

See "Current role" above.

### Wells Fargo - Software Engineer (August 2022 – June 2025)

- Received the Manager Appreciation Spotlight award in September 2024 for his
  contributions to the Java and .NET projects.
- Helped build a Java + React document viewing tool and onboarded 250+ document
  classes onto the new application.
- Owned a .NET document viewing tool used to view all stored Wells Fargo documents,
  then decommissioned it and migrated its full functionality to the new Java/React
  tool.
- Built an in-house .NET application that removed the dependency on a third-party tool (ION Trading software), saving roughly $100K annually. The application helped in generating Reports of the trades for business to use, View the trade data and various other benefits.


### Bharat Electronics Limited - Intern (October 2021 – November 2021)

- Fixed a long-standing bug in a BEL internal web application written in ReactJS.

## Projects

### MCP server for backend capabilities (Goldman Sachs)

**Problem:** Business users needed data and actions for which they had to always go on the UI and search through multiple screens and find the information.
**Approach:** Designed and implemented a Model Context Protocol server exposing
those backend capabilities as tools an LLM client can call, so users can ask for
what they need conversationally instead of navigating a UI.
**Stack:** Python, Spring Boot, MCP, LLM tooling.
**Outcome:** Business users can interact directly with backend capabilities
without a dedicated UI layer.

### Exceptions Management UI (Goldman Sachs)

**Problem:** Exceptions were handled through a manual, high-effort legacy process
with weak audit trails.
**Approach:** Built a full-stack UI with an integrated approval workflow to
replace it.
**Stack:** Java, Spring Boot, React, Kubernetes.
**Outcome:** Reduced operational overhead and improved data tracking for auditing.

### JDK 21 / Spring Boot 3 microservice migration (Goldman Sachs)

**Problem:** Multiple services were running on JDK 8 and Spring Boot 2, limiting
performance and creating a growing security and maintenance burden.
**Approach:** Led the end-to-end upgrade across on-prem and Kubernetes
deployments, including multi-cluster QA and failover testing.
**Stack:** Java 21, Spring Boot 3, Kubernetes, Prometheus, Alertmanager.
**Outcome:** Improved performance, security, and maintainability.

### ION Trading replacement (Wells Fargo)

**Problem:** The team depended on a paid third-party tool, ION Trading software.
**Approach:** Built an in-house .NET application covering the needed functionality.
**Stack:** .NET, C#.
**Outcome:** Saved approximately $100K annually.

### Document viewing tool migration (Wells Fargo)

**Problem:** Document viewing was split across an ageing .NET tool and a newer
Java/React tool.
**Approach:** Onboarded 250+ document classes onto the new application, then
decommissioned the .NET tool and migrated its full functionality across.
**Stack:** Java, React, .NET.
**Outcome:** Consolidated onto a single maintained application.

### Personal projects

All public on GitHub: https://github.com/AbhishekR14

**FinTrack** (July 2024) - a daily finance tracker with a modern UI and visual charts
and graphs that make expenses easier to understand. 100+ users onboarded and using it
daily, 5000+ total unique visitors to date.
Stack: NextJS, ReactJS, Recoil, TypeScript, Postgres, TailwindCSS.
Repo: https://github.com/AbhishekR14/FinTrack

**Tennerz** (September 2023) - a fun dice rolling game, with 50+ leaderboard users and
300+ total unique visitors.
Stack: ReactJS, JavaScript, Firebase.
Repo: https://github.com/AbhishekR14/Tennerz

**ExpressIt** (May 2024) - a simple and clean blogging web application.
Stack: ReactJS, NodeJS, TypeScript, Postgres, TailwindCSS.
Repo: https://github.com/AbhishekR14/ExpressIt

**Performance analysis of symmetric key cryptography and data encryption** (July 2021) -
his final-year capstone project. Benchmarked symmetric key cryptography methods and
built a Raspberry Pi file-encryption web server.
Stack: Python, Raspberry Pi.
Repo: https://github.com/AbhishekR14/Performance-Analysis-of-Symmetric-Key-Cryptography-and-Data-Encryption-using-Raspberry-PiPerformance

**This portfolio site and its chatbot** - the site you are on. A React portfolio with a
built-in assistant running on a Node serverless function. The knowledge base is a small
markdown corpus (this file plus `resume.md`) read once at cold start and injected
directly into the system prompt - deliberately no chunking, no embeddings, and no vector
store, because the whole corpus is only a few thousand tokens.
Stack: React, Node.js serverless functions, LLM API, Vercel.
Repo: https://github.com/AbhishekR14/abhishekr14.github.io

**PayYourFren** - a web app for sending virtual currency to friends, built on the MERN
stack. Repo: https://github.com/AbhishekR14/PayYourFren

**Quizzy** - a quiz application written in Java.
Repo: https://github.com/AbhishekR14/Quizzy

**AmazedCart** - an interactive web store built with JavaScript, HTML, and CSS.
Repo: https://github.com/AbhishekR14/AmazedCart

## Technical skills

**Deep (built production systems with):** Java, Python, Spring Boot, React.js, .NET, C#,
JavaScript, TypeScript, REST APIs, microservices, SQL.

**Working knowledge (shipped features with):** Next.js, Node.js, Python,
Kubernetes, Azure, Kafka, Postgres, MongoDB / NoSQL, LLM integration, AI agents,
MCP (Model Context Protocol), RAG pipelines, Prometheus and Alertmanager,
TailwindCSS.

**Also works with:** Firebase, Vercel, Recoil, Git, CI/CD via GitHub Actions.

**Developer tools:** GitHub Copilot, Devin AI, VS Code, IntelliJ IDEA, GitHub and
GitLab, Postman, Vercel, Prometheus, Alertmanager.

## Education

- **PES University (RR Campus)** - B.Tech in Electronics and Communication
  Engineering, June 2018 – June 2022. CGPA 8.28.
- **Delhi Public School, Bangalore North** - Class 12, Science (PCMC), CBSE Board,
  July 2016 – March 2018. 94.4%.

## Achievements and certifications

- **Manager Appreciation Spotlight Award**, Wells Fargo, September 2024 - for
  contributions to the Java and .NET projects.
- **Full Stack Development Course**, 100xDevs - completed.
  Verify: https://app.100xdevs.com/certificate/verify/YQ3XPQWT
- **AZ-900 Azure Fundamentals**, Microsoft - certified.
  Verify: https://www.credly.com/badges/46db3e37-ddb5-44b2-a72f-0f4501e2a4aa/public_url
- **Basic SQL for Data Science**, UC Davis (Coursera) - certified.
  Verify: https://www.coursera.org/account/accomplishments/verify/8FZ5WDWZB4A8
- **.NET, MERN Stack and Java certifications**, Wells Fargo - completed.

## What I'm looking for

Abhishek is actively open to new opportunities.

- **Role types:** AI / LLM engineering roles (Full Stack AI Engineer, AI agents, LLM
  product work) and full-stack or backend SDE roles (Java, Spring Boot, React,
  microservices) at the SDE 2 / senior level.
- **Location:** based in Bengaluru, India, and open to relocating anywhere in the world.
- **Work mode:** remote or hybrid preferred.
- **Notice period:** 1 month.

For anything not covered here, email him at aranjan0288@gmail.com.

## Contact

- **Email:** aranjan0288@gmail.com
- **Phone:** +91-8880796319
- **LinkedIn:** https://www.linkedin.com/in/abhishek-ranjann
- **GitHub:** https://github.com/AbhishekR14
- **Resume:** https://drive.google.com/file/d/1ClC7qllYaMbgfuJucK6h5T2Oa5QnY_GI/view

## FAQ

**Q: What's the hardest technical problem you've solved?**
A: The MCP (Model Context Protocol) server at Goldman Sachs. Business users previously
had to go through the UI and search across multiple screens to find what they needed.
The problem was exposing existing backend capabilities as tools an LLM client could call
safely and reliably, so those users could just ask for what they wanted in natural
language and get it without a UI layer in between. The largest-scope piece of work on
his record is a different one: migrating multiple microservices from JDK 8 /
Spring Boot 2 to JDK 21 / Spring Boot 3 across on-prem and Kubernetes deployments.

**Q: Why should we hire you?**
A: Four years shipping production systems at two large financial institutions, with work
spanning backend microservices, front-end React, and AI integration - and outcomes you
can measure: roughly $100K saved annually by replacing a third-party trading tool with
an in-house .NET application, 250+ document classes onboarded onto a new Java/React
platform, and a multi-service JDK 21 / Spring Boot 3 migration delivered across on-prem
and Kubernetes. He also builds and ships his own products outside work - FinTrack has
100+ daily users - so he is comfortable owning something end to end.

**Q: What are you weakest at?**
A: Stage fright - speaking in front of a large room is not where he is most comfortable
yet. He is actively working on it by taking up more presentations at work and doing
things like open mics outside of it.

**Q: Are you open to relocation?**
A: Yes - he is open to relocating anywhere in the world. He is currently based in
Bengaluru, India, and prefers remote or hybrid arrangements.

**Q: What's your notice period / availability?**
A: 1 month.