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
  title: "Hi all, I'm Abhishek",
  subTitle: emoji(
    "A passionate Full Stack Software Developer 🚀 having an experience of building Web and Mobile applications with JavaScript / Reactjs / Nodejs / React Native and some other cool libraries and frameworks."
  ),
  resumeLink:
    "https://drive.google.com/file/d/1XdW2NGvHt0PWsPywwNlOmtmPnHQ9fDOx/view", // Set to empty to hide the button
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
  subTitle: "CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  skills: [
    emoji(
      "⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications"
    ),
    emoji("⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks"),
    emoji(
      "⚡ Integration of third party services such as Firebase/ AWS / Digital Ocean"
    )
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "html-5",
      fontAwesomeClassname: "fab fa-html5"
    },
    {
      skillName: "css3",
      fontAwesomeClassname: "fab fa-css3-alt"
    },
    {
      skillName: "sass",
      fontAwesomeClassname: "fab fa-sass"
    },
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "nodejs",
      fontAwesomeClassname: "fab fa-node"
    },
    {
      skillName: "swift",
      fontAwesomeClassname: "fab fa-swift"
    },
    {
      skillName: "npm",
      fontAwesomeClassname: "fab fa-npm"
    },
    {
      skillName: "sql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "aws",
      fontAwesomeClassname: "fab fa-aws"
    },
    {
      skillName: "firebase",
      fontAwesomeClassname: "fas fa-fire"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "docker",
      fontAwesomeClassname: "fab fa-docker"
    }
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
  display: true, //Set it to true to show workExperiences Section
  experience: [
    {
      role: "Software Engineer",
      company: "Wells Fargo",
      companylogo: require("./assets/images/wf-logo.png"),
      date: "September 2022 – Present",
      descBullets: [
        "Received Manager Appreciation Spotlight award on September 2024.",
        "Contributed on building the JAVA - React document viewing tool and on-boarded 250+ Doc Classes on new application.",
        "Managed a .NET web application, a Wells Fargo Document Viewing tool to view all the stored documents.Decommissioned the .NET document viewing tool and Migrated the entire functionality to the new document viewing tool written in JAVA-React.",
        "Created an in-house .NET application that would reduce/remove dependency on a third-party software (ION Trading). Hence saving the $100K paid for the ION Trading software."
      ]
    },
    {
      role: "Intern",
      company: "Bharat Electronics Limited",
      companylogo: require("./assets/images/bel-logo.png"),
      date: "May 2017 – May 2018",
      descBullets: [
        "Fixed a long ongoing bug in the BEL internal used web application written in ReactJS",
        "Industrial Awareness about various BEL Products."
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
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [
    {
      title: "Manager Appreciation Spotlight Award.",
      subtitle:
        "Received Manager Appreciation Spotlight award on September 2024 for my contributions to the JAVA and .NET projects",
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
      subtitle: "Completed the Full Stack Development Course By 100x DEVS W",
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
    "Discuss a project or just want to say hi? My Inbox is open for all.",
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
