define ['storage', 'api', 'strings'], (storage, api, strings) ->

	_nav = undefined
	_validLangs = [
		'cy',
		'de',
		'eo',
		'es',
		'fr',
		'he',
		'ru',
		'zh',
	]
	_template = undefined


	############################################################################
	# _loadPage
	#
	############################################################################
	_loadPage = (template) ->
		_template = template
		userProfile = storage.getUserProfile()
		constants = require('constants')

		planMode = storage.getPlanMode() ? 'example'
		storage.setPlanMode(planMode)

		langs = ({
			'code': code
			'name': constants.langMap[code]
		} for code in userProfile.langs)
		options = ({
			'code': code
			'name': constants.langMap[code]
		} for code in _validLangs when code not in userProfile.langs)
		
		templateArgs =
			langs  : langs
			options: options

		$(".manage-page").html(template(templateArgs))

		$('.manage-page .box').click (event) ->
			langCode = $(this).data('lang-code')
			storage.setLanguage(langCode)
			api.ensureExcerptDictionary langCode, (json) ->
				if json['success']
					
					api.getProgress (json) ->
						if json['success']
							api.getPlan (json) ->
								if json['success']
									_nav.loadPage('library')
								else
									# Error ensuring plan
									$('.login-page .error').html(strings.getString('unexpectedFailure'))
						else
							# Error ensuring progress
							$('.login-page .error').html(strings.getString('unexpectedFailure'))
				else
					# Error ensuring dictionary
					$('.login-page .error').html(strings.getString('unexpectedFailure'))

		_nav.showBackBtn "Logout", (event) ->
			storage.logout()
			_nav.loadPage('login')

		$('.manage-page .add-language-btn').click (event) ->
			langCode = $('.manage-page .add-language-select').val()
			api.addLanguage langCode, (json) ->
				if json['success']
					_loadPage(_template)
					_nav.showAlert('Language added!')
				else
					_nav.showAlert('Failed to add language. Try again.')


	############################################################################
	# _refreshPage
	#
	############################################################################
	_refreshPage = ->
		console.log("refresh")


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
