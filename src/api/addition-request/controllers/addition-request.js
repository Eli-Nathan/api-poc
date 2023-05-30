"use strict";

const { sendEntryToSlack } = require("../../../nomad/slack");

/**
 *  addition-request controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
//addingBusiness

module.exports = createCoreController(
  "api::addition-request.addition-request",
  ({ strapi }) => ({
    // create method
    async create(ctx) {
      if (ctx.state.user) {
        if (
          ctx.request.body.data.addingBusiness &&
          ctx.state.user.role.level > 0 &&
          (ctx.state.user.siteCount || 0) < (ctx.state.user.maxSites || 0)
        ) {
          const newSite = await strapi.db.query(`api::site.site`).create({
            data: {
              ...ctx.request.body.data,
              owners: [ctx.state.user.id],
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
        } else {
          const addition = await super.create(ctx);
          // await sendEntryToSlack(addition, "additionRequest", ctx);
          return this.sanitizeOutput(addition, ctx);
        }
      }
    },
  })
);
