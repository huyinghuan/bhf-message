###
  主要是socket.io的 消息通信
  #socket.io version 0.9.16
###
notification = {}

#default
ServerIP = ""

class MessageType
  constructor: ->
    @initMap()

  getContent: (data)->
    type = @map[data.event]
    return @defaultEvent(data) if not type?
    return @[type](data)

  initMap: ->
    @map =
      'talk:project': 'talkToProject'
      'talk:all': 'talkToAll'
      "issue:status:change": 'issueChange'
      'issue:assigned' : 'issueAssigned'
      'mention': 'mention'

  defaultEvent: (data)->
    console.log data
    return

  talkToProject: (response)->
    title = response.data.title || ''
    message = response.data.content || ''
    msg =
      title: title
      message: message

  talkToAll: (response)->
    @talkToProject response

  issueChange: (response)->
    return if response.data.issue.status isnt 'done'
    title = response.data.issue.tag + '已完成！'
    message = "通关#{response.data.issue.title}"
    link = link = response.data.link
    msg =
      link: link
      title: title
      message: message

  issueAssigned: (response)->
    message = response.data.issue.title
    priority = ['', '', '紧急', '一般', '可延后']
    title = "#{priority[response.data.issue.priority]}任务来了！"
    finishTime = response.data.issue.plan_finish_time
    if finishTime
      if new Date().getDate() is new Date(finishTime).getDate()
        title = "今天的#{title}"
      else
        title = "#{moment(finishTime).format("MM月DD日")}前的#{title}"
    link = response.data.link
    msg =
      link: link
      title: title
      message: message

  mention: (response)->
    title = "讨论提醒"
    messageTitle = response.data.issue.title
    sender = response.sender.realname
    messageTitle = "#{sender}在\"#{messageTitle}\"中提到了你:"
    message = $(response.data.comment.content).text() if response.data.comment
    message = "#{messageTitle}\n#{message}"
    link = response.data.link
    msg =
      title: title
      message: message
      link: link

class Message
  constructor: (@notification, @messageType)->
    @initListener()

  initListener: ->
    self = @
    @socket = socket = io.connect ServerIP
    socket.on('message', (data)->
      console.log 'accept message', data
      message = self.messageType.getContent data
      return if not message
      self.notification.show message
    )
    socket.on('connect', ()->
      self.flag =  true
      console.log 'connect ready'
    )

  ready: ->
    self = @
    if self.flag
      console.log 'emit ready'
      @socket.emit('ready')
    else
      setTimeout(->
        self.ready()
      , 500)


if window.BHFService
  ServerIP = window.BHFService.socketURL
  notification = window.BHFService.notification
  window.BHFService.message = new Message(notification, new MessageType())