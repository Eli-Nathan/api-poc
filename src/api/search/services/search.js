"use strict";
const { getPlacesFromQuery } = require("../../../nomad/dataEnrichment/place");
/**
 * search service
 */

module.exports = {
  searchSites: async (query, start, limit) => {
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

  searchUnlistedSites: async (query) => {
    const places = await getPlacesFromQuery({ query });
    return places;
  },

  searchCommunityRoutes: async (query, start, limit) => {
    try {
      // fetching data
      const routes = await strapi.entityService.findMany(
        "api::user-route.user-route",
        {
          fields: ["name"],
          filters: {
            public: true,
            name: {
              $containsi: `${query}`,
            },
          },
          populate: {
            image: true,
            tags: true,
            sites: true,
          },
        }
      );

      // return the reduced data
      return routes;
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
  searchUsers: async (query, start, limit) => {
    try {
      // fetching data
      const users = await strapi.entityService.findMany(
        "api::auth-user.auth-user",
        {
          start,
          limit,
          filters: {
            isVerified: true,
            name: {
              $containsi: `${query}`,
            },
          },
          populate: {
            profile_pic: true,
            tags: true,
          },
          fields: ["name", "avatar", "businessName", "score"],
        }
      );

      // return the reduced data
      return users;
    } catch (err) {
      return err;
    }
  },

  transformOSMToUnlistedSite: (osmSite) => {
    const nameWithSuffix = getNameWithSuffix(
      osmSite.namedetails.name,
      osmSite.address
    );
    return {
      unlisted: true,
      id: `osm_${osmSite.osm_id}`,
      title: nameWithSuffix,
      type: {
        id: `osm_type_${osmSite.type}`,
        slug: osmSite.type,
        name: osmSite.type,
      },
      lat: osmSite.lat,
      lng: osmSite.lon,
    };
  },
};

const getNameWithSuffix = (name, address) => {
  if (address.city && address.city !== name) {
    return `${name}, ${address.city}`;
  }
  if (address.town && address.town !== name) {
    return `${name}, ${address.town}`;
  }
  if (address.county && address.county !== name) {
    return `${name}, ${address.county}`;
  }
  if (address.neighborhood && address.neighborhood !== name) {
    return `${name}, ${address.neighborhood}`;
  }
  if (address.suburb && address.suburb !== name) {
    return `${name}, ${address.suburb}`;
  }
  return "";
};
