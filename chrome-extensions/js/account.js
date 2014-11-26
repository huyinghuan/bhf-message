(function() {
  var Account, Message, baseURL;

  baseURL = '';

  Account = (function() {
    function Account() {
      var self;
      this.api = "" + baseURL + "/api/session";
      this.message = null;
      self = this;
      this.checkLogin(function() {
        return self.prepareMessage();
      });
    }

    Account.prototype.prepareMessage = function(destory) {
      if (destory == null) {
        destory = false;
      }
      if (destory !== true) {
        return this.message = new Message();
      }
      return this.message = null;
    };

    Account.prototype.getRemoteData = function(setting) {
      var data, error, success, type, url;
      type = setting.type || 'GET';
      data = setting.data || {};
      success = setting.success || function() {};
      error = setting.error || function() {};
      url = this.api;
      return $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(data) {
          return success && success(data);
        },
        error: function() {
          return error && error();
        }
      });
    };

    Account.prototype.login = function(username, password, cb) {
      var self, setting, user;
      self = this;
      user = {
        account: username,
        password: password
      };
      setting = {
        type: 'POST',
        data: user,
        success: function(data) {
          self.prepareMessage();
          return cb && cb(null, data);
        },
        error: function() {
          return cb && cb('用户名或密码错误！');
        }
      };
      return this.getRemoteData(setting);
    };

    Account.prototype.checkLogin = function(success, error) {
      var setting;
      setting = {
        success: function(data) {
          return success && success(data);
        },
        error: function() {
          return error && error('用户名或密码错误！');
        }
      };
      return this.getRemoteData(setting);
    };

    Account.prototype.logout = function(cb) {
      var setting;
      setting = {
        type: 'DELETE',
        success: function() {
          self.prepareMessage(true);
          return cb && cb();
        }
      };
      return this.getRemoteData(setting);
    };

    return Account;

  })();

  if (window.BHFService) {
    baseURL = window.BHFService.baseURL;
    Message = window.BHFService.Message;
    window.BHFService.account = new Account();
  }

}).call(this);
