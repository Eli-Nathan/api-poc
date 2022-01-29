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
      config: {
        policies: ["plugin::users-permissions.isAuthed"],
      },
    },
    {
      method: "GET",
      path: "/addition-requests/:id",
      handler: "addition-request.findOne",
    },
    {
      method: "POST",
      path: "/addition-requests",
      config: {
        policies: ["plugin::users-permissions.isAuthed"],
      },
      handler: "addition-request.create",
    },
  ],
};
