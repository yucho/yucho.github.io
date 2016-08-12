---
layout: 'default'
title: 'Projects'
description: 'Showcase projects.'
url: '/projects'
urls: ['/projects/','/projects/index.html','/projects.html']
---

# Prepare
projects = @getGitHubProjects()

# Project List
nav '.project-list', 'typeof':'dc:collection', ->
	for project in projects
		li '.project', 'typeof':'soic:post', about:project.url, ->
			div '.project-header', ->
				a '.project-link', href:project.html_url, ->
					strong '.project-name', property:'dc:name', ->
						project.name
					small '.project-stars', property:'dc:stars', ->
						text "#{project.watchers} stars"
			if project.description
				p '.project-description', property:'dc:description', ->
					project.description
