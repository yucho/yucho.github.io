# github-project.html.coffee
# Fetch my repos from GitHub and selectively display info
# {name, logo}

# Prepare
projects = @getGitHubProjects()

project = projects.filter((x) => x.name == @name)[0]

if project
	section '.project.row', 'typeof':'soic:post', about:project.url, ->
		div '.project-logo.four.columns', ->
			@logo
		div '.project-info.eight.columns', ->
			header '.project-header', ->
				a '.project-link', href:project.html_url, ->
					strong '.project-name', property:'dc:name', ->
						project.name
					text '&nbsp;'
					small '.project-stars', property:'dc:stars', ->
						text "#{project.watchers} stars"
			if project.description
				p '.project-description', property:'dc:description', ->
					project.description
