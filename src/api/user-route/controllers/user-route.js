"use strict";

/**
 *  user-route controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const utils = require("@strapi/utils");

const { parseMultipartData } = utils;

module.exports = createCoreController(
  "api::user-route.user-route",
  ({ strapi }) => ({
    // find method
    async find(ctx) {
      if (!ctx.query) {
        ctx.query = {};
      }
      const currentPopulateList = ctx.query.populate || [];
      const query = {
        ...ctx.query,
        filters: {
          populate: currentPopulateList,
          owner: ctx.state.user.id,
        },
      };
      const routes = await super.find({ query });
      return this.sanitizeOutput(routes, ctx);
    },

    // findOne method
    async findOne(ctx) {
      const route = await super.findOne(ctx);

      if (!route) {
        ctx.status = 404;
        return { status: 404, message: "Route not found" };
      }
      return this.sanitizeOutput(route, ctx);
    },

    // findPublic method
    async findPublic(ctx) {
      const query = {
        ...ctx.query,
        filters: {
          public: true,
          owner: { $not: ctx.state.user.id },
        },
      };

      const routes = await super.find({ query });
      return this.sanitizeOutput(routes, ctx);
    },

    // findOnePublic method
    async findOnePublic(ctx) {
      const query = {
        ...ctx.query,
        filters: {
          public: true,
          owner: { $not: ctx.state.user.id },
        },
      };

      const routes = await super.findOne({ query });
      return this.sanitizeOutput(routes, ctx);
    },
  })
);
