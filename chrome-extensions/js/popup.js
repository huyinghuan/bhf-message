(function() {
  var $, LoginTemplate, Popup, UnLoginTemplate, account;

  account = chrome.extension.getBackgroundPage().BHFService.account;

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

  LoginTemplate = (function() {
    function LoginTemplate(account, data) {
      this.account = account;
      this.initTemplate(data);
      this.initElement();
      this.bindEvent();
    }

    LoginTemplate.prototype.initTemplate = function(data) {
      var ele, source;
      ele = $("#loginPageTemplate");
      source = ele.innerHTML;
      this.template = Handlebars.compile(source);
      return $('#content').innerHTML = this.template(data);
    };

    LoginTemplate.prototype.initElement = function() {
      return this.element = {
        logout: $('#logout')
      };
    };

    LoginTemplate.prototype.bindEvent = function() {
      var $ele, self;
      self = this;
      $ele = this.element;
      return $ele.logout.addEventListener('click', function() {
        return self.account.logout(function() {
          return new UnLoginTemplate(self.account);
        });
      });
    };

    return LoginTemplate;

  })();

  UnLoginTemplate = (function() {
    function UnLoginTemplate(account) {
      this.account = account;
      this.initTemplate();
      this.initElement();
      this.bindEvent();
    }

    UnLoginTemplate.prototype.initTemplate = function() {
      var ele, source;
      ele = $("#unLoginPageTemplate");
      source = ele.innerHTML;
      this.template = Handlebars.compile(source);
      return $('#content').innerHTML = this.template();
    };

    UnLoginTemplate.prototype.initElement = function() {
      return this.element = {
        username: $('#username'),
        password: $('#password'),
        login: $('#login')
      };
    };

    UnLoginTemplate.prototype.bindEvent = function() {
      var $login, self;
      $login = this.element.login;
      self = this;
      return $login.addEventListener('click', function() {
        return self.login();
      });
    };

    UnLoginTemplate.prototype.login = function() {
      var $ele, password, self, username;
      self = this;
      $ele = this.element;
      username = $ele.username.value;
      password = $ele.password.value;
      return this.account.login(username, password, function(data) {
        console.log(data);
        return new LoginTemplate(self.account, data);
      });
    };

    return UnLoginTemplate;

  })();

  Popup = (function() {
    function Popup(account) {
      this.account = account;
      this.checkLogin();
    }

    Popup.prototype.checkLogin = function() {
      var self;
      self = this;
      return this.account.isLogin(function(data) {
        console.log(data);
        if (data) {
          return new LoginTemplate(self.account, data);
        } else {
          return new UnLoginTemplate(self.account);
        }
      });
    };

    return Popup;

  })();

  new Popup(account);

}).call(this);
