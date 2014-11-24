###
  主要是socket.io的 消息通信
  #socket.io version 0.9.16
###
notification = {}

ServerIP = "ws://localhost:3000"

class Message
  constructor: (@notification)->
    @initListener()

  initListener: ->
    self = @
    socket = io.connect ServerIP
    socket.on('message', (data)->
      console.log 'accept message', data
      self.notification.show data
    )


if window.BHFService
  notification = window.BHFService.notification
  new Message(notification)