
/*
  封装 各个浏览器的消息提醒
 */

(function() {
  var ChromeBrowser, Factory, FireFoxBrowser, Notification, SafariBrowser, messageList, storage, utils, _website;

  utils = {};

  storage = {};

  messageList = null;

  ChromeBrowser = (function() {
    function ChromeBrowser() {
      this.notification = chrome.notifications;
      this.browserAction = chrome.browserAction;
      this.tabs = chrome.tabs;
      this.message = messageList;
      this.initEvent();
      this.listenerStorage();
    }

    ChromeBrowser.prototype.show = function(data, cb) {
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
      if (!data.link) {
        options.buttons = [
          {
            title: '忽略'
          }
        ];
      }
      this.notification.create('', options, function(nid) {
        return cb && cb(nid);
      });
      return this.message.refresh();
    };

    ChromeBrowser.prototype.getOptions = function() {
      var setting;
      return setting = {
        type: "basic",
        title: "BHF 消息",
        message: 'Test Message',
        iconUrl: "assets/icon_128.png",
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
      var self;
      self = this;
      return storage.get(nid, function(data) {
        if (!data.link) {
          return self.close(nid);
        }
        console.log('点击查看按钮的动作拉取数据', data);
        return self.open(data.link, nid);
      });
    };

    ChromeBrowser.prototype.open = function(url, nid) {
      var self;
      url = ("/" + url).replace(/\/+/g, '/');
      url = "" + _website + url;
      self = this;
      return this.tabs.create({
        url: url
      }, function() {
        self.close(nid);
        return storage.clear(nid);
      });
    };

    ChromeBrowser.prototype.listenerStorage = function() {
      var self;
      self = this;
      storage.get('newMessage', function(data) {
        return self.setBadge(data);
      });
      return chrome.storage.onChanged.addListener(function(changes) {
        if (!changes['newMessage']) {
          return;
        }
        return self.setBadge(changes['newMessage'].newValue);
      });
    };

    ChromeBrowser.prototype.setBadge = function(items) {
      var text;
      if (!items) {
        items = [];
      }
      text = items.length ? "" + items.length : '';
      return this.browserAction.setBadgeText({
        text: text
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
      return this.browser.show(message, function(nid) {
        console.log('create nid', nid);
        message.timestamp = new Date().getTime();
        return storage.save(nid, message);
      });
    };

    return Notification;

  })();

  if (window.BHFService) {
    utils = window.BHFService.utils;
    storage = window.BHFService.storage;
    _website = window.BHFService.website;
    messageList = window.BHFService.messageList;
    window.BHFService.notification = new Notification(new Factory());
  }

}).call(this);
