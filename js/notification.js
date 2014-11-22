
/*
  封装 各个浏览器的消息提醒
 */

(function() {
  var ChromeBrowser, Factory, FireFoxBrowser, Notification, SafariBrowser;

  if (!window.BHFService) {
    window.BHFService = {};
  }

  ChromeBrowser = (function() {
    function ChromeBrowser() {
      this.notification = chrome.notifications;
    }

    ChromeBrowser.prototype.show = function(message) {
      if (!this.isAllow()) {

      }
    };

    ChromeBrowser.prototype.isAllow = function() {
      var permission;
      permission = this.notification.PermissionLevel;
      if (permission === 'granted') {
        return true;
      }
      return false;
    };

    return ChromeBrowser;

  })();

  FireFoxBrowser = (function() {
    function FireFoxBrowser() {}

    return FireFoxBrowser;

  })();

  SafariBrowser = (function() {
    function SafariBrowser() {}

    return SafariBrowser;

  })();

  Factory = (function() {
    function Factory() {
      this.initFunctions();
    }

    Factory.prototype.isChrome = function() {
      if ((typeof chrome !== "undefined" && chrome !== null) && (chrome.extension != null)) {
        return true;
      }
    };

    Factory.prototype.isFireFox = function() {
      return false;
    };

    Factory.prototype.isSafari = function() {
      return false;
    };

    Factory.prototype.initBrowser = function() {
      var browser;
      browser = null;
      if (this.isChrome()) {
        browser = new ChromeBrowser();
      } else if (this.isFireFox()) {
        browser = new FireFoxBrowser();
      } else if (this.isSafari()) {
        browser = new SafariBrowser();
      }
      return this.browser = browser;
    };

    Factory.prototype.getBrowser = function() {
      return this.browser;
    };

    return Factory;

  })();

  Notification = (function() {
    function Notification(factory) {
      this.browser = factory.getBrowser();
    }

    Notification.prototype.show = function(message) {
      return this.browser.show(message);
    };

    return Notification;

  })();

  window.BHFService.notification = new Notification(new Factory());

}).call(this);
