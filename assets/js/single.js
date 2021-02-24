var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    console.log(repo);

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass data to dom function
                displayIssues(data);
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
}

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


getRepoIssues("jasonpsmith180/run-buddy");