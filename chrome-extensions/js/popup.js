(function() {
  var $, BrowserAction, Service;

  Service = chrome.extension.getBackgroundPage().BHFService;

  $ = function(selector) {
    var idReg;
    idReg = /^#/;
    if (idReg.test(selector)) {
      selector = selector.replace(idReg, '');
      return document.getElementById(selector);
    } else {
      return document.querySelector(selector);
    }
  };

  BrowserAction = (function() {
    function BrowserAction(service) {
      this.service = service;
      this.initElement();
      this.bindEvent();
    }

    BrowserAction.prototype.initElement = function() {
      return this.element = {
        username: $('#username'),
        password: $('#password'),
        login: $('#login')
      };
    };

    BrowserAction.prototype.bindEvent = function() {
      var $login, self;
      $login = this.element.login;
      self = this;
      return $login.addEventListener('click', function() {
        return self.login();
      });
    };

    BrowserAction.prototype.login = function() {
      var $ele, password, username;
      $ele = this.element;
      username = $ele.username.value;
      password = $ele.password.value;
      return this.service.account.login(username, password);
    };

    BrowserAction.prototype.logout = function() {};

    return BrowserAction;

  })();

  new BrowserAction(Service);

}).call(this);
