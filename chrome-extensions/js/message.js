
/*
  主要是socket.io的 消息通信
   *socket.io version 0.9.16
 */

(function() {
  var Message, ServerIP, notification;

  notification = {};

  ServerIP = "ws://localhost:3000";

  Message = (function() {
    function Message(notification) {
      this.notification = notification;
      this.initListener();
    }

    Message.prototype.initListener = function() {
      var self, socket;
      self = this;
      socket = io.connect(ServerIP);
      return socket.on('message', function(data) {
        console.log('accept message', data);
        return self.notification.show(data);
      });
    };

    return Message;

  })();

  if (window.BHFService) {
    notification = window.BHFService.notification;
    new Message(notification);
  }

}).call(this);
