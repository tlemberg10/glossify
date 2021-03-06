// Generated by CoffeeScript 1.10.0
(function() {
  define(['utils', 'constants'], function(utils, constants) {
    var MAX_PAGE_ASPECT, MAX_PAGE_WIDTH, _formatGlobalElements, _formatPageDimensions, _getAlertHeight, _getContentHeight, _getFooterHeight, _getHeaderHeight;
    MAX_PAGE_WIDTH = 800;
    MAX_PAGE_ASPECT = 1.5;
    _getHeaderHeight = function() {
      return utils.appWidth() / 5;
    };
    _getContentHeight = function() {
      return utils.appHeight() - _getHeaderHeight() - _getFooterHeight();
    };
    _getFooterHeight = function() {
      return utils.appWidth() / 5;
    };
    _getAlertHeight = function() {
      return utils.stripNumeric($(".alert-div").css("height"));
    };
    _formatPageDimensions = function(page, transition) {
      var i, j, marginWidth, pageIndex, pageWidth, ref;
      if (transition == null) {
        transition = true;
      }
      pageWidth = utils.windowWidth();
      marginWidth = (utils.windowWidth() - pageWidth) / 2;
      $(".page").css('width', utils.withUnit(pageWidth, 'px'));
      $(".page").css('margin-left', utils.withUnit(marginWidth, 'px'));
      $(".page").css('margin-right', utils.withUnit(marginWidth, 'px'));
      pageIndex = 0;
      for (i = j = 0, ref = constants.pages.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (constants.pages[i] === page) {
          pageIndex = i;
        }
      }
      $(".page-container").css('width', utils.withUnit(utils.windowWidth() * constants.pages.length, 'px'));
      if (transition) {
        return $(".page-container").animate({
          "margin-left": utils.withUnit(-1 * pageIndex * utils.windowWidth(), 'px')
        }, 500, function() {
          return console.log("done");
        });
      } else {
        return $(".page-container").css("margin-left", utils.withUnit(-1 * pageIndex * utils.windowWidth(), 'px'));
      }
    };
    _formatGlobalElements = function() {
      $('.global-header').css('height', utils.withUnit(_getHeaderHeight(), 'px'));
      $('.global-content').css('height', utils.withUnit(_getContentHeight(), 'px'));
      return $('.global-footer').css('height', utils.withUnit(_getFooterHeight(), 'px'));
    };
    return {
      getHeaderHeight: function() {
        return _getFooterHeight();
      },
      getFooterHeight: function() {
        return _getFooterHeight();
      },
      getAlertHeight: function() {
        return _getAlertHeight();
      },
      formatPageDimensions: function(page, transition) {
        return _formatPageDimensions(page, transition);
      },
      formatGlobalElements: function() {
        return _formatGlobalElements();
      }
    };
  });

}).call(this);
