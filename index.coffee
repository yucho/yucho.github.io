metalsmith	= require "metalsmith"
debug		= require "metalsmith-debug"
ignore		= require "metalsmith-ignore"
inplace		= require "metalsmith-in-place"
layouts		= require "metalsmith-layouts"
partials	= require "metalsmith-jstransformer-partials"
writemeta	= require "metalsmith-writemetadata"
{inspect}	= require "util"
{bundlestyles} = require "./util.coffee"

path = require "path"

process.env.DEBUG="metalsmith:*"

# Metalsmith instance
metalsmith __dirname
	# Useful in templates
	.metadata
		site:
			author: "Yucho Ho"
			url: "https://yuchoho.com"
			title: "Astropolitan Project"
			description: "Yucho Ho's personal blog."
			keywords: "Yucho Ho, blog"
	
	# Source directory
	.source "./src"

	# Output directory
	.destination "./dest"

	# Render partials
	.use partials()

	# Pass layouts to renderer
	.use layouts
		directory: "src/layouts"

	# Render cs templates
	.use inplace
		engine: "eco"
		engineOptions:
			path: "src"

	# Bundle some css
	.use bundlestyles
		outputDir: "styles"
###
	# Debug
	.use (files, metadata) ->
		for key, value of files
			if not ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes key.split('.').pop()
				console.log key
				console.log ''
				console.log value
				console.log ''
###
	# Not to render
	.use ignore [
		"layouts/*"
	]

	# Build my blog
	.build (err) ->
		if err then throw err
