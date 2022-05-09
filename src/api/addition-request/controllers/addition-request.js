"use strict";

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
      console.log("addingBusiness", ctx.request.body.data.addingBusiness);
      console.log("role high enough", ctx.state.user.role.level > 0);
      console.log(
        `siteCount: ${ctx.state.user.siteCount} < maxSites: ${ctx.state.user.maxSites}`,
        (ctx.state.user.siteCount || 0) < (ctx.state.user.maxSites || 0)
      );
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
          return this.sanitizeOutput(addition, ctx);
        }
      }
    },
  })
);
