"use strict";

/**
 * form-submission router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

// module.exports = createCoreRouter("api::form-submission.form-submission");

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/form-submissions",
      handler: "form-submission.find",
    },
    {
      method: "GET",
      path: "/form-submissions/:id",
      handler: "form-submission.findOne",
    },
    {
      method: "POST",
      path: "/form-submissions/:id",
      handler: "form-submission.create",
    },
  ],
};
