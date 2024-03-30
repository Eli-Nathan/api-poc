"use strict";
const qs = require("qs");
const axios = require("axios");

const sanitizeApiResponse = require("../../../nomad/sanitzeApiResponse");
const getWeather = require("../../../nomad/dataEnrichment/weather");
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
      sort: ctx.query.sort || { priority: "DESC" },
      populate: {
        type: {
          populate: {
            remote_icon: true,
            remote_marker: true,
          },
        },
        images: true,
        facilities: true,
        sub_types: true,
        owners: true,
      },
      limit: ctx.query.limit || ctx.query.pagination?.limit,
    });
    return {
      data: sites.map((site) => {
        return {
          id: site.id,
          attributes: { ...site, isOwned: !!site.owners?.length },
        };
      }),
    };
  },

  // find recent method
  async findRecent(ctx) {
    const sites = await strapi.entityService.findMany("api::site.site", {
      fields: ["title", "image", "lat", "lng", "slug"],
      filters: {
        $or: [
          {
            owners: {
              $not: null,
            },
          },
          {
            added_by: {
              $not: null,
            },
          },
        ],
      },
      sort: ctx.query.sort || { priority: "DESC" },
      populate: {
        type: true,
        images: true,
      },
      limit: ctx.query.limit || ctx.query.pagination?.limit,
    });
    return {
      data: sites.map((site) => {
        return {
          id: site.id,
          attributes: { ...site, isOwned: !!site.owners?.length },
        };
      }),
    };
  },

  // find one method
  async findOne(ctx) {
    const site = await super.findOne(ctx);
    if (site) {
      const siteWithUsers = await strapi.db.query("api::site.site").findOne({
        where: { id: ctx.params.id },
        populate: {
          images: true,
          likes: true,
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
        sub_types: true,
        images: true,
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
          images: true,
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

  //Search
  async search(ctx) {
    const { query, start = 0, limit = 25 } = ctx.request.query;
    const sites = await strapi
      .service("api::search.search")
      .searchSites(query, start, limit);

    const unlistedSites = await strapi
      .service("api::search.search")
      .searchUnlistedSites(query);

    return this.transformResponse(
      [
        ...sites,
        ...unlistedSites.map(
          strapi.service("api::search.search").transformOSMToUnlistedSite
        ),
      ],
      ctx
    );
  },

  async parseSingleSite(
    ctx,
    site,
    siteWithUsers,
    shouldSanitizeChildren = true
  ) {
    const siteOwners = siteWithUsers?.owners;
    const siteLikes = siteWithUsers?.likes;
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
    const parsedSiteLikes = siteLikes?.map((likeUser) => ({
      id: likeUser.id,
      name: likeUser.name,
      businessName: likeUser.businessName,
      score: likeUser.score,
      level: likeUser.level,
      avatar: likeUser.profile_pic?.url || likeUser.avatar,
    }));
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
    // const siteWeather = await getWeather({
    //   id: output.data.id,
    //   lat: output.data.attributes.lat,
    //   lng: output.data.attributes.lng,
    // });
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
          likes: parsedSiteLikes,
        },
      },
    };
  },
}));
