(function() {
  var utils;

  utils = {
    Browser: {
      CHROME: 'chrome',
      FIREFOX: 'firefox',
      SAFARI: 'safari'
    },
    getBrowser: function() {
      if ((typeof chrome !== "undefined" && chrome !== null) && (chrome.extension != null)) {
        return utils.Browser.CHROME;
      }
    }
  };

  if (window.BHFService) {
    window.BHFService.utils = utils;
  }

}).call(this);
