###*
# JS API for Metalsmith site generation
###
metalsmith  = require "metalsmith"

# Plugins
concat      = require "metalsmith-concat-convention"
inplace     = require "metalsmith-in-place"
layouts     = require "metalsmith-nestedlayouts"
minify      = require "metalsmith-clean-css"
partials    = require "metalsmith-partial"
sitemap     = require "metalsmith-sitemap"
uglify      = require "metalsmith-uglify"

prebuild    = require "./lib/prebuild.js"

# Read config
path        = require "path"
jsonfile    = require "jsonfile"
config      = jsonfile.readFileSync path.join __dirname, "metalsmith.json"
opts        = config.plugins


# Build the website
metalsmith __dirname
    .source config.source
    .destination config.destination
    .metadata config.metadata

    # Prebuild tasks
    .use prebuild()

    # Concatenate JS and CSS
    .use concat opts["metalsmith-concat-convention"]

    # Minify CSS
    .use minify opts["metalsmith-clean-css"]

    # Uglify JS
    .use uglify opts["metalsmith-uglify"]

    # Render partials
    .use partials opts["metalsmith-partial"]

    # Render layouts
    .use layouts opts["metalsmith-nestedlayouts"]

    # Render templates
    .use inplace opts["metalsmith-in-place"]

    # Generate sitemap.xml
    .use sitemap opts["metalsmith-sitemap"]

    .build (err) ->
        if err then throw err
