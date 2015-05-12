// Generated by CoffeeScript 1.9.1
(function() {
  define(['strings', 'storage', 'utils', 'api', 'nav', 'css', 'pageview'], function(strings, storage, utils, api, nav, css) {
    var _loadPage, _nav, _refreshPage, _registerEvents, _validateEmail, _validatePassword;
    _nav = void 0;
    _loadPage = function(template) {
      $(".signup-page").html(template());
      return _registerEvents();
    };
    _refreshPage = function() {
      return console.log("refresh");
    };
    _registerEvents = function() {
      return $('.signup-page .signup-btn').click(function(event) {
        var email, password1, password2;
        email = $('.signup-page .email-input').val();
        password1 = $('.signup-page .password-input-1').val();
        password2 = $('.signup-page .password-input-2').val();
        if (!_validateEmail(email)) {
          return _nav.showAlert(strings.getString('invalidEmail'));
        } else if (!_validatePassword(password1, password2)) {
          return _nav.showAlert(strings.getString('invalidPassword'));
        } else {
          return api.createUser(email, password1, function(json) {
            console.log(json);
            if (json['success']) {
              return api.authenticateUser(email, password1, function(json) {
                if (json['success']) {
                  storage.setLanguage('fr');
                  return api.ensureDictionary('fr', function(json) {
                    if (json['success']) {
                      return _nav.loadPage('overview');
                    } else {
                      return _nav.showAlert(strings.getString('unexpectedFailure'));
                    }
                  });
                }
              });
            } else {
              return _nav.showAlert("error creating user");
            }
          });
        }
      });
    };
    _validateEmail = function(email) {
      return email.match(/^([\w.-]+)@([\w.-]+)\.([a-zA-Z.]{2,6})$/i) != null;
    };
    _validatePassword = function(password1, password2) {
      return password1 !== '' && password1 === password2;
    };
    return {
      refreshPage: function() {
        return _refreshPage();
      },
      loadPage: function(template) {
        _nav = require('nav');
        return _loadPage(template);
      }
    };
  });

}).call(this);
