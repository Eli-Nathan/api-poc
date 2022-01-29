module.exports = {
  routes: [
    {
      method: "GET",
      path: "/sites",
      handler: "site.find",
      config: {
        policies: ["plugin::users-permissions.isAuthed"],
      },
    },
    {
      method: "GET",
      path: "/sites/:id",
      handler: "site.findOne",
    },
    {
      method: "GET",
      path: "/sites/:id/safe",
      handler: "site.findOneSafe",
    },
    {
      method: "POST",
      path: "/sites",
      handler: "site.create",
    },
    {
      method: "PUT",
      path: "/sites/:id",
      handler: "site.update",
    },
    {
      method: "DELETE",
      path: "/sites/:id",
      handler: "site.delete",
    },
  ],
};
