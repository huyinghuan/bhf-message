###
  测试socket.io的消息
###
fs = require 'fs'
io = require("socket.io")

handler = (req, res) ->
  fs.readFile(__dirname + "/index.html", (err, data)->
    res.end data
  )

app = require("http").createServer(handler)

io = io.listen app

app.listen 3000

io.sockets.on "connection", (socket) ->
  data =
    title: 'Test'
    message: 'Hello BHF plugin'

  socket.emit "message", data

