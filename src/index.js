"use strict";
const axios = require("axios");

const auth0domain = process.env.AUTH0_DOMAIN;

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.container.get("auth").register("content-api", {
      name: "auth0-jwt-verifier",
      async authenticate(ctx) {
        if (ctx.state.user) {
          // request is already authenticated in a different way
          return { authenticated: true };
        }

        if (
          ctx.request &&
          ctx.request.header &&
          ctx.request.header.authorization
        ) {
          try {
            const data = await axios({
              method: "POST",
              url: auth0domain,
              headers: {
                Authorization: ctx.request.header.authorization,
              },
            });

            const userData = data.data;

            const user = await strapi.db
              .query(`api::auth-user.auth-user`)
              .findOne({
                where: {
                  user_id: userData.sub,
                },
              });

            ctx.state.user = user;
            ctx.state.user.sub = userData.sub;

            if (userData) {
              return { authenticated: true, credentials: user };
            }
            return { authenticated: false };
          } catch (error) {
            return ctx.unauthorized(error);
          }
        }

        // Execute the action.
        return { authenticated: false };
      },
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
