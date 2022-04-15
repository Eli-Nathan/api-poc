"use strict";
const sanitizeApiResponse = require("../../../nomad/sanitzeApiResponse");
/**
 *  site controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site.site", ({ strapi }) => ({
  // find method
  async find(ctx) {
    const sites = await super.find(ctx);
    return this.sanitizeOutput(sites, ctx);
  },

  // find one method
  async findOne(ctx) {
    const site = await super.findOne(ctx);
    if (site) {
      const siteWithOwners = await strapi.db.query("api::site.site").findOne({
        where: { id: ctx.params.id },
        populate: {
          owners: true,
        },
      });
      const siteOwners = siteWithOwners?.owners;
      const siteHasOwners = siteOwners.length > 0;
      const comments = site?.data?.attributes?.comments;
      const sanitizedComments = sanitizeApiResponse(comments);
      const enrichedComments = await (
        await Promise.all(
          sanitizedComments.map(async (comment) => {
            const commentEntity = await strapi.db
              .query("api::comment.comment")
              .findOne({
                where: { id: comment.id, status: "complete" },
                populate: {
                  owner: true,
                },
              });
            if (commentEntity) {
              return {
                ...comment,
                owner: {
                  name: commentEntity.owner.name,
                  avatar: commentEntity.owner.avatar,
                },
              };
            }
          })
        )
      ).filter(Boolean);
      const output = await this.sanitizeOutput(site, ctx);
      return {
        ...output,
        data: {
          ...output.data,
          attributes: {
            ...output.data.attributes,
            comments: enrichedComments,
            isOwned: siteHasOwners,
          },
        },
      };
    }
  },
}));
