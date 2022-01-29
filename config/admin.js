module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'fd45234fab05a783ed7030497c581826'),
  },
});
