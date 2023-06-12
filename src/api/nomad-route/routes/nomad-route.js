"use strict";

/**
 * nomad-route router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/nomad-routes",
      handler: "nomad-route.find",
      config: {
        middlewares: ["api::nomad-route.populate-nomad-routes"],
      },
    },
    {
      method: "GET",
      path: "/nomad-routes/:id",
      handler: "nomad-route.findOne",
      config: {
        middlewares: ["api::nomad-route.populate-nomad-routes"],
      },
    },
    {
      method: "GET",
      path: "/nomad-routes/uid/:slug",
      handler: "nomad-route.findOneByUID",
      config: {
        middlewares: ["api::nomad-route.populate-nomad-routes"],
      },
    },
  ],
};
