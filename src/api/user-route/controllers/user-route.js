'use strict';

/**
 *  user-route controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-route.user-route');
