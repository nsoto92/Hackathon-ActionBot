const core = require("@actions/core");
const github = require("@actions/github");
const { WebClient } = require("@slack/web-api");

const run = async () => {
  try {
    const active = core.getInput("active");
    if (!active) return;

    const token = core.getInput("repo-token");
    const octokit = new github.GitHub(token);

    const slack_token = core.getInput("slack-auth");
    const web = new WebClient(slack_token);

    const channel_name = core.getInput("channel");

    const { data } = await octokit.pulls.list({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner
    });
    // reviwers[0].requested_reviewers reutrns array of objects of revieweres
    // login from that object
    // loop through that array to get everyones login
    // reviewers.url is link to pull request
    if (data.length < 1) return;

    const url = data[0].html_url;
    const reviewers = data[0].requested_reviewers;

    const promises = reviewers.map(reviewer => {
      return web.chat.postMessage({
        text: `Hey ${reviewer.login}! Check this ${url}`,
        channel: channel_name
      });
    });

    Promise.all(promises).catch(error => {
      console.log("error", error);
    });

    console.log(data);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
