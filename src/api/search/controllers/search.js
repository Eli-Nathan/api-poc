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
        communityRoutesStart = 0,
        communityRoutesLimit = 8,
        usersStart = 0,
        usersLimit = 8,
      } = ctx.request.query;

      let sites;
      let popularRoutes;
      let communityRoutes;
      let people;

      sites = await strapi
        .service("api::search.search")
        .searchSites(query, sitesStart, sitesLimit);

      popularRoutes = await strapi
        .service("api::search.search")
        .searchPopularRoutes(query, popularRoutesStart, popularRoutesLimit);

      if (ctx.state.user) {
        communityRoutes = await strapi
          .service("api::search.search")
          .searchCommunityRoutes(
            query,
            communityRoutesStart,
            communityRoutesLimit
          );
        people = await strapi
          .service("api::search.search")
          .searchUsers(query, usersStart, usersLimit);
      }

      ctx.body = { sites, popularRoutes, communityRoutes, people };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
