"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.owner = ctx.state.user.sub;
      entity = await strapi.services["user-routes"].create(data, { files });
    } else {
      ctx.request.body.owner = ctx.state.user.sub;
      entity = await strapi.services["user-routes"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["user-routes"] });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [route] = await strapi.services["user-routes"].find({
      id: ctx.params.id,
      owner: ctx.state.user.sub,
    });

    if (!route) {
      return ctx.unauthorized(`You can't update this route`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["user-routes"].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services["user-routes"].update(
        { id },
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, { model: strapi.models["user-routes"] });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    let entity;

    const [route] = await strapi.services["user-routes"].find({
      id: ctx.params.id,
      owner: ctx.state.user.sub,
    });

    if (!route) {
      return ctx.unauthorized(`You can't delete this route`);
    }

    entity = await strapi.services["user-routes"].delete({ id });

    return sanitizeEntity(entity, { model: strapi.models["user-routes"] });
  },

  async find(ctx) {
    let routes;

    if (ctx.query) {
      routes = await strapi.services["user-routes"].find({
        ...ctx.query,
        owner: ctx.state.user.sub,
      });
      return sanitizeEntity(routes, { model: strapi.models["user-routes"] });
    }

    routes = await strapi.services["user-routes"].find({
      owner: ctx.state.user.sub,
    });

    return sanitizeEntity(routes, { model: strapi.models["user-routes"] });
  },

  async count(ctx) {
    let routes;

    if (ctx.query) {
      routes = await strapi.services["user-routes"].count({
        ...ctx.query,
        owner: ctx.state.user.sub,
      });
      return sanitizeEntity(routes, { model: strapi.models["user-routes"] });
    }

    routes = await strapi.services["user-routes"].count({
      owner: ctx.state.user.sub,
    });
    return sanitizeEntity(routes, { model: strapi.models["user-routes"] });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    let routes;

    const [route] = await strapi.services["user-routes"].find({
      id: ctx.params.id,
      owner: ctx.state.user.sub,
    });

    if (!route) {
      ctx.status = 404;
      return { status: 404, message: "Route not found" };
    }
    return sanitizeEntity(route, { model: strapi.models["user-routes"] });
  },

  async findPublic(ctx) {
    let routes;

    if (ctx.query) {
      routes = await strapi.services["user-routes"].find({
        ...ctx.query,
        public: true,
      });
      return sanitizeEntity(routes, { model: strapi.models["user-routes"] });
    }

    routes = await strapi.services["user-routes"].find({
      public: true,
    });
    return sanitizeEntity(routes, { model: strapi.models["user-routes"] });
  },
};
