// Generated by CoffeeScript 1.9.1
(function() {
  define(['require', 'api', 'css', 'page', 'login', 'signup', 'manage', 'overview', 'study', 'utils'], function(require, api, css, page, login, signup, manage, overview, study, utils) {
    var _dictionary, _token, _userProfile, currentPageId, currentParams;
    currentPageId = 'overview';
    currentParams = {};
    _token = void 0;
    _userProfile = void 0;
    _dictionary = void 0;
    return {
      pageRenderers: function() {
        return {
          login: {
            preload: require('login').preloadPage,
            load: require('login').loadPage,
            refresh: require('login').refreshPage
          },
          signup: {
            preload: require('signup').preloadPage,
            load: require('signup').loadPage,
            refresh: require('signup').refreshPage
          },
          manage: {
            preload: require('manage').preloadPage,
            load: require('manage').loadPage,
            refresh: require('manage').refreshPage
          },
          overview: {
            preload: require('overview').preloadPage,
            load: require('overview').loadPage,
            refresh: require('overview').refreshPage
          },
          study: {
            preload: require('study').preloadPage,
            load: require('study').loadPage,
            refresh: require('study').refreshPage
          }
        };
      },
      preloadPages: function(initialPageId, params) {
        var actions, mod, pageId, pageRenderers;
        $(".page").hide();
        pageRenderers = this.pageRenderers();
        mod = this;
        for (pageId in pageRenderers) {
          actions = pageRenderers[pageId];
          actions['preload']();
        }
        css.refreshStaticCss();
        return this.loadPage(initialPageId, params);
      },
      loadPage: function(pageId, params) {
        var pageRenderers;
        pageRenderers = this.pageRenderers();
        currentPageId = pageId;
        pageRenderers[pageId]['load'](params);
        this.refreshPage();
        css.refreshStaticCss();
        $("#" + pageId + "-page").css('visibility', 'visible');
        $(".page").hide();
        $(".splash").hide();
        return $("#" + pageId + "-page").show();
      },
      refreshPage: function() {
        page.formatPageDimensions();
        page.formatGlobalElements();
        return this.pageRenderers()[currentPageId]['refresh']();
      }
    };
  });

}).call(this);
