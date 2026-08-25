fs = require("fs");
const https = require("https");
process = require("process");
require("dotenv").config();

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const USERNAME_GITHUB = process.env.USERNAME_GITHUB;
const USE_GITHUB_DATA = process.env.USE_GITHUB_DATA;

/**
 * This data is optional decoration — it fills the GitHub profile card and the
 * pinned-repo list. src/containers/profile/Profile.js already handles a missing
 * public/profile.json by hiding that section, so a failed fetch must NOT fail
 * the build. It used to `throw`, which killed `npm run build` (and therefore the
 * whole Vercel deploy) whenever the token was missing, expired, or GitHub was
 * having a bad day.
 */
function skip(reason) {
  console.warn(`[fetch] Skipping GitHub profile data: ${reason}`);
  console.warn(
    "[fetch] This is not fatal. The site builds and deploys fine; the GitHub " +
      "profile card falls back to the default contact section."
  );
}

if (USE_GITHUB_DATA === "true") {
  if (USERNAME_GITHUB === undefined) {
    skip("USERNAME_GITHUB is not set.");
    return;
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
      // Drain the response so the socket closes, then carry on.
      res.resume();
      skip(
        `GitHub returned ${res.statusCode}. Check REACT_APP_GITHUB_TOKEN, or ` +
          `set USE_GITHUB_DATA=false to turn this off entirely.`
      );
      return;
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
    skip(`could not reach GitHub (${error.message}).`);
  });

  req.write(data);
  req.end();
}
