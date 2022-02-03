"use strict";

/**
 * addition-request router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

// module.exports = createCoreRouter("api::addition-request.addition-request");

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/addition-requests",
      handler: "addition-request.find",
      middlewares: ["populate-additions"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "GET",
      path: "/addition-requests/:id",
      handler: "addition-request.findOne",
      middlewares: ["populate-additions"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "POST",
      path: "/addition-requests",
      handler: "addition-request.create",
      middlewares: ["populate-additions"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::set-owner"],
      },
    },
  ],
};
