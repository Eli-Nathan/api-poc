module.exports = {
  routes: [
    {
      method: "GET",
      path: "/search",
      handler: "search.globalSearch",
    },
    {
      method: "GET",
      path: "/v2/search",
      handler: "search.globalSearchWithOSM",
    },
  ],
};
