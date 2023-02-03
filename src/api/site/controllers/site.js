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
      const siteWithUsers = await strapi.db.query("api::site.site").findOne({
        where: { id: ctx.params.id },
        populate: {
          owners: true,
          added_by: true,
          contributors: true,
        },
      });
      const siteOwners = siteWithUsers?.owners;
      const siteAddedBy = siteWithUsers?.added_by;
      const siteContributors = siteWithUsers?.contributors;
      const parsedSiteContributors = siteWithUsers.contributors.map(
        (contributor) => ({
          id: contributor.id,
          name: contributor.name,
          businessName: contributor.businessName,
          score: contributor.score,
          level: contributor.level,
          avatar: contributor.profile_pic?.url || contributor.avatar,
        })
      );
      const parsedSiteAddedBy = siteAddedBy
        ? {
            id: siteAddedBy.id,
            name: siteAddedBy.name,
            businessName: siteAddedBy.businessName,
            score: siteAddedBy.score,
            level: siteAddedBy.level,
            avatar: siteAddedBy.profile_pic?.url || siteAddedBy.avatar,
          }
        : null;
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
                  owner: {
                    populate: true,
                  },
                },
              });
            if (commentEntity) {
              return {
                ...comment,
                owner: {
                  id: commentEntity.owner.id,
                  name:
                    commentEntity.owner.businessName ||
                    commentEntity.owner.name,
                  avatar:
                    commentEntity.owner?.profile_pic?.url ||
                    commentEntity.owner.avatar,
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
            addedBy: parsedSiteAddedBy,
            contributors: parsedSiteContributors,
          },
        },
      };
    }
  },
}));
