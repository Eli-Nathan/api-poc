"use strict";

/**
 * find router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

// module.exports = createCoreRouter("api::find.find");

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/forms",
      handler: "form.find",
    },
    {
      method: "GET",
      path: "/forms/:id",
      handler: "form.findOne",
    },
  ],
};
