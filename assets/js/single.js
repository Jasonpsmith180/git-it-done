var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // extract repo name from query string
    var queryString = document.location.search;
    
    // use split to get the part of the string we want
    var repoName = queryString.split("=")[1];
    
    // check if repoName is valid
    if (repoName) {
        // display repoName on the page
        repoNameEl.textContent = repoName;
        // pass repoName into getRepoIssues
        getRepoIssues(repoName);
    } else {
        // if repo is not valid go back to homepage
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo) {

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    // if the repo has no open issues return
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        // assign attritbutes to issueEl
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        // assign attributes
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");
        
        // check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            // if pull request assign "pull request" text content attribute
            typeEl.textContent = "(Pull Request)";
        } else {
            // if issue assign "issue" text content attribute
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text warning to container
    limitWarningEl.textContent = "To see more than 30 issues, please visit ";

    // create link element that points to github
    var linkEl = document.createElement("a");
    // assign attributes
    linkEl.textContent = "See more items on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
