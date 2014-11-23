###
  测试socket.io的消息
###

handler = (req, res) -> res.end ''

app = require("http").createServer(handler)

io = require("socket.io")(app)

app.listen 3000

io.on "connection", (socket) ->
  socket.emit "news", hello: "world"

