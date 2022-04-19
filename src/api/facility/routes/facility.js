"use strict";

/**
 * facility router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::facility.facility");

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/facilities",
      handler: "facility.find",
      middlewares: ["populate-facilities"],
    },
  ],
};
