baseURL = ''
class Account
  constructor: ()->
    @api = "#{baseURL}/api/session"
    @message = null
    @messageList = messageList
    self = @
    @checkLogin(()->
      self.prepareMessage()
    )

  prepareMessage: (destory = false)->
    if destory isnt true
      @message = new Message()
      @messageList.refresh()
    else
      @message = null
      @messageList.clear()

  getRemoteData: (setting)->
    type = setting.type or 'GET'
    data = setting.data or {}
    success = setting.success or ->
    error = setting.error or ->
    url = @api
    $.ajax(
      type: type
      url: url
      data: data
      success: (data)->
        success and success(data)
      error: ()->
        error and error()
    )

  login: (username, password, cb)->
    self = @
    user =
      account: username
      password: password

    setting =
      type: 'POST'
      data: user
      success: (data)->
        self.prepareMessage()
        cb and cb(null, data)
      error: ->
        cb and cb('用户名或密码错误！')

    @getRemoteData setting


  checkLogin: (success, error)->
    setting =
      success: (data)->
        success and success(data)
      error: ->
        error and error('用户名或密码错误！')

    @getRemoteData setting

  logout: (cb)->
    self = @
    setting =
      type: 'DELETE'
      success: ->
        self.prepareMessage(true)
        cb and cb()
    @getRemoteData setting

if window.BHFService
  baseURL = window.BHFService.baseURL
  Message = window.BHFService.Message
  messageList = window.BHFService.messageList
  window.BHFService.account = new Account()