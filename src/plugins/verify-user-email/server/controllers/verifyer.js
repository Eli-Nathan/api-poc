"use strict";

module.exports = {
  async getUnverifiedUsers(ctx) {
    ctx.body = await strapi
      .plugin("verify-user-email")
      .service("verifyer")
      .getUnverifiedUsers();
  },
  async verifyUser(ctx) {
    const { params } = ctx;
    ctx.body = await strapi
      .plugin("verify-user-email")
      .service("verifyer")
      .verifyUser(params.id);
  },
};
