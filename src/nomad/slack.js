const axios = require("axios");
const _ = require("lodash");
const sanitzeApiResponse = require("./sanitzeApiResponse");
const logger = require("./logger");

const getKeyValFields = (entry) => {
  const keyVal = Object.entries(entry).map(([key, value]) => ({
    type: "mrkdwn",
    text: `*${_.capitalize(key)}*\n ${value}`,
  }));
  return keyVal;
};

const formSubmission = async (ctx, entry) => {
  const formSubmitted = await strapi.entityService.findOne(
    `api::form.form`,
    ctx.params.id
  );
  const fields = getKeyValFields(entry.data);
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":mailbox: *Form submission received* :mailbox:\n",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Form: ${_.startCase(
          formSubmitted.name.replace("-", " ")
        )}* \n <https://nomadapp-api.herokuapp.com/admin/content-manager/collectionType/api::form-submission.form-submission/${
          entry.id
        }|View submission>`,
      },
    },
    {
      type: "section",
      fields,
    },
  ];
  return {
    blocks,
  };
};
const additionRequest = async (ctx, entry) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":round_pushpin: *Addition request received* :round_pushpin: \n",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Title: ${_.startCase(
          entry.title
        )}* \n <https://nomadapp-api.herokuapp.com/admin/content-manager/collectionType/api::addition-request.addition-request/${
          entry.id
        }|View addition request>`,
      },
    },
  ];
  return {
    blocks,
  };
};

const editRequest = async (ctx, entry) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":pencil: *Edit request received* :pencil: \n",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<https://nomadapp-api.herokuapp.com/admin/content-manager/collectionType/api::edit-request.edit-request/${entry.id}|View edit request>`,
      },
    },
  ];
  return {
    blocks,
  };
};
const comment = async (ctx, entry) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":speech_balloon: *Comment posted* :speech_balloon: \n",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Title: ${_.startCase(
          entry.title
        )}* \n <https://nomadapp-api.herokuapp.com/admin/content-manager/collectionType/api::comment.comment/${
          entry.id
        }|View comment>`,
      },
    },
  ];
  return {
    blocks,
  };
};

const getSlackMessageForDataType = (type) => {
  switch (type) {
    case "form":
      return formSubmission;
    case "additionRequest":
      return additionRequest;
    case "editRequest":
      return editRequest;
    case "comment":
      return comment;
    default:
      return undefined;
  }
};

const sendEntryToSlack = async (entry, type, ctx) => {
  const sanitizedEntry = sanitzeApiResponse(entry);
  if (!!sanitizedEntry) {
    const messageHandler = getSlackMessageForDataType(type);
    if (messageHandler) {
      const message = await messageHandler(ctx, sanitizedEntry);
      try {
        const axiosReq = await axios.post(
          process.env.SLACK_FORM_WEBHOOK_URL,
          message,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e) {
        logger.warn("Error sending to Slack", {
          error: e,
        });
      }
    }
  }
};

module.exports = {
  sendEntryToSlack,
};
