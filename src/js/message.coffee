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
    priority = ['', '', '紧急', '', '']
    tag = response.data.issue.tag
    id = response.data.issue.id
    priorityName  = priority[response.data.issue.priority]
    title = "#{priorityName}#{tag}##{id}# 已完成！"

    message = "#{response.sender.realname}解决了:
      \n\"#{response.data.issue.title}\""
    link = link = response.data.link

    msg =
      link: link
      title: title
      message: message

  issueAssigned: (response)->
    message = response.data.issue.title
    priority = ['', '', '紧急', '一般', '可延后', '']
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
  constructor: ()->
    @notification = notification
    @messageType = new MessageType()
    @prepareSocket()

  prepareSocket: ->
    self = @
    @socket = socket = io.connect ServerIP
    socket.on('message', (data)->
      console.log 'accept message', data
      message = self.messageType.getContent data
      return if not message
      self.notification.show message
    )
    socket.on 'connect', ()->
      console.log '已连接'
      socket.emit 'ready'

    socket.on 'disconnect', ()->
      console.log '断开连接'

    socket.on 'reconnect', ()->
      console.log '重新连接'
      socket.emit 'ready'


if window.BHFService
  ServerIP = window.BHFService.socketURL
  notification = window.BHFService.notification
  window.BHFService.Message = Message