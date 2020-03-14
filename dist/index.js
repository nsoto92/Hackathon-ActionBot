module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(410);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 410:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(739);
const github = __webpack_require__(646);
const { WebClient } = __webpack_require__(911);

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
    const reviewers = {}

    data.map(pr => pr.request_reviewers.map(reviewer => {
      if (!reviewers[reviewer.login]) {
        reviewers[reviewer.login] = {
          login: reviewer.login,
          url: [reviewer.http_url]
        }
      } else {
        reviewers[reviewer.login].url.push(reviewer.url)
      }
    }))

    const promises = Object.values(reviewers).map(reviewer => {
      return web.chat.postMessage({
        text: `Hey ${reviewer.login}! Check this ${url.split(',')}`,
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


/***/ }),

/***/ 646:
/***/ (function() {

eval("require")("@actions/github");


/***/ }),

/***/ 739:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 911:
/***/ (function() {

eval("require")("@slack/web-api");


/***/ })

/******/ });