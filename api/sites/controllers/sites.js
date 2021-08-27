"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findOneSafe: async (ctx) => {
    const { id } = ctx.params;

    const entity = await strapi.services.sites.findOne({ id });
    const sanitized = sanitizeEntity(entity, {
      model: strapi.models.sites,
      includeFields: ["title", "description", "Tel", "pricerange", "image"],
    });

    const {
      id: _id,
      created_at,
      published_at,
      updated_at,
      ...rest
    } = sanitized;
    return rest;
  },
};
