(function() {
  var MessageList, baseURL, storage;

  storage = null;

  baseURL = "";

  MessageList = (function() {
    function MessageList() {
      this.api = "" + baseURL + "/api/message";
    }

    MessageList.prototype.refresh = function() {
      return this.get(function(items) {
        return storage.save('newMessage', items);
      });
    };

    MessageList.prototype.getRemoteData = function(setting) {
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

    MessageList.prototype.clear = function() {
      return storage.save('newMessage', []);
    };

    MessageList.prototype.get = function(cb) {
      var setting;
      setting = {
        data: {
          status: "new"
        },
        success: function(result) {
          return cb && cb(result.items);
        }
      };
      return this.getRemoteData(setting);
    };

    MessageList.prototype.setAllHasRead = function() {
      var self, setting;
      self = this;
      setting = {
        type: 'PUT',
        success: function() {
          return self.refresh();
        }
      };
      return this.getRemoteData(setting);
    };

    MessageList.prototype.setMessageAsRead = function(id, cb) {
      var self, setting;
      self = this;
      setting = {
        data: {
          id: id
        },
        type: 'PUT',
        success: function() {
          return self.refresh();
        }
      };
      return this.getRemoteData(setting);
    };

    return MessageList;

  })();

  if (window.BHFService) {
    baseURL = window.BHFService.baseURL;
    window.BHFService.messageList = new MessageList();
    storage = window.BHFService.storage;
  }

}).call(this);
