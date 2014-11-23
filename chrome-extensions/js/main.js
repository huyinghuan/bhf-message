(function() {
  var Account, BHFService;

  window.BHFService = BHFService = {};

  Account = (function() {
    function Account() {}

    Account.prototype.login = function(username, password) {
      console.log(username, password);
      return this.test;
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
