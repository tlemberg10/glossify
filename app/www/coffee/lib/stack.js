// Generated by CoffeeScript 1.9.1
(function() {
  define(['utils', 'storage'], function(utils, storage) {
    var DICTIONARY_SIZE, SECTION_SIZE, _getCards, _getProgressPercentage, boxSize;
    SECTION_SIZE = 1000;
    DICTIONARY_SIZE = 10000;
    boxSize = 100;
    _getCards = function(section, box, lang) {
      var maxIndex, minIndex, userProfile;
      lang = storage.getLanguage();
      userProfile = storage.getUserProfile();
      minIndex = minIndex = (section - 1) * SECTION_SIZE + box * boxSize;
      maxIndex = minIndex + boxSize;
      return userProfile['langs'][lang].slice(minIndex, maxIndex);
    };
    _getProgressPercentage = function(cards) {
      var card, i, len, maxProgress, ref, totalProgress;
      maxProgress = 5 * _deck['cards'].length;
      totalProgress = 0;
      ref = _deck['cards'];
      for (i = 0, len = ref.length; i < len; i++) {
        card = ref[i];
        totalProgress += card['progress'];
      }
      return Math.floor(totalProgress / maxProgress * 100);
    };
    return {
      getCards: function(section, box, lang) {
        return _getCards(section, box, lang);
      },
      getProgressPercentage: function(cards) {
        return _getProgressPercentage(cards);
      }
    };
  });

}).call(this);
