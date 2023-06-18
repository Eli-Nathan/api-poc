"use strict";

/**
 * A set of functions called "actions" for `search`
 */

module.exports = {
  globalSearch: async (ctx, next) => {
    try {
      const {
        query,
        sitesStart = 0,
        sitesLimit = 8,
        popularRoutesStart = 0,
        popularRoutesLimit = 8,
      } = ctx.request.query;

      const sites = await strapi
        .service("api::search.search")
        .searchSites(query, sitesStart, sitesLimit);

      const popularRoutes = await strapi
        .service("api::search.search")
        .searchPopularRoutes(query, popularRoutesStart, popularRoutesLimit);

      ctx.body = { sites, popularRoutes };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
