// Generated by CoffeeScript 1.10.0
(function() {
  define(['utils', 'storage', 'nav', 'strings', 'config', 'stack'], function(utils, storage, nav, strings, config, stack) {
    var URL_BASE, _addDocument, _addLanguage, _apiUrl, _authenticateUser, _createUser, _ensureDictionary, _ensureExcerptDictionary, _ensurePlan, _fetchDictionary, _getPlan, _getProgress, _nav, _requestAccess, _updateProgress, _updateUserProfile;
    URL_BASE = config.apiUrl;
    _nav = void 0;
    _apiUrl = function(url, authenticated, params) {
      var k, paramStr, v;
      params || (params = {});
      if (authenticated) {
        params['email'] = storage.getUserProfile()['email'];
        params['auth_token'] = storage.getAccessToken();
      }
      paramStr = ((function() {
        var results;
        results = [];
        for (k in params) {
          v = params[k];
          results.push(k + "=" + v);
        }
        return results;
      })()).join('&');
      console.log(url);
      if (paramStr) {
        return "" + URL_BASE + url + "?" + paramStr;
      } else {
        return "" + URL_BASE + url;
      }
    };
    _createUser = function(email, password, handler) {
      _nav.showModal("Creating user", "ajax", 100);
      console.log(_apiUrl('create-user'));
      return $.ajax({
        url: _apiUrl('create-user'),
        method: "POST",
        data: {
          email: email,
          password: password
        },
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _authenticateUser = function(email, password, handler) {
      _nav.showModal("Signing in", "ajax", 100);
      return $.ajax({
        url: _apiUrl('authenticate-user'),
        method: "POST",
        data: {
          email: email,
          password: password
        },
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          if (json['success']) {
            storage.setAccessToken(json['result']['token']);
            storage.setUserProfile(json['result']['userProfile']);
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _requestAccess = function(email, handler) {
      _nav.showModal("Requesting access", "ajax", 100);
      return $.ajax({
        url: _apiUrl('request-access'),
        method: "POST",
        data: {
          email: email
        },
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _fetchDictionary = function(lang, handler) {
      var authenticated, token;
      _nav.showModal("Downloading dictionary", "ajax", 100);
      token = storage.getAccessToken();
      return $.ajax({
        url: _apiUrl("get-dictionary/" + lang, authenticated = true),
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          var base, baseMap, dictionary, phraseId;
          _nav.hideModal();
          if (json['success'] === 1) {
            dictionary = json['result'];
            baseMap = {};
            for (phraseId in dictionary['dictionary']) {
              base = dictionary['dictionary'][phraseId]['base'];
              baseMap[base] = phraseId;
            }
            dictionary['bases'] = baseMap;
            storage.setDictionary(lang, dictionary);
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _updateUserProfile = function(handler) {
      var authenticated, email, token, userProfile;
      _nav.showModal("Updating user profile", "ajax", 100);
      userProfile = storage.getUserProfile();
      email = userProfile['email'];
      token = storage.getAccessToken();
      return $.ajax({
        url: _apiUrl("update-progress/" + email, authenticated = true),
        method: 'post',
        data: {
          cards: cards
        },
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          var dictionary;
          _nav.hideModal();
          if (json['success']) {
            dictionary = json['result'];
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _ensureDictionary = function(lang, handler) {
      var dictionary;
      dictionary = storage.getDictionary(lang);
      if (dictionary != null) {
        return handler({
          success: 1,
          result: dictionary
        });
      } else {
        return _fetchDictionary(lang, handler);
      }
    };
    _ensureExcerptDictionary = function(lang, handler) {
      var authenticated, data;
      _nav.showModal("Fetching dictionary entries", "ajax", 1000);
      data = {
        lang: lang
      };
      return $.ajax({
        url: _apiUrl('get-excerpt-dictionary', authenticated = true),
        method: "POST",
        data: data,
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          if (json['success']) {
            stack.addPhrasesToDictionary(json['result']);
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _addLanguage = function(lang, handler) {
      var authenticated;
      _nav.showModal("Adding language to your library", "ajax", 1000);
      return $.ajax({
        url: _apiUrl("add-language/" + lang, authenticated = true),
        method: "POST",
        data: {},
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          var userProfile;
          _nav.hideModal();
          if (json['success']) {
            userProfile = storage.getUserProfile();
            userProfile['langs'].push(lang);
            console.log(userProfile);
            storage.setUserProfile(userProfile);
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _addDocument = function(title, text, handler) {
      var authenticated, data;
      _nav.showModal("Saving your progress history", "ajax", 1000);
      data = {
        lang: storage.getLanguage(),
        title: title,
        text: text
      };
      return $.ajax({
        url: _apiUrl('add-document', authenticated = true),
        method: "POST",
        data: data,
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _updateProgress = function(handler) {
      var authenticated, data;
      _nav.showModal("Saving your progress history", "ajax", 1000);
      data = {
        lang: storage.getLanguage(),
        progress_updates: JSON.stringify(storage.getProgressUpdates()),
        deck_updates: JSON.stringify(storage.getDeckUpdates())
      };
      return $.ajax({
        url: _apiUrl('update-progress', authenticated = true),
        method: "POST",
        data: data,
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          if (json['success']) {
            storage.clearProgressUpdates();
            storage.clearDeckUpdates();
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _getProgress = function(handler) {
      var authenticated, data, lang;
      _nav.showModal("Downloading your progress history", "ajax", 1000);
      lang = storage.getLanguage();
      data = {
        lang: lang
      };
      return $.ajax({
        url: _apiUrl('get-progress', authenticated = true),
        method: "POST",
        data: data,
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          _nav.hideModal();
          if (json['success']) {
            storage.setProgressObject(lang, json['result']['progress']);
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _getPlan = function(handler) {
      var authenticated, data, lang, planMode;
      _nav.showModal("Downloading lesson plans", "ajax", 100);
      lang = storage.getLanguage();
      planMode = storage.getPlanMode();
      data = {
        lang: lang,
        plan_mode: planMode
      };
      return $.ajax({
        url: _apiUrl('get-plan', authenticated = true),
        method: "POST",
        data: data,
        dataType: 'json',
        timeout: 30 * 1000,
        success: function(json) {
          console.log(json);
          _nav.hideModal();
          if (json['success']) {
            storage.setDocuments(json['result']['docs']);
            storage.setExcerpts(json['result']['excerpts']);
            storage.setPlan(lang, json['result']['plan']);
            console.log(json);
          }
          return handler(json);
        },
        error: function(jqXHR, textStatus, thownError) {
          return _nav.showModal(strings.getString("ajaxError"), "alert");
        }
      });
    };
    _ensurePlan = function(handler) {
      return _getPlan(handler);
    };
    return {
      createUser: function(email, password, handler) {
        _nav = require("nav");
        return _createUser(email, password, handler);
      },
      authenticateUser: function(email, password, handler) {
        _nav = require("nav");
        return _authenticateUser(email, password, handler);
      },
      requestAccess: function(email, handler) {
        _nav = require("nav");
        return _requestAccess(email, handler);
      },
      addLanguage: function(lang, handler) {
        _nav = require("nav");
        return _addLanguage(lang, handler);
      },
      ensureDictionary: function(lang, handler) {
        _nav = require("nav");
        return _ensureDictionary(lang, handler);
      },
      ensureExcerptDictionary: function(lang, handler) {
        _nav = require("nav");
        return _ensureExcerptDictionary(lang, handler);
      },
      updateUserProfile: function(handler) {
        _nav = require("nav");
        return _updateUserProfile(handler);
      },
      addDocument: function(title, text, handler) {
        _nav = require("nav");
        return _addDocument(title, text, handler);
      },
      updateProgress: function(handler) {
        _nav = require("nav");
        return _updateProgress(handler);
      },
      getProgress: function(handler) {
        _nav = require("nav");
        return _getProgress(handler);
      },
      getPlan: function(handler) {
        _nav = require("nav");
        return _getPlan(handler);
      },
      ensurePlan: function(handler) {
        _nav = require("nav");
        return _ensurePlan(handler);
      },
      apiSummary: function() {
        return {
          'createUser': {
            func: this.createUser,
            params: ['email', 'password']
          },
          'authenticateUser': {
            func: this.authenticateUser,
            params: ['email', 'password']
          },
          'addLanguage': {
            func: this.addLanguage,
            params: ['lang']
          },
          'updateUserProfile': {
            func: this.updateUserProfile,
            params: []
          }
        };
      }
    };
  });

}).call(this);
