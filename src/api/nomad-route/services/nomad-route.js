'use strict';

/**
 * nomad-route service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::nomad-route.nomad-route');
