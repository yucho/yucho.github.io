metalsmith	= require "metalsmith"
cleancss	= require "metalsmith-clean-css"
collections	= require "metalsmith-collections"
concat		= require "metalsmith-concat-convention"
debug		= require "metalsmith-debug"
ignore		= require "metalsmith-ignore"
inplace		= require "metalsmith-in-place"
layouts		= require "metalsmith-nestedlayouts"
markdown	= require "metalsmith-markdown"
partials	= require "metalsmith-jstransformer-partials"
purifycss	= require "metalsmith-purifycss"
stylus		= require "metalsmith-stylus"
uglify		= require "metalsmith-uglify"
{inspect}	= require "util"
{pre, post}	= require "./util.coffee"

path = require "path"

# Metalsmith, build a website!
metalsmith __dirname

	.metadata
		site:
			author: "Yucho Ho"
			url: "https://yuchoho.com"
			title: "Astropolitan Project"
			description: "Yucho Ho's personal blog."
			keywords: "Yucho Ho, blog"
	
	.source "./src"

	.destination "./dest"

	# Pre-build tasks
	.use pre()

	# Create collections of
	.use collections
		# All posts
		posts:
			pattern: "posts/*.md"
			sortBy: "date"
			reverse: true

		# All brick images
		bricks:
			pattern: "images/bricks/*.@(gif|jpg|jpeg|png|svg)"

	# Render stylus
	.use stylus()

	# Bundle JS and CSS by purpose
	.use concat
		extname: ".concat"

	# Render markdown
	.use markdown()

	# Render partials
	.use partials()

	# Render CoffeeKup templates
	.use inplace
		pattern: "**/*.coffeekup"

	# Render layouts
	.use layouts
		directory: "src/layouts"

	# Render ECO templates
	.use inplace
		pattern: "**/*.eco"

	# Minify JS
	.use uglify
		sameName: true
		uglify:
			sourceMap: false

	# Purify CSS
	.use purifycss
		content: ["*.html", "*.js"]
		css: ["styles/theme.css"]
		output: "styles/theme.css"

	# Minify CSS
	.use cleancss
		files: ["src/**/*.css"]

	# Delete from output
	.use ignore [
		"layouts/*"
	]

	.build (err) ->
		if err then throw err
