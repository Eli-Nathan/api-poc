"use strict";

/**
 *  edit-request controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::edit-request.edit-request",
  ({ strapi }) => ({
    // create method
    async create(ctx) {
      const siteId = ctx.request.body.data.site;
      if (ctx.state.user) {
        const site = await strapi.db.query(`api::site.site`).findOne({
          where: {
            id: siteId,
          },
          populate: {
            owners: true,
          },
        });
        const ownersIds = site?.owners?.map((s) => s.id).filter(Boolean);
        const isOwnerEditing = ownersIds?.includes(ctx.state.user.id);
        if (isOwnerEditing) {
          const newSite = await strapi.db.query(`api::site.site`).update({
            where: { id: siteId },
            data: {
              ...ctx.request.body.data.data,
              images: ctx.request.body.data.images,
            },
          });
          return {
            data: {
              attributes: {
                site: await this.sanitizeOutput(newSite, ctx),
                ownerUpdated: true,
              },
            },
          };
        }
      }
      const edit = await super.create(ctx);
      return this.sanitizeOutput(edit, ctx);
    },
  })
);
