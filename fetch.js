fs = require("fs");
const https = require("https");
process = require("process");
require("dotenv").config();

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const USERNAME_GITHUB = process.env.USERNAME_GITHUB;
const USE_GITHUB_DATA = process.env.USE_GITHUB_DATA;

const ERR = {
  noUserName:
    "Github Username was found to be undefined. Please set all relevant environment variables.",
  requestFailed:
    "The request to GitHub didn't succeed. Check if GitHub token in your .env file is correct."
};
if (USE_GITHUB_DATA === "true") {
  if (USERNAME_GITHUB === undefined) {
    throw new Error(ERR.noUserName);
  }

  console.log(`Fetching profile data for ${USERNAME_GITHUB}`);
  var data = JSON.stringify({
    query: `
{
  user(login:"${USERNAME_GITHUB}") { 
    name
    bio
    avatarUrl
    location
    pinnedItems(first: 6, types: [REPOSITORY]) {
      totalCount
      edges {
          node {
            ... on Repository {
              name
              description
              forkCount
              stargazers {
                totalCount
              }
              url
              id
              diskUsage
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
}
`
  });
  const default_options = {
    hostname: "api.github.com",
    path: "/graphql",
    port: 443,
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "Node"
    }
  };

  const req = https.request(default_options, res => {
    let data = "";

    console.log(`statusCode: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      throw new Error(ERR.requestFailed);
    }

    res.on("data", d => {
      data += d;
    });
    res.on("end", () => {
      fs.writeFile("./public/profile.json", data, function (err) {
        if (err) return console.log(err);
        console.log("saved file to public/profile.json");
      });
    });
  });

  req.on("error", error => {
    throw error;
  });

  req.write(data);
  req.end();
}
