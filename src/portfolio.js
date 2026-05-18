// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation";

// Splash Screen

const splashScreen = {
  enabled: false, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: true // Set to false to use static SVG
};

const greeting = {
  username: "Abhishek Ranjan",
  title: "Hi, I'm Abhishek",
  subTitle: emoji(
    "I am a passionate Full Stack Developer 🚀 with expertise in building scalable applications across Java, .NET, React, and cloud ecosystems. Passionate about backend systems, intuitive UI development, and AI-assisted development workflows with strong prompting skills. Quick to adapt to new technologies with a strong focus on performance, clean architecture, and problem-solving."
  ),
  resumeLink:
    "https://drive.google.com/file/d/118ChVmXQejDaAYfXqq0_hqqbtRrdxUE2/view", // Set to empty to hide the button
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/AbhishekR14/",
  linkedin: "https://www.linkedin.com/in/abhishek-ranjann",
  gmail: "aranjan0288@gmail.com",
  // Instagram, Twitter are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle:
    "A Tech-Savvy Full Stack Developer who is tech stack flexible. I am very enthusiastic about learning new technologies and building impactful projects.",
  skills: [
    emoji("⚡ I Develop highly interactive web applications"),
    emoji(
      "⚡ I Seamlessly Integrate third party services like Firebase, Azure, Vercel, CloudFlare, etc"
    ),
    emoji("⚡ I am Very tech fluid and write clean code"),
    emoji(
      "⚡ I have good knowledge of how to work with a large scale application"
    )
  ],
  softwareSkills: [
    { skillName: "Java", fontAwesomeClassname: "fab fa-java" },
    { skillName: ".NET", fontAwesomeClassname: "fas fa-code" },
    { skillName: "React.Js", fontAwesomeClassname: "fab fa-react" },
    { skillName: "Node.Js", fontAwesomeClassname: "fab fa-node" },
    { skillName: "SpringBoot", fontAwesomeClassname: "fas fa-leaf" },
    { skillName: "C#", fontAwesomeClassname: "fas fa-laptop-code" },
    { skillName: "Next.Js", fontAwesomeClassname: "fas fa-layer-group" },
    { skillName: "JavaScript", fontAwesomeClassname: "fab fa-js" },
    { skillName: "TypeScript", fontAwesomeClassname: "fas fa-puzzle-piece" },
    { skillName: "Python", fontAwesomeClassname: "fab fa-python" },
    { skillName: "SQL", fontAwesomeClassname: "fas fa-database" },
    { skillName: "Postgres", fontAwesomeClassname: "fas fa-paw" },
    { skillName: "NoSQL", fontAwesomeClassname: "fas fa-server" },
    { skillName: "MongoDB", fontAwesomeClassname: "fas fa-leaf" },
    { skillName: "Kubernetes", fontAwesomeClassname: "fas fa-cubes" },
    { skillName: "Azure", fontAwesomeClassname: "fab fa-microsoft" },
    { skillName: "Kafka", fontAwesomeClassname: "fas fa-stream" },
    { skillName: "TailwindCSS", fontAwesomeClassname: "fas fa-cogs" }
  ],
  display: true
};

// Education Section

const educationInfo = {
  display: true,
  schools: [
    {
      schoolName: "PES University (RR Campus)",
      logo: require("./assets/images/Pes-University-logo.png"),
      subHeader:
        "Bachelor of Technology in Electronics and Communication Engineering",
      duration: "June 2016 - June 2022",
      desc: "CGPA - 8.28"
    },
    {
      schoolName: "Delhi Public School, Bangalore North",
      logo: require("./assets/images/DPS-logo.png"),
      subHeader: "12th Grade Sicence (PCMC) CBSE Board",
      duration: "July 2016 - March 2018",
      desc: "Percentage - 94.4%"
    }
  ]
};

// Work experience section
const workExperiences = {
  display: true, // Set it to true to show workExperiences Section
  experience: [
    {
      role: "Associate Software Engineer (SDE 2)",
      company: "Goldman Sachs",
      companylogo: require("./assets/images/gs-logo.png"), // Add the logo image to assets/images
      date: "June 2025 – Present",
      descBullets: [
        "Successfully led end-to-end migration of multiple microservices from JDK 8/SpringBoot 2 to JDK 21/SpringBoot 3, improving performance, security, and maintainability across On-prem and Kubernetes deployments.",
        "Architected and developed a full-stack Exceptions Management UI with an integrated approval workflow, replacing a high-effort legacy manual process. This automation reduced operational overhead and improved data tracking for auditing.",
        "Contributed to a high-throughput trade surveillance system, onboarding Physical Equities and validating trades against regulatory and internal compliance rules.",
        "Designed and implemented an MCP (Model Context Protocol) server to enable business users to interact directly with backend capabilities via a conversational interface, removing dependency on UI layers.",
        "Improved system resilience through multi-cluster QA setups, failover testing, and monitoring with Prometheus and Alertmanager."
      ]
    },
    {
      role: "Software Engineer",
      company: "Wells Fargo",
      companylogo: require("./assets/images/wf-logo.png"),
      date: "August 2022 – June 2025",
      descBullets: [
        "Received Manager Appreciation Spotlight award on September 2024.",
        "Contributed on building the JAVA - React document viewing tool and on-boarded 250+ Doc Classes on new application.",
        "Managed a .NET document viewing tool, a Wells Fargo Document Viewing tool to view all the stored documents. Decommissioned it and migrated full functionality to the new JAVA-React tool.",
        "Created an in-house .NET application reducing dependency on a third-party tool - ION Trading software, saving $100K annually."
      ]
    },
    {
      role: "Intern",
      company: "Bharat Electronics Limited",
      companylogo: require("./assets/images/bel-logo.png"),
      date: "October 2021 – November 2021",
      descBullets: [
        "Fixed a long ongoing bug in the BEL internal used web application written in ReactJS."
      ]
    }
  ]
};

const personalProject = {
  showGithubProfile: "true", // Set true or false to show Contact profile using Github, defaults to true
  display: true
};

// Achievement Section

const achievementSection = {
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done!",

  achievementsCards: [
    {
      title: "Manager Appreciation Spotlight Award.",
      subtitle:
        "Received Manager Appreciation Spotlight award in September 2024 for my contributions to the JAVA and .NET projects",
      image: require("./assets/images/wf-logo.png"),
      imageAlt: "Wells Fargo Logo",
      footerLink: [
        {
          name: "Award Letter",
          url: "https://drive.google.com/file/d/1wKLAIk5-rpxfNM97P12N5BhtEUYj44zo/view"
        }
      ]
    },
    {
      title: "Full Stack Development Course",
      subtitle: "Completed the Full Stack Development Course By 100x Devs",
      image: require("./assets/images/100xdevs-logo.png"),
      imageAlt: "100x Devs Logo",
      footerLink: [
        {
          name: "Certification",
          url: "https://app.100xdevs.com/certificate/verify/YQ3XPQWT"
        }
      ]
    },

    {
      title: "AZ-900 Azure Fundamentals",
      subtitle: "Completed AZ-900 Azure Fundamentals Certifcation By Microsoft",
      image: require("./assets/images/azure-logo.png"),
      imageAlt: "Azure Logo",
      footerLink: [
        {
          name: "Certification",
          url: "https://www.credly.com/badges/46db3e37-ddb5-44b2-a72f-0f4501e2a4aa/public_url"
        }
      ]
    },

    {
      title: "Basic SQL For Data Science",
      subtitle: "Completed Basic SQL For Data Science Certification By UCDavis",
      image: require("./assets/images/ucdavis-logo.png"),
      imageAlt: "UCDavis Logo",
      footerLink: [
        {
          name: "Certification",
          url: "https://www.coursera.org/account/accomplishments/verify/8FZ5WDWZB4A8"
        }
      ]
    },

    {
      title: ".NET, MERN Stack and JAVA certifications",
      subtitle:
        "Completed Certifcations in .NET, MERN Stack and JAVA provided By Wells Fargo",
      image: require("./assets/images/wf-logo.png"),
      imageAlt: "Wells Fargo Logo",
      footerLink: [
        {
          name: "Certifications",
          url: "https://drive.google.com/drive/folders/1C9ODYEGjOJcr8H6c51gyyj4-ntVzZkNn"
        }
      ]
    }
  ],
  display: true
};

// Resume Section
const resumeSection = {
  title: "Resume",
  subtitle: "Feel free to download my resume",
  display: true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Want to discuss a project or just want to say Hi? My Inbox is open to all!",
  number: "+91-8880796319",
  email_address: "aranjan0288@gmail.com"
};

// Twitter Section

const twitterDetails = {
  userName: "twitter", //Replace "twitter" with your twitter username without @
  display: false // Set true to display this section, defaults to false
};

const isHireable = true;

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  workExperiences,
  personalProject,
  achievementSection,
  contactInfo,
  twitterDetails,
  isHireable,
  resumeSection
};
