module.exports = ({ env }) => ({
  url: env("MY_HEROKU_URL"),
  slackFormWebhookUrl: env("SLACK_FORM_WEBHOOK_URL"),
});
