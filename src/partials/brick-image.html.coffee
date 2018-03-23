# partial('brick-image', post)
# Looks for image files in @brickPath that have the same basename
# as posts. If exist, sets them as cover image for masonry layout.
# If not, generates moyo svg as the cover.
# 
# The format for image filename is: basename_<width>x<height>.ext

# Search image with the same base name as the post
bricks = @getCollection('bricks').findAll(basename: $beginsWith: @basename).toArray()

if bricks?.length > 0
	# Extract width from filename
	propriety = 0
	for brick in bricks
		result = /^_([0-9]+)x([0-9]+)$/.exec brick.attributes.basename.slice @basename.length
		if result?
			brick.width = parseInt result?[1], 10
			propriety++

	# case: all are proper -> proper srcset
	# case: some are proper, some null -> use only proper
	# case: all null -> pick random for src, no srcset
	if propriety > 0
		# Sort bricks by width
		bricks.sort (a, b) ->
			if a.width > b.width then return 1
			else if a.width < b.width then return -1
			else return 0
		# Filter bricks
		bricks.filter (brick) -> brick.width?

		srcset = ''+ bricks[0].attributes.relativeOutPath + ' ' + bricks[0].width + 'w'
		for index in [1..(bricks.length - 1)]
			srcset += ', ' + bricks[index].attributes.relativeOutPath + ' ' + bricks[index].width + 'w'

	# Use largest image as src, a fallback for srcset
	src = ''+ bricks[bricks.length - 1].attributes.relativeOutPath
	# Create img tag
	img srcset: srcset, sizes: '450px', src: src

else
	# Partial renders code when nothing is returned, so render something
	text '<!-- no brick image -->'
