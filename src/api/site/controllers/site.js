"use strict";

/**
 *  site controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site.site", ({ strapi }) => ({
  async findOneSafe(ctx) {
    const { id } = ctx.params;
    console.log("one afe", id);
    const entity = await strapi.service("api::site.site").findOne(id);

    const sanitized = await this.sanitizeOutput(entity, ctx);

    const { created_at, published_at, updated_at, ...rest } =
      this.transformResponse(sanitized);
    return rest;
  },
}));
