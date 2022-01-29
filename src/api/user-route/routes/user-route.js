'use strict';

/**
 * user-route router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-route.user-route');
