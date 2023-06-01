const getRejectedMailContent = require("./rejectedMail");
const getApprovedMailContent = require("./approvedMail");
const sendEmail = require("./sendEmail");

module.exports = {
  getRejectedMailContent,
  getApprovedMailContent,
  sendEmail,
};
