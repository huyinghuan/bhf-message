socket = io('http://localhost:3000')
socket.on('news', (data)->
  console.log(data)
)