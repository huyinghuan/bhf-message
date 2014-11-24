###
  测试socket.io的消息
###
fs = require 'fs'
handler = (req, res) ->
  fs.readFile(__dirname + "/index.html", (err, data)->
    res.end data
  )

app = require("http").createServer(handler)

io = require("socket.io")(app)

app.listen 3000

io.on "connection", (socket) ->
  socket.emit "message", hello: "world"
  console.log socket.request.headers

