module.exports = ({ env }) => {
  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_SECRET"),
        },
        actionOptions: {
          upload: "hnafqp5p",
        },
      },
    },
    moderator: {
      enabled: true,
      resolve: "./src/plugins/moderator",
    },
    "content-export-import": {
      enabled: true,
      resolve: "./src/plugins/content-export-import", // path to plugin folder
    },
  };
};
