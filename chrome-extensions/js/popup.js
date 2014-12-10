(function() {
  var BHFService, HasUserTemplate, NoUserTemplate, Popup, account, baseURL, messageList;

  BHFService = chrome.extension.getBackgroundPage().BHFService;

  account = BHFService.account;

  messageList = BHFService.messageList;

  baseURL = BHFService.website;

  HasUserTemplate = (function() {
    function HasUserTemplate(account, data) {
      this.account = account;
      this.message = messageList;
      this.initTemplate(data);
    }

    HasUserTemplate.prototype.initTemplate = function(data) {
      var ele, self, source, template;
      data.baseURL = baseURL;
      self = this;
      ele = $("#hasUserPageTemplate");
      source = $(ele).html();
      template = Handlebars.compile(source);
      return this.message.get(function(items) {
        data.messageList = items;
        $('#content').html(template(data));
        self.initElement();
        return self.bindEvent();
      });
    };

    HasUserTemplate.prototype.initElement = function() {
      return this.element = {
        logout: $('#logout'),
        messageList: $('#messageList')
      };
    };

    HasUserTemplate.prototype.bindEvent = function() {
      var $ele, self;
      self = this;
      $ele = this.element;
      $ele.logout.on('click', function() {
        return self.account.logout(function() {
          return new NoUserTemplate(self.account);
        });
      });
      return $ele.messageList.find('a').on('click', function() {
        var id, url;
        url = $(this).data('url');
        id = $(this).data('id');
        if (url) {
          window.open(url);
        }
        if (id) {
          self.message.setMessageAsRead(id);
          $(this).parent('li').remove();
          return $('.messageCount').html($('.messageCount').html() - 1);
        }
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
      source = ele.html();
      this.template = Handlebars.compile(source);
      return $('#content').html(this.template());
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
      return $login.on('click', function() {
        return self.login();
      });
    };

    NoUserTemplate.prototype.login = function() {
      var $ele, password, self, username;
      self = this;
      $ele = this.element;
      username = $ele.username.val();
      password = $ele.password.val();
      return this.account.login(username, password, function(error, data) {
        if (!error) {
          return new HasUserTemplate(self.account, data);
        } else {
          return self.showError(error);
        }
      });
    };

    NoUserTemplate.prototype.showError = function(error) {
      return $('#errorMsg').html(error);
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
