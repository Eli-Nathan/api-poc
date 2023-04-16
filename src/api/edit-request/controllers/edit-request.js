"use strict";

const { sendEntryToSlack } = require("../../../nomad/slack");

/**
 *  edit-request controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const getEditableFieldsFromSite = (siteData) => {
  const { title, description, tel, email, facilities, pricerange, url } =
    siteData;
  return {
    title,
    description,
    tel,
    email,
    facilities,
    pricerange,
    url,
  };
};

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
          const safeData = getEditableFieldsFromSite(
            ctx.request.body.data.data
          );
          const images = Array.isArray(ctx.request.body.data.images)
            ? { images: ctx.request.body.data.images }
            : {};
          const newSite = await strapi.db.query(`api::site.site`).update({
            where: { id: siteId },
            data: {
              ...safeData,
              ...images,
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
      await sendEntryToSlack(edit, "editRequest", ctx);
      return this.sanitizeOutput(edit, ctx);
    },
  })
);
