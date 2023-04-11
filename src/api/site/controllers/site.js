"use strict";
const qs = require("qs");
const sanitizeApiResponse = require("../../../nomad/sanitzeApiResponse");
/**
 *  site controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site.site", ({ strapi }) => ({
  // find method
  async _find(ctx) {
    const sites = await super.find(ctx);
    return this.sanitizeOutput(sites, ctx);
  },

  // find method
  async find(ctx) {
    const sites = await strapi.entityService.findMany("api::site.site", {
      fields: [
        "title",
        "description",
        "category",
        "image",
        "lat",
        "lng",
        "slug",
      ],
      filters: qs.parse(ctx.query.filters),
      sort: { priority: "DESC" },
      populate: {
        type: true,
        images: true,
        facilities: true,
      },
      limit: ctx.query.limit || ctx.query.pagination?.limit,
    });
    const sanitized = await this.sanitizeOutput(sites, ctx);
    return {
      data: sanitized.map((site) => ({
        id: site.id,
        attributes: site,
      })),
    };
  },

  // find one method
  async findOne(ctx) {
    const site = await super.findOne(ctx);
    if (site) {
      const siteWithUsers = await strapi.db.query("api::site.site").findOne({
        where: { id: ctx.params.id },
        populate: {
          owners: {
            populate: { profile_pic: true },
          },
          added_by: {
            populate: { profile_pic: true },
          },
          contributors: {
            populate: { profile_pic: true },
          },
        },
      });
      return this.parseSingleSite(ctx, site, siteWithUsers);
    }
  },
  // find one method
  async findOneByUID(ctx) {
    const site = await strapi.db.query("api::site.site").findOne({
      where: { slug: ctx.params.uid },
      populate: {
        type: true,
        comments: true,
        owners: {
          populate: { profile_pic: true },
        },
        facilities: true,
      },
    });
    if (site) {
      const siteWithUsers = await strapi.db.query("api::site.site").findOne({
        where: { slug: ctx.params.uid },
        populate: {
          owners: {
            populate: { profile_pic: true },
          },
          added_by: {
            populate: { profile_pic: true },
          },
          contributors: {
            populate: { profile_pic: true },
          },
        },
      });
      const siteToParse = {
        data: {
          attributes: {
            ...site,
          },
        },
      };
      return this.parseSingleSite(ctx, siteToParse, siteWithUsers, false);
    }
  },

  async parseSingleSite(
    ctx,
    site,
    siteWithUsers,
    shouldSanitizeChildren = true
  ) {
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
    const parsedSiteOwner =
      siteOwners && siteOwners.length > 0
        ? {
            id: siteOwners[0].id,
            name: siteOwners[0].name,
            businessName: siteOwners[0].businessName,
            score: siteOwners[0].score,
            level: siteOwners[0].level,
            avatar: siteOwners[0].profile_pic?.url || siteOwners[0].avatar,
          }
        : null;
    const siteHasOwners = siteOwners.length > 0;
    const comments = site?.data?.attributes?.comments;
    const sanitizedComments = shouldSanitizeChildren
      ? sanitizeApiResponse(comments)
      : comments;
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
                  commentEntity.owner.businessName || commentEntity.owner.name,
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
        id: output.data.id,
        attributes: {
          ...output.data.attributes,
          comments: enrichedComments,
          isOwned: siteHasOwners,
          owner: parsedSiteOwner,
          addedBy: parsedSiteAddedBy,
          contributors: parsedSiteContributors,
        },
      },
    };
  },
}));
