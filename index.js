const core = require("@actions/core");
const github = require("@actions/github");
const { WebClient } = require("@slack/web-api");

const run = async () => {
  try {
    const active = core.getInput("active");
    if (!active) return;

    const repo_token = core.getInput("repo-token");
    const octokit = new github.GitHub(repo_token);

    const slack_token = core.getInput("slack-auth");
    const web = new WebClient(slack_token);

    const channel_name = core.getInput("channel");

    const { data } = await octokit.pulls.list({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner
    });

    if (!data) return;

    const reviewers = {};

    data.forEach(pr => {
      pr.requested_reviewers.map(reviewer => {
        if (!reviewers[reviewer.login]) {
          reviewers[reviewer.login] = {
            login: reviewer.login,
            url: [pr.html_url]
          };
        } else {
          reviewers[reviewer.login].url.push(pr.html_url);
        }
      });
    });

    const promises = Object.values(reviewers).map(reviewer => {
      return web.chat.postMessage({
        text: `Hey ${reviewer.login}! Your review has been requested on these pull requests, ${reviewer.url.join(", ")}`,
        channel: channel_name
      });
    });

    Promise.all(promises).catch(error => {
      console.log("error", error);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
