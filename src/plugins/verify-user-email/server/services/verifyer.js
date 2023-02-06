"use strict";
const authAdmin = require("firebase-admin/auth");

module.exports = ({ strapi }) => ({
  async getUnverifiedUsers() {
    const unverifiedUsers = await strapi.db
      .query("api::auth-user.auth-user")
      .findMany({
        where: {
          isVerified: false,
        },
      });
    return unverifiedUsers;
  },
  async verifyUser(id) {
    const user = await strapi.db.query(`api::auth-user.auth-user`).findOne({
      where: { id },
    });
    authAdmin.getAuth().updateUser(user.user_id, { emailVerified: true });
    const updatedUser = await strapi.db
      .query(`api::auth-user.auth-user`)
      .update({
        where: { id },
        data: {
          isVerified: true,
        },
      });
    return updatedUser;
  },
});
