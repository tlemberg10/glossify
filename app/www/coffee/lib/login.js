// Generated by CoffeeScript 1.9.1
(function() {
  define(['strings', 'storage', 'utils', 'api', 'nav', 'css', 'pageview'], function(strings, storage, utils, api, nav, css) {
    var _loadPage, _nav, _refreshPage, _registerEvents;
    _nav = void 0;
    _loadPage = function(template) {
      $(".login-page").html(template());
      if (utils.getUrlParameter('action') === 'activationsuccessful' && (storage.getAccountConfirmed() == null)) {
        _nav.showAlert("Your have succesfully confirmed your account");
        storage.setAccountConfirmed(true);
      }
      return _registerEvents();
    };
    _refreshPage = function() {
      return console.log("refresh");
    };
    _registerEvents = function() {
      $('.login-page .login-btn').click(function(event) {
        var email, password;
        email = $('.login-page #email-input').val();
        password = $('.login-page #password-input').val();
        return api.authenticateUser(email, password, function(json) {
          if (json['success']) {
            storage.setLanguage('fr');
            return api.ensureDictionary('fr', function(json) {
              if (json['success']) {
                console.log("success");
                return _nav.loadPage('overview');
              } else {
                return $('.login-page .error').html(strings.getString('unexpectedFailure'));
              }
            });
          } else {
            return _nav.showAlert(strings.getString('loginFailed'));
          }
        });
      });
      return $('.login-page .signup-btn').click(function(event) {
        console.log("clicked");
        return _nav.loadPage('signup');
      });
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
