"use strict";

const { sendEntryToSlack } = require("../../../nomad/slack");

/**
 *  comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  // create method
  async create(ctx) {
    const comment = await super.create(ctx);
    await sendEntryToslack(comment, "comment", ctx);
    return this.sanitizeOutput(comment, ctx);
  },
}));
