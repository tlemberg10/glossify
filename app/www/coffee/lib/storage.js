// Generated by CoffeeScript 1.9.2
(function() {
  define(['utils'], function(utils) {
    var ACCESS_TOKEN_KEY, ACCOUNT_CONFIRMED_KEY, BOX_KEY, DICTIONARY_KEY, LANGUAGE_KEY, PAGE_KEY, PLAN_MODE_KEY, PROGRESS_KEY, PROGRESS_UPDATES_KEY, SECTION_KEY, SHOW_PRON_KEY, STUDY_MODE_KEY, STUDY_ORDER_KEY, USER_PROFILE_KEY, _addDeckUpdate, _addProgressUpdate, _clearDeckUpdates, _clearProgressUpdates, _deleteCard, _getAccessToken, _getAccountConfirmed, _getBox, _getDeckUpdates, _getDictionary, _getLanguage, _getLocalStorageItem, _getPage, _getPlan, _getPlanMode, _getProgress, _getProgressUpdates, _getSection, _getShowPron, _getStudyMode, _getStudyOrder, _getUserProfile, _isLoggedIn, _logout, _removeDictionary, _removeLocalStorageItem, _removePlan, _removeProgress, _setAccessToken, _setAccountConfirmed, _setBox, _setDeckUpdates, _setDictionary, _setLanguage, _setLocalStorageItem, _setPage, _setPlan, _setPlanMode, _setProgress, _setProgressObject, _setSection, _setShowPron, _setStudyMode, _setStudyOrder, _setUserProfile;
    PAGE_KEY = 'page';
    ACCESS_TOKEN_KEY = 'token';
    USER_PROFILE_KEY = 'user_profile';
    DICTIONARY_KEY = 'dictionary';
    LANGUAGE_KEY = 'lang';
    SECTION_KEY = 'section';
    BOX_KEY = 'box';
    PROGRESS_KEY = 'progress';
    PLAN_MODE_KEY = 'plan_mode';
    STUDY_MODE_KEY = 'study_mode';
    STUDY_ORDER_KEY = 'study_order';
    SHOW_PRON_KEY = 'show_pron';
    PROGRESS_UPDATES_KEY = 'card_updates';
    ACCOUNT_CONFIRMED_KEY = 'account_confirmed';
    _getLocalStorageItem = function(k) {
      return JSON.parse(localStorage.getItem(k));
    };
    _setLocalStorageItem = function(k, v) {
      return localStorage.setItem(k, JSON.stringify(v));
    };
    _removeLocalStorageItem = function(k) {
      return localStorage.removeItem(k);
    };
    _logout = function() {
      var constants, i, lang, len, ref;
      _removeLocalStorageItem(PAGE_KEY);
      _removeLocalStorageItem(ACCESS_TOKEN_KEY);
      _removeLocalStorageItem(USER_PROFILE_KEY);
      _removeLocalStorageItem(LANGUAGE_KEY);
      _removeLocalStorageItem(SECTION_KEY);
      _removeLocalStorageItem(BOX_KEY);
      _removeLocalStorageItem(STUDY_MODE_KEY);
      _removeLocalStorageItem(STUDY_ORDER_KEY);
      _removeLocalStorageItem(PLAN_MODE_KEY);
      constants = require('constants');
      ref = Object.keys(constants.langMap);
      for (i = 0, len = ref.length; i < len; i++) {
        lang = ref[i];
        _removeDictionary(lang);
        _removePlan(lang);
        _removeProgress(lang);
      }
      return _clearProgressUpdates();
    };
    _getPage = function() {
      return _getLocalStorageItem(PAGE_KEY);
    };
    _setPage = function(v) {
      return _setLocalStorageItem(PAGE_KEY, v);
    };
    _getAccessToken = function() {
      return _getLocalStorageItem(ACCESS_TOKEN_KEY);
    };
    _setAccessToken = function(v) {
      return _setLocalStorageItem(ACCESS_TOKEN_KEY, v);
    };
    _getUserProfile = function() {
      return _getLocalStorageItem(USER_PROFILE_KEY);
    };
    _setUserProfile = function(v) {
      return _setLocalStorageItem(USER_PROFILE_KEY, v);
    };
    _getLanguage = function() {
      return _getLocalStorageItem(LANGUAGE_KEY);
    };
    _setLanguage = function(v) {
      return _setLocalStorageItem(LANGUAGE_KEY, v);
    };
    _getDictionary = function(lang) {
      return _getLocalStorageItem("dictionary_" + lang);
    };
    _setDictionary = function(lang, v) {
      return _setLocalStorageItem("dictionary_" + lang, v);
    };
    _removeDictionary = function(lang) {
      return _removeLocalStorageItem("dictionary_" + lang);
    };
    _getSection = function() {
      return _getLocalStorageItem(SECTION_KEY);
    };
    _setSection = function(v) {
      return _setLocalStorageItem(SECTION_KEY, v);
    };
    _getBox = function() {
      return _getLocalStorageItem(BOX_KEY);
    };
    _setBox = function(v) {
      return _setLocalStorageItem(BOX_KEY, v);
    };
    _getPlanMode = function() {
      return _getLocalStorageItem(PLAN_MODE_KEY);
    };
    _setPlanMode = function(v) {
      return _setLocalStorageItem(PLAN_MODE_KEY, v);
    };
    _getStudyMode = function() {
      return _getLocalStorageItem(STUDY_MODE_KEY);
    };
    _setStudyMode = function(v) {
      return _setLocalStorageItem(STUDY_MODE_KEY, v);
    };
    _getStudyOrder = function() {
      return _getLocalStorageItem(STUDY_ORDER_KEY);
    };
    _setStudyOrder = function(v) {
      return _setLocalStorageItem(STUDY_ORDER_KEY, v);
    };
    _getShowPron = function() {
      return _getLocalStorageItem(SHOW_PRON_KEY);
    };
    _setShowPron = function(v) {
      return _setLocalStorageItem(SHOW_PRON_KEY, v);
    };
    _getAccountConfirmed = function() {
      return _getLocalStorageItem(ACCOUNT_CONFIRMED_KEY);
    };
    _setAccountConfirmed = function(v) {
      return _setLocalStorageItem(ACCOUNT_CONFIRMED_KEY, v);
    };
    _clearProgressUpdates = function() {
      var lang;
      lang = _getLanguage();
      return _removeLocalStorageItem("progress_updates_" + lang);
    };
    _getProgressUpdates = function() {
      var lang, progressUpdates;
      lang = _getLanguage();
      progressUpdates = _getLocalStorageItem("progress_updates_" + lang);
      if (progressUpdates == null) {
        progressUpdates = {
          'defs': {},
          'pron': {}
        };
      }
      return progressUpdates;
    };
    _addProgressUpdate = function(phraseId, progressValue, studyMode) {
      var lang, progressUpdates;
      lang = _getLanguage();
      if (studyMode == null) {
        studyMode = 'defs';
      }
      progressUpdates = _getProgressUpdates();
      progressUpdates[studyMode][phraseId] = progressValue;
      return _setLocalStorageItem("progress_updates_" + lang, progressUpdates);
    };
    _setProgressObject = function(lang, v) {
      return _setLocalStorageItem("progress_" + lang, v);
    };
    _getProgress = function(phraseId, studyMode) {
      var lang, progress, ref;
      if (studyMode == null) {
        studyMode = 'defs';
      }
      lang = _getLanguage();
      progress = _getLocalStorageItem("progress_" + lang);
      return (ref = progress[studyMode][phraseId]) != null ? ref : 0;
    };
    _setProgress = function(phraseId, progressValue, studyMode) {
      var lang, progress, ref;
      if (studyMode == null) {
        studyMode = 'defs';
      }
      lang = _getLanguage();
      progress = (ref = _getLocalStorageItem("progress_" + lang)) != null ? ref : {};
      progress[studyMode][phraseId] = progressValue;
      _setLocalStorageItem("progress_" + lang, progress);
      return _addProgressUpdate(phraseId, progressValue, studyMode);
    };
    _removeProgress = function(lang) {
      return _removeLocalStorageItem("progress_" + lang);
    };
    _getPlan = function(lang) {
      var planMode;
      planMode = _getPlanMode();
      return _getLocalStorageItem("plan_" + lang + "_" + planMode);
    };
    _setPlan = function(lang, v) {
      var planMode;
      planMode = _getPlanMode();
      return _setLocalStorageItem("plan_" + lang + "_" + planMode, v);
    };
    _removePlan = function(lang) {
      _removeLocalStorageItem("plan_" + lang + "_frequency");
      return _removeLocalStorageItem("plan_" + lang + "_example");
    };
    _isLoggedIn = function() {
      var dictionary, lang, userProfile;
      userProfile = _getUserProfile();
      lang = _getLanguage();
      if ((userProfile != null) && (lang != null)) {
        dictionary = _getDictionary(lang);
        if (dictionary != null) {
          return true;
        }
      }
      return false;
    };
    _deleteCard = function(deckIndex, phraseId) {
      var deckId, i, lang, len, matchedPhraseId, newPhraseIds, phraseIds, plan;
      lang = _getLanguage();
      plan = _getPlan(lang);
      phraseIds = plan[deckIndex]['phraseIds'];
      newPhraseIds = [];
      for (i = 0, len = phraseIds.length; i < len; i++) {
        matchedPhraseId = phraseIds[i];
        if (phraseId !== matchedPhraseId) {
          newPhraseIds.push(matchedPhraseId);
        }
      }
      plan[deckIndex]['phraseIds'] = newPhraseIds;
      _setPlan(lang, plan);
      deckId = plan[deckIndex]['deckId'];
      return _addDeckUpdate(deckId, newPhraseIds);
    };
    _addDeckUpdate = function(deckId, phraseIds) {
      var deckUpdates;
      deckUpdates = _getDeckUpdates();
      if (deckUpdates == null) {
        deckUpdates = {};
      }
      deckUpdates[deckId] = phraseIds;
      return _setDeckUpdates(deckUpdates);
    };
    _getDeckUpdates = function() {
      var deckUpdates;
      deckUpdates = _getLocalStorageItem("deck_updates");
      if (deckUpdates == null) {
        deckUpdates = {};
      }
      return deckUpdates;
    };
    _setDeckUpdates = function(v) {
      return _setLocalStorageItem("deck_updates", v);
    };
    _clearDeckUpdates = function() {
      return _removeLocalStorageItem("deck_updates");
    };
    return {
      logout: function() {
        return _logout();
      },
      getPage: function() {
        return _getPage();
      },
      setPage: function(v) {
        return _setPage(v);
      },
      getAccessToken: function() {
        return _getAccessToken();
      },
      setAccessToken: function(v) {
        return _setAccessToken(v);
      },
      getUserProfile: function() {
        return _getUserProfile();
      },
      setUserProfile: function(v) {
        return _setUserProfile(v);
      },
      getLanguage: function() {
        return _getLanguage();
      },
      setLanguage: function(v) {
        return _setLanguage(v);
      },
      getDictionary: function(lang) {
        return _getDictionary(lang);
      },
      setDictionary: function(lang, v) {
        var constants, dictLang, i, len, ref;
        constants = require('constants');
        ref = Object.keys(constants.langMap);
        for (i = 0, len = ref.length; i < len; i++) {
          dictLang = ref[i];
          _removeDictionary(dictLang);
        }
        return _setDictionary(lang, v);
      },
      getSection: function() {
        return _getSection();
      },
      setSection: function(v) {
        return _setSection(v);
      },
      getBox: function() {
        return _getBox();
      },
      setBox: function(v) {
        return _setBox(v);
      },
      getPlanMode: function() {
        return _getPlanMode();
      },
      setPlanMode: function(v) {
        return _setPlanMode(v);
      },
      getStudyMode: function() {
        return _getStudyMode();
      },
      setStudyMode: function(v) {
        return _setStudyMode(v);
      },
      getStudyOrder: function() {
        return _getStudyOrder();
      },
      setStudyOrder: function(v) {
        return _setStudyOrder(v);
      },
      getShowPron: function() {
        return _getShowPron();
      },
      setShowPron: function(v) {
        return _setShowPron(v);
      },
      getAccountConfirmed: function() {
        return _getAccountConfirmed();
      },
      setAccountConfirmed: function(v) {
        return _setAccountConfirmed(v);
      },
      getDeckUpdates: function() {
        return _getDeckUpdates();
      },
      clearDeckUpdates: function() {
        return _clearDeckUpdates();
      },
      getProgressUpdates: function() {
        return _getProgressUpdates();
      },
      clearProgressUpdates: function() {
        return _clearProgressUpdates();
      },
      addProgressUpdate: function(phraseId, progressValue) {
        return _addProgressUpdate(phraseId, progressValue);
      },
      getProgress: function(phraseId, studyMode) {
        return _getProgress(phraseId, studyMode);
      },
      setProgress: function(phraseId, progressValue, studyMode) {
        return _setProgress(phraseId, progressValue, studyMode);
      },
      setProgressObject: function(lang, v) {
        return _setProgressObject(lang, v);
      },
      getPlan: function(lang) {
        return _getPlan(lang);
      },
      setPlan: function(lang, v) {
        return _setPlan(lang, v);
      },
      isLoggedIn: function() {
        return _isLoggedIn();
      },
      deleteCard: function(deckIndex, phraseId) {
        return _deleteCard(deckIndex, phraseId);
      }
    };
  });

}).call(this);
