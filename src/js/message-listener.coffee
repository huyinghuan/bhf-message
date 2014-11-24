socket = io('ws://localhost:8001')
#0.9.16
socket.on 'message', (response)->
  console.log response