
/*
  封装 各个浏览器的消息提醒
 */

(function() {
  var BrowserAction, ChromeBrowser, Factory, FireFoxBrowser, Notification, SafariBrowser, utils;

  utils = {};

  BrowserAction = (function() {
    function BrowserAction() {}

    BrowserAction.prototype.close = function() {};

    BrowserAction.prototype.click = function() {};

    BrowserAction.prototype.save = function(key, value) {};

    return BrowserAction;

  })();

  ChromeBrowser = (function() {
    function ChromeBrowser() {
      this.action = new BrowserAction();
      this.notification = chrome.notifications;
      this.initEvent();
    }

    ChromeBrowser.prototype.show = function(data) {
      var options;
      if (data == null) {
        data = {};
      }
      options = this.getOptions();
      if (data.message) {
        options.message = data.message;
      }
      if (data.title) {
        options.title = data.title;
      }
      return this.notification.create('', options, function(nid) {});
    };

    ChromeBrowser.prototype.getOptions = function() {
      var setting;
      return setting = {
        type: "basic",
        title: "BHF 消息",
        message: 'Test Message',
        iconUrl: "assets/icon_16.png",
        buttons: [
          {
            title: '查看'
          }, {
            title: '忽略'
          }
        ]
      };
    };

    ChromeBrowser.prototype.initEvent = function() {
      var self;
      self = this;
      return this.notification.onButtonClicked.addListener(function(nid, index) {
        if (index === 0) {
          return self.click(nid);
        } else {
          return self.close(nid);
        }
      });
    };

    ChromeBrowser.prototype.close = function(nid) {
      return this.notification.clear(nid, function() {});
    };

    ChromeBrowser.prototype.click = function(nid) {
      console.log(nid);
      return this.close(nid);
    };

    ChromeBrowser.prototype.isAllow = function(cb) {
      return this.notification.getPermissionLevel(function(permission) {
        if (permission === 'granted') {
          return cb && cb(true);
        } else {
          return cb && cb(false);
        }
      });
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
      this.utils = utils;
      this.initBrowser();
    }

    Factory.prototype.initBrowser = function() {
      var browser;
      browser = this.utils.getBrowser();
      if (browser === this.utils.Browser.CHROME) {
        browser = new ChromeBrowser();
      } else if (browser === this.utils.Browser.FIREFOX) {
        browser = new FireFoxBrowser();
      } else if (browser === this.utils.Browser.SAFARI) {
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

  if (window.BHFService) {
    utils = window.BHFService.utils;
    window.BHFService.notification = new Notification(new Factory());
  }

}).call(this);
