"use strict";

/**
 * comment router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/comments",
      handler: "comment.find",
      middlewares: ["populate-comments"],
    },
    {
      method: "POST",
      path: "/comments",
      handler: "comment.create",
      middlewares: ["populate-comments"],
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::set-owner"],
      },
    },
  ],
};
