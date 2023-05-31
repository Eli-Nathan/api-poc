module.exports = async ({ strapi, subject, address, text, html }) => {
  await strapi.plugins["email"].services.email.send({
    to: address,
    from: "wildway <wildway.app@gmail.com>",
    replyTo: "wildway.app@gmail.com",
    subject,
    text,
    html,
  });
};
