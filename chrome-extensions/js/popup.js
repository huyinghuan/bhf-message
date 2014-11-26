(function() {
  var $, BHFService, HasUserTemplate, NoUserTemplate, Popup, account;

  BHFService = chrome.extension.getBackgroundPage().BHFService;

  account = BHFService.account;

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

  HasUserTemplate = (function() {
    function HasUserTemplate(account, data) {
      this.account = account;
      this.initTemplate(data);
      this.initElement();
      this.bindEvent();
    }

    HasUserTemplate.prototype.initTemplate = function(data) {
      var ele, source;
      ele = $("#hasUserPageTemplate");
      source = ele.innerHTML;
      this.template = Handlebars.compile(source);
      return $('#content').innerHTML = this.template(data);
    };

    HasUserTemplate.prototype.initElement = function() {
      return this.element = {
        logout: $('#logout')
      };
    };

    HasUserTemplate.prototype.bindEvent = function() {
      var $ele, self;
      self = this;
      $ele = this.element;
      return $ele.logout.addEventListener('click', function() {
        return self.account.logout(function() {
          return new NoUserTemplate(self.account);
        });
      });
    };

    return HasUserTemplate;

  })();

  NoUserTemplate = (function() {
    function NoUserTemplate(account) {
      this.account = account;
      this.initTemplate();
      this.initElement();
      this.bindEvent();
    }

    NoUserTemplate.prototype.initTemplate = function() {
      var ele, source;
      ele = $("#noUserPageTemplate");
      source = ele.innerHTML;
      this.template = Handlebars.compile(source);
      return $('#content').innerHTML = this.template();
    };

    NoUserTemplate.prototype.initElement = function() {
      return this.element = {
        username: $('#username'),
        password: $('#password'),
        login: $('#login')
      };
    };

    NoUserTemplate.prototype.bindEvent = function() {
      var $login, self;
      $login = this.element.login;
      self = this;
      return $login.addEventListener('click', function() {
        return self.login();
      });
    };

    NoUserTemplate.prototype.login = function() {
      var $ele, password, self, username;
      self = this;
      $ele = this.element;
      username = $ele.username.value;
      password = $ele.password.value;
      return this.account.login(username, password, function(error, data) {
        if (!error) {
          return new HasUserTemplate(self.account, data);
        } else {
          return self.showError(error);
        }
      });
    };

    NoUserTemplate.prototype.showError = function(error) {
      return $('#errorMsg').innerHTML = error;
    };

    return NoUserTemplate;

  })();

  Popup = (function() {
    function Popup(account) {
      var self;
      this.account = account;
      self = this;
      this.account.checkLogin(function(data) {
        return new HasUserTemplate(self.account, data);
      }, function() {
        return new NoUserTemplate(self.account);
      });
    }

    return Popup;

  })();

  new Popup(account);

}).call(this);
