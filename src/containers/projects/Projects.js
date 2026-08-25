import React, {useState, useEffect, useContext, Suspense, lazy} from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import {personalProject, socialMediaLinks} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";
export default function Projects() {
  const GithubRepoCard = lazy(() =>
    import("../../components/githubRepoCard/GithubRepoCard")
  );
  const FailedLoading = () => null;
  const renderLoader = () => <Loading />;
  const [repo, setrepo] = useState([]);
  // todo: remove useContex because is not supported
  const {isDark} = useContext(StyleContext);

  useEffect(() => {
    const getRepoData = () => {
      fetch("/profile.json")
        .then(result => {
          if (result.ok) {
            return result.json();
          }
          throw result;
        })
        .then(response => {
          /* GitHub can answer 200 with null nodes for repos the token may not
             read. Filter them here too: fetch.js already strips them at build
             time, but a stale profile.json must not be able to blank the page. */
          const edges =
            (response &&
              response.data &&
              response.data.user &&
              response.data.user.pinnedItems &&
              response.data.user.pinnedItems.edges) ||
            [];
          setrepoFunction(edges.filter(edge => edge && edge.node));
        })
        .catch(function (error) {
          console.error(
            `${error} (because of this error, nothing is shown in place of Projects section. Also check if Projects section has been configured)`
          );
          setrepoFunction("Error");
        });
    };
    getRepoData();
  }, []);

  function setrepoFunction(array) {
    setrepo(array);
  }
  if (
    !(typeof repo === "string" || repo instanceof String) &&
    personalProject.display
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="personalproject">
          <h1 className="project-title">Personal Projects</h1>
          <div className="repo-cards-div-main">
            {repo.map(v => (
              <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />
            ))}
          </div>
          <Button
            text={"More Projects"}
            className="project-button"
            href={socialMediaLinks.github}
            newTab={true}
          />
        </div>
      </Suspense>
    );
  } else {
    return <FailedLoading />;
  }
}
