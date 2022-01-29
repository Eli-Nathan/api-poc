'use strict';

/**
 * user-route service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-route.user-route');
