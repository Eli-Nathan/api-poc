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
      return ctx.unauthorized(`You can't update this entry`);
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
};
