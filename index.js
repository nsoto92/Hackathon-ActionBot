const core = require("@actions/core");
const github = require("@actions/github");

const run = () => {
  const token = core.getInput("repo-token");
  console.log("TOKEN", token);
};

run();
