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
      var mainTemplate, self;
      data.baseURL = baseURL;
      self = this;
      mainTemplate = Handlebars.compile($("#hasUserPageTemplate").html());
      this.listTemplate = Handlebars.compile($("#messageListTemplate").html());
      this.emptyTemplate = Handlebars.compile($("#messageEmptyTempalte").html());
      $('#content').html(mainTemplate(data));
      this.initElement();
      this.setMessageListEmpty();
      this.initMessageList(data);
      return this.bindEvent();
    };

    HasUserTemplate.prototype.initElement = function() {
      return this.element = {
        logout: $('#logout'),
        messageList: $('#messageList'),
        hasReadAll: $('#hasReadAll'),
        goToHome: $('#goHome'),
        messageCount: $('.messageCount')
      };
    };

    HasUserTemplate.prototype.initMessageList = function(data) {
      var $ele, self;
      self = this;
      $ele = this.element;
      return this.message.get(function(items) {
        data.messageList = items;
        if (!items.length) {
          return;
        }
        $ele.messageList.html(self.listTemplate(data));
        self.bindMessageListClickEvents();
        return $ele.messageCount.html(items.length);
      });
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
      $ele.hasReadAll.on('click', function() {
        self.message.setAllHasRead();
        return self.clearMessageListHtml();
      });
      return $ele.goToHome.on('click', function() {
        return window.open(baseURL);
      });
    };

    HasUserTemplate.prototype.bindMessageListClickEvents = function() {
      var $ele, self;
      self = this;
      $ele = this.element;
      return $ele.messageList.find('a').on('click', function() {
        var count, id, url;
        url = $(this).data('url');
        id = $(this).data('id');
        if (url) {
          window.open(url);
        }
        self.message.setMessageAsRead(id);
        $(this).parent('li').remove();
        count = +$ele.messageCount.html();
        $ele.messageCount.html(count - 1);
        if (count === 1) {
          return self.setMessageListEmpty();
        }
      });
    };

    HasUserTemplate.prototype.clearMessageListHtml = function() {
      var $ele;
      $ele = this.element;
      $ele.messageList.find('li').remove();
      $ele.messageCount.html(0);
      return this.setMessageListEmpty();
    };

    HasUserTemplate.prototype.setMessageListEmpty = function() {
      var $ele;
      return $ele = this.element.messageList.html(this.emptyTemplate());
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
      var $login, $password, self;
      $login = this.element.login;
      $password = this.element.password;
      self = this;
      $login.on('click', function() {
        return self.login();
      });
      return $password.on('keyup', function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          return self.login();
        }
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
