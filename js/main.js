(function() {
  var Account, BHFService;

  window.BHFService = BHFService = {};

  Account = (function() {
    function Account() {}

    Account.prototype.login = function(username, password) {
      return console.log(username, password);
    };

    Account.prototype.logout = function() {};

    return Account;

  })();

  BHFService.account = new Account();

}).call(this);
