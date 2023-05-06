"use strict";

/**
 *  nomad-route controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::nomad-route.nomad-route",
  ({ strapi }) => ({
    // find method
    async find(ctx) {
      const routes = await super.find(ctx);
      return this.sanitizeOutput(routes, ctx);
    },

    // findOne method
    async findOne(ctx) {
      const route = await strapi.entityService.findOne(
        `api::nomad-route.nomad-route`,
        ctx.params.id,
        {
          populate: {
            image: true,
            tags: true,
            pois: {
              populate: {
                type: {
                  populate: {
                    remote_icon: true,
                    remote_marker: true,
                  },
                },
              },
              images: true,
            },
            stay: {
              populate: {
                type: {
                  populate: {
                    remote_icon: true,
                    remote_marker: true,
                  },
                },
              },
              images: true,
            },
          },
        }
      );

      console.log("route", route);

      if (!route) {
        ctx.status = 404;
        return { status: 404, message: "Route not found" };
      }
      return this.transformResponse(route);
    },
  })
);
