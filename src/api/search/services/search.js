"use strict";

/**
 * search service
 */

module.exports = {
  searchSites: async (query, start, limit) => {
    console.log("foo");
    try {
      // fetching data
      const sites = await strapi.entityService.findMany("api::site.site", {
        start,
        limit,
        fields: [
          "title",
          "description",
          "category",
          "image",
          "lat",
          "lng",
          "slug",
        ],
        filters: {
          title: {
            $containsi: query,
          },
        },
        sort: { priority: "DESC" },
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
      });

      // return the reduced data
      return sites;
    } catch (err) {
      return err;
    }
  },

  searchCommunityRoutes: async (query, start, limit) => {
    try {
      // fetching data
      const routes = await strapi.entityService.findMany(
        "api::user-route.user-route",
        {
          fields: ["name", "sites", "image", "slug"],
          filters: {
            name: {
              $containsi: query,
            },
          },
          populate: {
            image: true,
            tags: true,
            owner: {
              profile_pic: true,
            },
            sites: {
              site: {
                type: true,
              },
            },
          },
        }
      );

      // return the reduced data
      return sites;
    } catch (err) {
      return err;
    }
  },
  searchPopularRoutes: async (query, start, limit) => {
    try {
      // fetching data
      const routes = await strapi.entityService.findMany(
        "api::nomad-route.nomad-route",
        {
          start,
          limit,
          filters: {
            name: {
              $containsi: `${query}`,
            },
          },
          populate: {
            image: true,
            tags: true,
          },
          fields: ["name"],
        }
      );

      // return the reduced data
      return routes;
    } catch (err) {
      return err;
    }
  },
};
