// Generated by CoffeeScript 1.9.1
(function() {
  define(['utils', 'storage'], function(utils, storage) {
    var DICTIONARY_SIZE, SECTION_SIZE, _getBoxInterval, _getBoxes, _getCards, _getProgressPercentage, _getSectionInterval, _updateCards, boxSize;
    SECTION_SIZE = 1000;
    DICTIONARY_SIZE = 10000;
    boxSize = 100;
    _getSectionInterval = function(section) {
      var maxIndex, minIndex;
      minIndex = minIndex = (section - 1) * SECTION_SIZE;
      maxIndex = minIndex + SECTION_SIZE - 1;
      return {
        min: minIndex,
        max: maxIndex
      };
    };
    _getBoxInterval = function(section, box) {
      var maxIndex, minIndex;
      minIndex = minIndex = (section - 1) * SECTION_SIZE;
      maxIndex = minIndex + boxSize;
      return {
        min: minIndex,
        max: maxIndex
      };
    };
    _getCards = function(userProfile, section, boxIndex, lang) {
      var maxIndex, minIndex;
      minIndex = minIndex = (section - 1) * SECTION_SIZE + boxIndex * boxSize;
      maxIndex = minIndex + boxSize;
      return userProfile['langs'][lang].slice(minIndex, maxIndex);
    };
    _getBoxes = function(userProfile, dictionary, section, lang, cardsPerBox) {
      var box, boxIndex, boxes, card, cards, j, nBoxes, percent, ref, sample, sampleCards, sampleWords;
      nBoxes = SECTION_SIZE / cardsPerBox;
      boxes = [];
      for (boxIndex = j = 0, ref = nBoxes - 1; 0 <= ref ? j <= ref : j >= ref; boxIndex = 0 <= ref ? ++j : --j) {
        cards = _getCards(userProfile, section, boxIndex, lang);
        sampleCards = cards.slice(0, 4);
        sampleWords = (function() {
          var k, len, results;
          results = [];
          for (k = 0, len = sampleCards.length; k < len; k++) {
            card = sampleCards[k];
            results.push(dictionary['dictionary'][card['phrase_id']]['base']);
          }
          return results;
        })();
        sample = sampleWords.join(', ') + "...";
        percent = _getProgressPercentage(cards);
        box = {
          sample: sample,
          index: boxIndex,
          percent: percent
        };
        boxes.push(box);
      }
      return boxes;
    };
    _getProgressPercentage = function(cards) {
      var card, j, len, maxProgress, totalProgress;
      maxProgress = 5 * cards.length;
      totalProgress = 0;
      for (j = 0, len = cards.length; j < len; j++) {
        card = cards[j];
        totalProgress += card['progress'];
      }
      console.log("total");
      console.log(totalProgress);
      return Math.floor(totalProgress / maxProgress * 100);
    };
    _updateCards = function(cards) {
      var card, cardMap, i, j, k, lang, len, newCard, oldCard, oldCards, ref, userProfile;
      userProfile = storage.getUserProfile();
      lang = storage.getLanguage();
      console.log(cards);
      cardMap = {};
      for (j = 0, len = cards.length; j < len; j++) {
        card = cards[j];
        cardMap[card['phrase_id']] = card;
      }
      i = 0;
      oldCards = userProfile['langs'][lang];
      for (i = k = 0, ref = oldCards.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        oldCard = userProfile['langs'][lang][i];
        newCard = cardMap[oldCard['phrase_id']];
        if (newCard != null) {
          console.log("UPDATING");
          userProfile['langs'][lang][i]['progress'] = newCard['progress'];
        }
      }
      return storage.setUserProfile(userProfile);
    };
    return {
      getSectionInterval: function(section) {
        return _getSectionInterval(section);
      },
      getBoxInterval: function(section, box) {
        return _getBoxInterval(section, box);
      },
      getCards: function(section, box, lang) {
        return _getCards(section, box, lang);
      },
      getBoxes: function(userProfile, dictionary, section, lang, cardsPerBox) {
        return _getBoxes(userProfile, dictionary, section, lang, cardsPerBox);
      },
      getProgressPercentage: function(cards) {
        return _getProgressPercentage(cards);
      },
      updateCards: function(cards) {
        return _updateCards(cards);
      }
    };
  });

}).call(this);