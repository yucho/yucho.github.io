# Modules
path	= require "path"
upath	= require "upath"
{URL}	= require "url"
yargs	= require "yargs"

serve	= require "metalsmith-serve"
watch	= require "metalsmith-watch"


# Globals
database = {}
portserve = Symbol "Port number for metalsmith-serve"
portwatch = Symbol "Port number for metalsmith-watch"


###*
# Performs pre-build tasks.
###
exports.pre = (opts) -> (files, metalsmith, done) ->
	# File manipulations
	for name in Object.keys files
		# Parse file names and add them to properties
		parsedpath = path.parse(name)
		files[name].basename = parsedpath.base.split(".")[0]
		files[name].urlpath  = upath.toUnix parsedpath.dir

		# Convert date strings into date object
		if files[name].date? then files[name].date = new Date files[name].date

	metadata = metalsmith.metadata()

	# CLI args
	argv = yargs.argv


	next = ->
		# Parse site URL
		if argv.serve or argv.s
			metadata.site.url = "http://localhost"
		if typeof metadata.site.url == "string"
			metadata.site.url = new URL metadata.site.url

		# Add custom helpers to metadata
		Object.assign metadata,
			###*
			# Gets root URL or localhost in serve mode.
			###
			getrooturl: -> @site.url.href

			###*
			# Gets absolute URL of a file in context.
			###
			geturl: (toURL) -> @getabsurl toURL
			getabsurl: (toURL) ->
				url = new URL @site.url
				if not toURL?
					url.pathname = path.posix.normalize url.pathname + "/" + @url
				else if typeof toURL == "string"
					url.pathname = path.posix.normalize url.pathname + "/" + toURL
				else if typeof toURL == "object"
					url.pathname = path.posix.normalize url.pathname + "/" + toURL.url

				url.href

		done()

	# Start a local server if requested
	if argv.serve or argv.s
		database[portserve] = if Number.isInteger argv.serve then argv.serve else if Number.isInteger argv.s then argv.s else 8080
		serve(port: port)(files, metalsmith, next)
	else
		next()
