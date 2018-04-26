###*
# JS API for Metalsmith site generation
###
metalsmith  = require "metalsmith"

# Plugins
concat      = require "metalsmith-concat-convention"
minify      = require "metalsmith-clean-css"
sitemap     = require "metalsmith-sitemap"
uglify      = require "metalsmith-uglify"

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

    # Concatenate JS and CSS
    .use concat opts["metalsmith-concat-convention"]

    # Minify CSS
    .use minify opts["metalsmith-clean-css"]

    # Uglify JS
    .use uglify opts["metalsmith-uglify"]

    # Generate sitemap.xml
    .use sitemap opts["metalsmith-sitemap"]

    .build (err) ->
        if err then throw err
