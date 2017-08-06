const token = process.env.SLACK_TOKEN;
const plugins = require('./plugins');
const slackBot = require('slack-bot-commands');

let res = slackBot(plugins, token);

module.exports = res;
