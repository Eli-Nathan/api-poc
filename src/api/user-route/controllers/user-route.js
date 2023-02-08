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
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      ctx.query.filters.owner = ctx.state.user.id;
      const routes = await super.find(ctx);
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

    // findOnePublic method
    async findOnePublic(ctx) {
      if (!ctx.query) {
        ctx.query = {};
      }
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      ctx.query.filters.public = true;
      const routes = await super.findOne(ctx);
      return this.sanitizeOutput(routes, ctx);
    },
  })
);
