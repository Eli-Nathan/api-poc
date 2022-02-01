"use strict";

/**
 *  user-route controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const utils = require("@strapi/utils");

const { parseMultipartData } = utils;

const populateList = ["sites.site", "image"];

const enrichCtx = (ctx) => {
  if (!ctx.query) {
    ctx.query = {};
  }
  const currentPopulateList = ctx.query.populate || [];
  ctx.query.populate = [...currentPopulateList, ...populateList];
  return ctx;
};

module.exports = createCoreController(
  "api::user-route.user-route",
  ({ strapi }) => ({
    // find method
    async find(ctx) {
      const controllerCtx = enrichCtx(ctx);
      const routes = await super.find(controllerCtx);

      return this.sanitizeOutput(routes, ctx);
    },

    // findOne method
    async findOne(ctx) {
      const controllerCtx = enrichCtx(ctx);
      const route = await super.findOne(controllerCtx);

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
        },
      };

      const routes = await super.find({ query });
      return this.sanitizeOutput(routes, ctx);
    },

    // create method
    async create(ctx) {
      const controllerCtx = enrichCtx(ctx);
      const entity = await super.create(controllerCtx);

      return this.sanitizeOutput(entity, ctx);
    },

    // update method
    async update(ctx) {
      const controllerCtx = enrichCtx(ctx);
      const entity = await super.update(controllerCtx);

      return this.sanitizeOutput(entity, ctx);
    },

    // delete method
    async delete(ctx) {
      const controllerCtx = enrichCtx(ctx);

      const entity = await super.delete(controllerCtx);

      return this.sanitizeOutput(entity, ctx);
    },
  })
);
