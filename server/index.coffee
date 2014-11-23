###
  测试socket.io的消息
###

handler = (req, res) ->
  console.log(123)
  res.end 'hello'

app = require("http").createServer(handler)

io = require("socket.io")(app)

app.listen 3000

io.on "connection", (socket) ->
  socket.emit "news", hello: "world"

