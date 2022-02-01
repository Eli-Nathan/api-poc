module.exports = {
  routes: [
    {
      method: "GET",
      path: "/sites",
      handler: "site.find",
    },
    {
      method: "GET",
      path: "/sites/:id",
      handler: "site.findOne",
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
