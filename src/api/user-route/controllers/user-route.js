"use strict";
const { createCoreController } = require("@strapi/strapi").factories;
const utils = require("@strapi/utils");

const logger = require("../../../nomad/logger");
const generatePolyline = require("../../../nomad/getPolyline");

const { parseMultipartData } = utils;

const checkIfPlacesMatch = (api, req) => {
  if (api.length !== req.length) {
    return false;
  }
  const eachMatch = api.map((place, i) => {
    if (place.site && req[i].site) {
      return place.site.id === req[i].site;
    } else if (place.custom && req[i].custom) {
      const matchingLat = place.custom.lat === req[i].custom.lat;
      const matchingLng = place.custom.lng === req[i].custom.lng;
      return matchingLat && matchingLng;
    }
    return false;
  });
  return eachMatch.every(Boolean);
};

/**
 *  user-route controller
 */

module.exports = createCoreController(
  "api::user-route.user-route",
  ({ strapi }) => ({
    // find method
    async find(ctx) {
      if (!ctx.query) {
        ctx.query = {};
      }
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      ctx.query.filters.owner = ctx.state.user.id;
      const routes = await super.find(ctx);
      return this.sanitizeOutput(routes, ctx);
    },

    // findOne method
    async findOne(ctx) {
      const route = await strapi.entityService.findOne(
        `api::user-route.user-route`,
        ctx.params.id,
        {
          filters: {
            owner: ctx.state.user.id,
          },
          populate: {
            image: true,
            sites: {
              populate: {
                site: {
                  populate: {
                    type: true,
                  },
                },
              },
            },
            owner: {
              populate: {
                profile_pic: true,
              },
            },
          },
        }
      );

      if (!route) {
        ctx.status = 404;
        return { status: 404, message: "Route not found" };
      }
      return this.transformResponse(route);
    },

    async findPublic(ctx) {
      if (!ctx.query) {
        ctx.query = {};
      }
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      if (!ctx.query.populate) {
        ctx.query.populate = [];
      }
      ctx.query.populate = [
        ...ctx.query.populate,
        "image",
        "owner",
        "owner.profile_pic",
      ];
      ctx.query.filters.public = true;
      const routes = await super.find(ctx);
      return this.sanitizeOutput(routes, ctx);
    },

    async findRoutesByUserId(ctx) {
      if (!ctx.query) {
        ctx.query = {};
      }
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      if (!ctx.query.populate) {
        ctx.query.populate = [];
      }
      ctx.query.populate = [
        ...ctx.query.populate,
        "image",
        "owner",
        "owner.profile_pic",
      ];
      const isOwner = Number(ctx.state.user.id) === Number(ctx.params.id);
      if (!isOwner) {
        ctx.query.filters.public = true;
      }
      ctx.query.filters.owner = Number(ctx.params.id);
      const routes = await super.find(ctx);
      return this.sanitizeOutput(routes, ctx);
    },

    // findOnePublic method
    async findOnePublic(ctx) {
      if (!ctx.query) {
        ctx.query = {};
      }
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      ctx.query.filters.public = true;
      const route = await strapi.entityService.findOne(
        `api::user-route.user-route`,
        ctx.params.id,
        {
          filters: {
            public: true,
          },
          populate: {
            image: true,
            sites: {
              populate: {
                site: {
                  populate: {
                    type: true,
                  },
                },
              },
            },
            owner: {
              populate: {
                profile_pic: true,
              },
            },
          },
        }
      );
      return this.transformResponse(route);
    },

    // create method
    async create(ctx) {
      if (!ctx.request?.body?.data) {
        return {
          status: 400,
          message: "Bad request",
        };
      }

      const sitesAsWaypoints = (ctx.request.body.data.sites || []).map(
        (site) => {
          if (site.custom) {
            return {
              latitude: site.custom.lat,
              longitude: site.custom.lng,
            };
          }
          return {
            latitude: site.lat,
            longitude: site.lng,
          };
        }
      );

      const waypointsWithoutFirstAndLast = [...sitesAsWaypoints].filter(
        (_f, i) => i !== 0 && i !== sitesAsWaypoints.length - 1
      );
      const waypoints =
        waypointsWithoutFirstAndLast.length > 0
          ? waypointsWithoutFirstAndLast
          : undefined;
      const origin = sitesAsWaypoints?.[0];
      const destination = sitesAsWaypoints?.[sitesAsWaypoints.length - 1];

      const polyline = await generatePolyline({
        waypoints,
        origin,
        destination,
      });
      if (polyline) {
        ctx.request.body.data.polyline = polyline;
      }
      const route = await super.create(ctx);
      const sanitized = await this.sanitizeOutput(route, ctx);
      if (!polyline) {
        logger.warn(
          "No polyline generated when creating route:",
          sanitized?.data?.id
        );
      }
      return sanitized;
    },

    // update method
    async update(ctx) {
      const existingRoute = await strapi.entityService.findOne(
        `api::user-route.user-route`,
        ctx.params.id,
        {
          fields: ["polyline"],
          populate: {
            sites: {
              populate: {
                site: { fields: ["id"] },
              },
            },
          },
        }
      );

      const sitesHaveChanged = !checkIfPlacesMatch(
        existingRoute.sites,
        ctx.request.body.data.sites
      );

      const sitesAsWaypoints = (ctx.request.body.data.sites || []).map(
        (site) => {
          if (site.custom) {
            return {
              latitude: site.custom.lat,
              longitude: site.custom.lng,
            };
          }
          return {
            latitude: site.lat,
            longitude: site.lng,
          };
        }
      );

      if (sitesHaveChanged) {
        const waypointsWithoutFirstAndLast = [...sitesAsWaypoints].filter(
          (_f, i) => i !== 0 && i !== sitesAsWaypoints.length - 1
        );
        const waypoints =
          waypointsWithoutFirstAndLast.length > 0
            ? waypointsWithoutFirstAndLast
            : undefined;
        const origin = sitesAsWaypoints?.[0];
        const destination = sitesAsWaypoints?.[sitesAsWaypoints.length - 1];

        const polyline = await generatePolyline({
          waypoints,
          origin,
          destination,
        });
        if (polyline) {
          ctx.request.body.data.polyline = polyline;
        } else {
          logger.warn(
            `No polyline generated when updating route: ${ctx.params.id}`
          );
        }
      }

      const route = await super.update(ctx);
      return await this.sanitizeOutput(route, ctx);
    },
  })
);
