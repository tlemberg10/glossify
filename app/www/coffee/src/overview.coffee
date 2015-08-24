define [
	'utils',
	'storage',
	'api',
	'nav',
	'css',
	'deck',
	'stack',
	'strings',
	'hbs!../../hbs/src/box-list',
],
(
	utils,
	storage,
	api,
	nav,
	css,
	deck,
	stack,
	strings,
	boxListTemplate,
) ->

	############################################################################
	# Module properties
	#
	############################################################################
	_nav = undefined
	_nPages = 10

	
	############################################################################
	# UI constants
	#
	############################################################################
	PICKER_TILE_MARGIN = 10


	############################################################################
	# _loadPage
	#
	############################################################################
	_loadPage = (template) ->

		# Ensure progress is here
		lang = storage.getLanguage()
		userProfile = storage.getUserProfile()
		if lang not in Object.keys(userProfile['langs'])
			_createEmptyProgress()

		# Ensure a section exists
		if not storage.getSection()?
			storage.setSection(1)

		# Build args
		userProfile = storage.getUserProfile()
		dictionary  = storage.getDictionary(lang)
		plan        = storage.getPlan(lang)

		planLength = plan.length
		_nPages     = Math.ceil(planLength / 1000)

		templateArgs =
			sections: [1.._nPages]
		$(".overview-page").html(template(templateArgs))

		_loadBoxList(false)
		_loadNavHeader()

		_nav.showBackBtn "Account", (event) ->
			_nav.loadPage('manage')

		if not userProfile['confirmed']
			_nav.showAlert("You will need to check your email to confirm your email address and fully activate yout account.")

		# Register page events
		_registerEvents()


	############################################################################
	# _refreshPage
	#
	############################################################################
	_refreshPage = ->
		_loadBoxList(false)


	_loadNavHeader = ->
		section = storage.getSection()
		sectionInterval = stack.getSectionInterval(section)
		lang = storage.getLanguage()
		plan = storage.getPlan(lang)

		minIndex = sectionInterval['min'] + 1
		maxIndex = Math.min(sectionInterval['max'] + 1, plan.length)

		s = "Cards #{minIndex} through #{maxIndex}"

		if section == 1
			$('.overview-page .arrow-btn-left').hide()
			$('.overview-page .arrow-btn-right').show()
		else if section == _nPages
			$('.overview-page .arrow-btn-left').show()
			$('.overview-page .arrow-btn-right').hide()
		else
			$('.overview-page .arrow-btn-left').show()
			$('.overview-page .arrow-btn-right').show()

		$(".overview-page .interval-text").html(s)


	############################################################################
	# _loadBoxList
	#
	############################################################################
	_loadBoxList = (transition = true) ->
		# Get state
		userProfile = storage.getUserProfile()
		lang        = storage.getLanguage()
		dictionary  = storage.getDictionary(lang)
		section     = storage.getSection()
		plan        = storage.getPlan(lang)

		# Construct arguments
		boxes = stack.getBoxes(plan, dictionary, section, lang, 100)
		templateArgs =
			boxes      : boxes

		# Render template
		$(".overview-page .box-list-#{section}").html(boxListTemplate(templateArgs))

		# Do the progress bars
		for box in boxes
			stack.updateProgressBars("box-div-#{ box.index }", box.phraseIds)

		$(".overview-page .box-list-#{section}").css("width", utils.withUnit(utils.windowWidth(), 'px'))

		$(".overview-page .box-list-container").css("width", utils.withUnit(utils.windowWidth() * 10, 'px'))

		matchWidth = $(".overview-page .box-list-#{section}").css("width")
		#matchHeight = $(".overview-page .box-list-#{section}").css("height") + 100
		$(".overview-page .box-list").css("width", matchWidth)
		#$(".overview-page .box-list").css("height", matchHeight)
		#$(".overview-page .box-list-container").css("height", matchHeight)

		# Register events
		$(".box-list-container .box-div").off('click')
		$(".box-list-#{section} .box-div").click (event) ->
			storage.setBox($(this).data('index'))
			_nav.loadPage('study')

		$(".box-list-#{section} .small-btn").click (event) ->
			storage.setBox($(this).data('index'))
			storage.setStudyMode($(this).data('study-mode'))
			_nav.loadPage('study')

		if transition
			$(".box-list-container").animate { "margin-left": utils.withUnit(-1 * (section - 1) * utils.windowWidth(), 'px') }, 500, ->
				console.log("animate")
		else
			$(".box-list-container").css("margin-left", utils.withUnit(-1 * (section - 1) * utils.windowWidth(), 'px'))


	############################################################################
	# _registerEvents
	#
	############################################################################
	_registerEvents = ->


		$('.overview-page .arrow-btn-left').click (event) ->
			storage.setSection(storage.getSection() - 1)
			_loadBoxList()
			_loadNavHeader()


		$('.overview-page .arrow-btn-right').click (event) ->
			storage.setSection(storage.getSection() + 1)
			_loadBoxList()
			_loadNavHeader()


		$('.overview-page .plan-mode').click (event) ->
			plan_mode = $(this).data('mode')
			storage.setPlanMode(plan_mode)
			_reloadPlan()


		$('.overview-page .add-example-btn').click (event) ->
			excerpt = $('.overview-page .add-example-text').val()
			api.addExcerpt excerpt, (json) ->
				if json['success']
					_reloadPlan()
				else
					# Error adding excerpt
					$('.login-page .error').html(strings.getString('unexpectedFailure'))


	############################################################################
	# _reloadPlan
	#
	############################################################################
	_reloadPlan = ->
		plan_mode = storage.getPlanMode()
		lang = storage.getLanguage()
		api.ensurePlan (json) ->
			if json['success']
				api.ensureExcerptDictionary lang, (json) ->
					console.log(json)
					if json['success']
						storage.setSection(1)
						if plan_mode == 'example'
							$('.overview-page .add-example-div').show()
						else
							$('.overview-page .add-example-div').hide()
						_loadBoxList()
					else
						# Error getting excerpt dictionary
						$('.login-page .error').html(strings.getString('unexpectedFailure'))
			else
				# Error ensuring plan
				$('.login-page .error').html(strings.getString('unexpectedFailure'))


	############################################################################
	# createEmptyProgress
	#
	############################################################################
	_createEmptyProgress = ->

		lang        = storage.getLanguage()
		dictionary  = storage.getDictionary(lang)
		userProfile = storage.getUserProfile()

		phrases = []
		for phraseId in Object.keys(dictionary['dictionary'])
			phrases.push
				phrase_id: phraseId
				progress : 0

		# Update the userProfile in localStorage
		userProfile['langs'][lang] = phrases
		storage.setUserProfile(userProfile)


	############################################################################
	# Exposed objects
	#
	############################################################################
	return {

		loadPage: (template) ->
			_nav = require('nav')
			_loadPage(template)

		refreshPage: ->
			_refreshPage()

	}
