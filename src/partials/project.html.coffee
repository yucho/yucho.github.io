# project.html.coffee
# Partial template for project section
# {name, url, logo, description}

section '.project.row', 'typeof':'soic:post', about:@url, ->
	div '.project-logo.four.columns', ->
		if typeof @logo is 'string' then @logo else @logo?()
	div '.project-info.eight.columns', ->
		header '.project-header', ->
			a '.project-link', href:@url, ->
				strong '.project-name', property:'dc:name', ->
					@name
		if @description
			p '.project-description', property:'dc:description', ->
				@description
