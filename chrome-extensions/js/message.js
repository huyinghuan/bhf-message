
/*
  主要是socket.io的 消息通信
   *socket.io version 0.9.16
 */

(function() {
  var Message, MessageType, ServerIP, notification;

  notification = {};

  ServerIP = "";

  MessageType = (function() {
    function MessageType() {
      this.initMap();
    }

    MessageType.prototype.getContent = function(data) {
      var type;
      type = this.map[data.event];
      if (type == null) {
        return this.defaultEvent(data);
      }
      return this[type](data);
    };

    MessageType.prototype.initMap = function() {
      return this.map = {
        'talk:project': 'talkToProject',
        'talk:all': 'talkToAll',
        "issue:status:change": 'issueChange',
        'issue:assigned': 'issueAssigned',
        'mention': 'mention'
      };
    };

    MessageType.prototype.defaultEvent = function(data) {
      console.log(data);
    };

    MessageType.prototype.talkToProject = function(response) {
      var message, msg, title;
      title = response.data.title || '';
      message = response.data.content || '';
      return msg = {
        title: title,
        message: message
      };
    };

    MessageType.prototype.talkToAll = function(response) {
      return this.talkToProject(response);
    };

    MessageType.prototype.issueChange = function(response) {
      var link, message, msg, title;
      if (response.data.issue.status !== 'done') {
        return;
      }
      title = response.data.issue.tag + '已完成！';
      message = "通关" + response.data.issue.title;
      link = link = response.data.link;
      return msg = {
        link: link,
        title: title,
        message: message
      };
    };

    MessageType.prototype.issueAssigned = function(response) {
      var finishTime, link, message, msg, priority, title;
      message = response.data.issue.title;
      priority = ['', '', '紧急', '一般', '可延后'];
      title = "" + priority[response.data.issue.priority] + "任务来了！";
      finishTime = response.data.issue.plan_finish_time;
      if (finishTime) {
        if (new Date().getDate() === new Date(finishTime).getDate()) {
          title = "今天的" + title;
        } else {
          title = "" + (moment(finishTime).format("MM月DD日")) + "前的" + title;
        }
      }
      link = response.data.link;
      return msg = {
        link: link,
        title: title,
        message: message
      };
    };

    MessageType.prototype.mention = function(response) {
      var link, message, messageTitle, msg, sender, title;
      title = "讨论提醒";
      messageTitle = response.data.issue.title;
      sender = response.sender.realname;
      messageTitle = "" + sender + "在\"" + messageTitle + "\"中提到了你:";
      if (response.data.comment) {
        message = $(response.data.comment.content).text();
      }
      message = "" + messageTitle + "\n" + message;
      link = response.data.link;
      return msg = {
        title: title,
        message: message,
        link: link
      };
    };

    return MessageType;

  })();

  Message = (function() {
    function Message(notification, messageType) {
      this.notification = notification;
      this.messageType = messageType;
      this.initListener();
    }

    Message.prototype.initListener = function() {
      var self, socket;
      self = this;
      this.socket = socket = io.connect(ServerIP);
      socket.on('message', function(data) {
        var message;
        console.log('accept message', data);
        message = self.messageType.getContent(data);
        if (!message) {
          return;
        }
        return self.notification.show(message);
      });
      return socket.on('connect', function() {
        self.flag = true;
        return console.log('connect ready');
      });
    };

    Message.prototype.ready = function() {
      var self;
      self = this;
      if (self.flag) {
        console.log('message ready');
        return this.socket.emit('ready');
      } else {
        return setTimeout(function() {
          return self.ready();
        }, 500);
      }
    };

    return Message;

  })();

  if (window.BHFService) {
    ServerIP = window.BHFService.socketURL;
    notification = window.BHFService.notification;
    window.BHFService.message = new Message(notification, new MessageType());
  }

}).call(this);
