(function() {
  var socket;

  socket = io('http://localhost:3000');

  socket.on('news', function(data) {
    return console.log(data);
  });

}).call(this);
