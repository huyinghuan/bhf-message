(function() {
  var Account, baseURL, message;

  baseURL = '';

  Account = (function() {
    function Account(message) {
      var self;
      this.message = message;
      this.api = "" + baseURL + "/api/session";
      self = this;
      this.checkLogin(function() {
        return self.message.ready();
      });
    }

    Account.prototype.login = function(username, password, cb) {
      var self, user;
      self = this;
      user = {
        account: username,
        password: password
      };
      return $.ajax({
        type: 'POST',
        url: self.api,
        data: user,
        success: function(data) {
          self.message.ready();
          return cb && cb(data);
        },
        error: function(x, type) {
          return console.log(2, x, type);
        }
      });
    };

    Account.prototype.checkLogin = function(cb) {
      var self;
      self = this;
      return $.ajax({
        type: 'GET',
        url: self.api,
        success: function(data) {
          return cb && cb(data);
        },
        error: function() {
          return cb && cb(false);
        }
      });
    };

    Account.prototype.logout = function(cb) {
      return $.ajax({
        type: 'DELETE',
        url: self.api,
        success: function(data) {
          console.log('user exit', data);
          return cb && cb();
        },
        error: function() {
          return cb && cb();
        }
      });
    };

    return Account;

  })();

  if (window.BHFService) {
    baseURL = window.BHFService.baseURL;
    message = window.BHFService.message;
    window.BHFService.account = new Account(message);
  }

}).call(this);
