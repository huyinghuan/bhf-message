
/*
  数据存储的封装
 */

(function() {
  var ChromeStorage, Factory, FireFoxStorage, SafariStorage, Storage;

  ChromeStorage = (function() {
    function ChromeStorage() {
      this.storage = chrome.storage.local;
    }

    ChromeStorage.prototype.set = function(key, value) {
      var obj;
      obj = {};
      obj[key] = value;
      return this.storage.set(obj);
    };

    ChromeStorage.prototype.get = function(key, cb) {
      return this.storage.get(key, function(data) {
        if (!data) {
          data = {};
        }
        return cb && cb(data[key]);
      });
    };

    ChromeStorage.prototype.clear = function(key) {
      return this.storage.remove(key);
    };

    return ChromeStorage;

  })();

  FireFoxStorage = (function() {
    function FireFoxStorage() {}

    return FireFoxStorage;

  })();

  SafariStorage = (function() {
    function SafariStorage() {}

    return SafariStorage;

  })();

  Factory = (function() {
    function Factory() {
      this.utils = window.BHFService.utils;
    }

    Factory.prototype.getStorage = function() {
      if (this.utils.getBrowser() === this.utils.Browser.CHROME) {
        return new ChromeStorage();
      }
    };

    return Factory;

  })();

  Storage = (function() {
    function Storage(factory) {
      this.storage = factory.getStorage();
    }

    Storage.prototype.set = function(key, value) {
      return this.storage.set(key, value);
    };

    Storage.prototype.get = function(key, cb) {
      return this.storage.get(key, cb);
    };

    Storage.prototype.clear = function(key) {
      return this.storage.clear(key);
    };

    return Storage;

  })();

  if (window.BHFService) {
    window.BHFService.storage = new Storage(new Factory());
  }

}).call(this);
