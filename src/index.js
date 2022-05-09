"use strict";
const axios = require("axios");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const authAdmin = require("firebase-admin/auth");
const logger = require("./nomad/logger");

initializeApp({
  credential: applicationDefault(),
});

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.container.get("auth").register("content-api", {
      name: "firebase-jwt-verifier",
      async authenticate(ctx) {
        // Example logs
        if (ctx.state.user) {
          // request is already authenticated in a different way
          logger.info("User already authed", {
            user: ctx.state.user,
          });
          return { authenticated: true, credentials: ctx.state.user };
        }

        if (
          ctx.request &&
          ctx.request.header &&
          ctx.request.header.authorization
        ) {
          try {
            const token = ctx.request.header.authorization.replace(
              "Bearer ",
              ""
            );
            const userData = await authAdmin.getAuth().verifyIdToken(token);

            const nomadUser = await strapi.db
              .query(`api::auth-user.auth-user`)
              .findOne({
                where: {
                  user_id: userData.sub,
                },
                populate: {
                  role: true,
                  sites: true,
                },
              });

            if (nomadUser && userData) {
              if (nomadUser.sites) {
                nomadUser.siteCount = nomadUser.sites.length || 0;
              }
              const mergedData = { ...userData, ...nomadUser };
              logger.info("User from DB", { user: mergedData });
              ctx.state.user = mergedData;
              return { authenticated: true, credentials: mergedData };
            }

            if (nomadUser) {
              logger.info("User from DB", { user: nomadUser });
              ctx.state.user = nomadUser;
              ctx.state.user.sub = userData.sub;
              return { authenticated: true, credentials: nomadUser };
            }

            if (userData) {
              ctx.state.user = userData;
              return { authenticated: true, credentials: userData };
            }
            return { authenticated: false };
          } catch (error) {
            logger.error("User login error ", error);
            return ctx.unauthorized(error);
          }
        }

        // Execute the action.
        logger.warn("User login unsuccessful");
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
