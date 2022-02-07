"use strict";

/**
 * edit-request router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/edit-requests",
      handler: "edit-request.find",
      middlewares: ["populate-edits"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "GET",
      path: "/edit-requests/:id",
      handler: "edit-request.findOne",
      middlewares: ["populate-edits"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "POST",
      path: "/edit-requests",
      handler: "edit-request.create",
      middlewares: ["populate-edits"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::set-owner"],
      },
    },
  ],
};
