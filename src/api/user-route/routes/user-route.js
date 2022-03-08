"use strict";

/**
 * user-route router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-routes",
      handler: "user-route.find",
      middlewares: ["populate-user-routes"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "GET",
      path: "/user-routes/public",
      handler: "user-route.findPublic",
      middlewares: ["populate-user-routes"],
      config: {
        policies: [
          "plugin::users-permissions.isAuthed",
          "global::is-not-owner",
        ],
      },
    },
    {
      method: "GET",
      path: "/user-routes/:id",
      handler: "user-route.findOne",
      middlewares: ["populate-user-routes"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "GET",
      path: "/user-routes/public/:id",
      handler: "user-route.findOnePublic",
      middlewares: ["populate-user-routes"],
      config: {
        policies: [
          "plugin::users-permissions.isAuthed",
          "global::is-not-owner",
        ],
      },
    },
    {
      method: "POST",
      path: "/user-routes",
      handler: "user-route.create",
      middlewares: ["populate-user-routes"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::set-owner"],
      },
    },
    {
      method: "PUT",
      path: "/user-routes/:id",
      handler: "user-route.update",
      middlewares: ["populate-user-routes"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "DELETE",
      path: "/user-routes/:id",
      handler: "user-route.delete",
      middlewares: ["populate-user-routes"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
  ],
};
