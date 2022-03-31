"use strict";

module.exports = {
  async findAdditions(ctx) {
    ctx.body = await strapi
      .plugin("moderator")
      .service("moderator")
      .getAdditions();
  },
  async findEdits(ctx) {
    ctx.body = await strapi.plugin("moderator").service("moderator").getEdits();
  },
  async findAll(ctx) {
    const edits = await strapi
      .plugin("moderator")
      .service("moderator")
      .getEdits();
    const additions = await strapi
      .plugin("moderator")
      .service("moderator")
      .getAdditions();
    ctx.body = {
      additions,
      edits,
    };
  },
};
