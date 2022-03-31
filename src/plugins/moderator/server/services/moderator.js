"use strict";

module.exports = ({ strapi }) => ({
  async getAdditions() {
    const additions = await strapi.db
      .query("api::addition-request.addition-request")
      .findMany({
        populate: {
          owner: true,
        },
      });
    return additions;
  },
  async getEdits() {
    const edits = await strapi.db
      .query("api::edit-request.edit-request")
      .findMany({
        populate: {
          owner: true,
          site: true,
        },
      });
    return edits;
  },
});
