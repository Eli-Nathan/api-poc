"use strict";
const { sendEntryToSlack } = require("../../../nomad/slack");

/**
 *  form-submission controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::form-submission.form-submission",
  ({ strapi }) => ({
    // create method
    async create(ctx) {
      const requestBody = JSON.parse(ctx.request.body);
      if (ctx.params.id && requestBody.data) {
        ctx.request.body = {
          data: {
            data: requestBody.data,
            form: ctx.params.id,
          },
        };
        const submission = await super.create(ctx);
        const sanitized = await this.sanitizeOutput(submission, ctx);
        await sendEntryToSlack(sanitized, "form", ctx);
        return sanitized;
      }
      ctx.status = 400;
      return {
        status: 400,
        message: "No data received",
      };
    },
  })
);
