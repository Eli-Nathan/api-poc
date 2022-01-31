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
      let routes;

      if (ctx.query) {
        routes = await this.find({
          ...ctx.query,
          owner: ctx.state.user.sub,
        });
        return this.sanitizeOutput(routes, ctx);
      }

      routes = await this.find({
        owner: ctx.state.user.sub,
      });

      return this.sanitizeOutput(routes, ctx);
    },

    // findOne method
    async findOne(ctx) {
      const { id } = ctx.params;
      let routes;

      const [route] = await this.find({
        id: ctx.params.id,
        owner: ctx.state.user.sub,
      });

      if (!route) {
        ctx.status = 404;
        return { status: 404, message: "Route not found" };
      }
      return this.sanitizeOutput(route, ctx);
    },

    // findPublic method
    async findPublic(ctx) {
      let routes;

      if (ctx.query) {
        routes = await this.find({
          ...ctx.query,
          public: true,
        });
        return this.sanitizeOutput(routes, ctx);
      }

      routes = await this.find({
        public: true,
      });
      return this.sanitizeOutput(routes, ctx);
    },

    // create method
    async create(ctx) {
      let entity;
      if (ctx.is("multipart")) {
        const { data, files } = parseMultipartData(ctx);
        data.owner = ctx.state.user.sub;
        entity = await this.create(data, { files });
      } else {
        ctx.request.body.owner = ctx.state.user.sub;
        entity = await this.create(ctx.request.body);
      }
      return this.sanitizeOutput(entity, ctx);
    },

    // update method
    async update(ctx) {
      const { id } = ctx.params;

      let entity;

      const [route] = await this.find({
        id: ctx.params.id,
        owner: ctx.state.user.sub,
      });

      if (!route) {
        return ctx.unauthorized(`You can't update this entry`);
      }

      if (ctx.is("multipart")) {
        const { data, files } = parseMultipartData(ctx);
        entity = await this.update({ id }, data, {
          files,
        });
      } else {
        entity = await this.update({ id }, ctx.request.body);
      }

      return this.sanitizeOutput(entity, ctx);
    },

    // delete method
    async delete(ctx) {
      const { id } = ctx.params;

      let entity;

      const [route] = await this.find({
        id: ctx.params.id,
        owner: ctx.state.user.sub,
      });

      if (!route) {
        return ctx.unauthorized(`You can't delete this route`);
      }

      entity = await this.delete({ id });

      return this.sanitizeOutput(entity, ctx);
    },
  })
);
