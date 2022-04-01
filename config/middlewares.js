module.exports = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::favicon",
  "strapi::public",
  {
    name: "strapi::body",
    config: {
      formLimit: "10mb",
      jsonLimit: "10mb",
      textLimit: "10mb",
    },
  },
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "res.cloudinary.com"],
          "media-src": ["'self'", "data:", "blob:", "res.cloudinary.com"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "api::user-route.populate-user-routes",
  "api::addition-request.populate-additions",
  "api::edit-request.populate-edits",
  "api::site.populate-sites",
  "api::site.populate-site",
  "api::home-filterlink.populate-filterlinks",
  "api::comment.populate-comments",
];
