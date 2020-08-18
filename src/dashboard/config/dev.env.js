/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: `"${process.env.API_URL || ''}"`
})