(function() {
  var socket;

  socket = io('ws://localhost:8001');

  socket.on('message', function(response) {
    return console.log(response);
  });

}).call(this);
