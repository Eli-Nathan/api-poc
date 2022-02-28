'use strict';

/**
 * site-type service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::site-type.site-type');
