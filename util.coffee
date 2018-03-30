path = require "path"
ignore = require "metalsmith-ignore"
{Buffer} = require "buffer"

###*
# Bundle multiple css files.
# @method bundlestyles
# @param [opts.outputDir="css"] {String} Output directory for bundled css files.
###
exports.bundlestyles = (opts) -> (files, metalsmith, done) ->
	setImmediate done

	defaults =
		outputDir: "css"
		ignore: true
	options = Object.assign {}, defaults, opts

	# Array of files for bundles
	bundles = {}
	for file of files
		if files[file].bundlestyles?.name? and not (0 < bundles[files[file].bundlestyles.name]?.push file)
			bundles[files[file].bundlestyles.name] = []
			bundles[files[file].bundlestyles.name].push file

		# Default priority is zero
		files[file].bundlestyles?.priority ?= 0

	# Bundle files by increasing priority
	output = {}
	for bundle of bundles
		# Sort by priority
		bundles[bundle].sort (a, b) ->
			return -1 if files[a].bundlestyles.priority < files[b].bundlestyles.priority
			return 1 if files[a].bundlestyles.priority > files[b].bundlestyles.priority
			return 0

		output[path.join options.outputDir, bundle] =
			contents: Buffer.concat (files[name].contents for name in bundles[bundle])

	# Inject in metalsmith files
	Object.assign files, output

	# Delete bundled parts
	delete files[file] for file in bundles[bundle] for bundle of bundles
