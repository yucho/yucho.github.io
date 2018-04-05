###*
# Metalsmith site generation
###
metalsmith  = require "metalsmith"

# Plugins
concat      = require "metalsmith-concat-convention"
minify      = require "metalsmith-clean-css"
uglify      = require "metalsmith-uglify"

# Build the website
metalsmith __dirname
    .source "src"
    .destination "dest"

    # Concatenate JS and CSS
    .use concat
        extname: ".concat"

    # Minify CSS
    .use minify
        files: ["src/scripts/**/*.css"]

    # Uglify JS
    .use uglify
        sameName: true

    .build (err) ->
        if err then throw err
