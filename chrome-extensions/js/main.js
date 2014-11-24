(function() {
  var Account, BHFService;

  window.BHFService = BHFService = {};

  Account = (function() {
    function Account() {}

    Account.prototype.login = function(username, password) {
      var user;
      console.log(username, password);
      user = {
        account: "胡瀛寰",
        password: "888888"
      };
      return $.ajax({
        type: 'POST',
        url: 'http://localhost:8001/api/session',
        data: user,
        success: function(d) {
          return console.log(1, d);
        },
        error: function(x, type) {
          return console.log(2, x, type);
        }
      });
    };

    Account.prototype.logout = function() {};

    Account.prototype.test = function() {
      var notification;
      notification = window.BHFService.notification;
      return notification.show();
    };

    return Account;

  })();

  BHFService.account = new Account();

}).call(this);
