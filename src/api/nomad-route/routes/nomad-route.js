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
      middlewares: ["populate-nomad-routes"],
    },
    {
      method: "GET",
      path: "/nomad-routes/:id",
      handler: "nomad-route.findOne",
      middlewares: ["populate-nomad-routes"],
    },
    {
      method: "GET",
      path: "/nomad-routes/uid/:slug",
      handler: "nomad-route.findOneByUID",
      middlewares: ["populate-nomad-routes"],
    },
  ],
};
