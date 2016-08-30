---
layout: 'default'
title: 'Projects'
description: 'Showcase projects.'
url: '/projects'
urls: ['/projects/','/projects/index.html','/projects.html']
---

# Project List
nav '.project-list', 'typeof':'dc:collection', ->
	text @partial('project', {
		name: 'hide-and-seek'
		url: '#'
		logo: '<div class="svg-wrap">' + @partial('svg/octocat-black') + '</div>'
		description: 'Mobile game project in progress.'
	})
	text @partial('github-repo', {
		name: 'cytonote'
		logo: '<div class="svg-wrap">' + @partial('svg/cytonote-logo') + '</div>'
	})
	text @partial('github-repo', {
		name: 'yucho.github.io'
		logo: '<div class="svg-wrap">' + @partial('svg/octocat-black') + '</div>'
	})
