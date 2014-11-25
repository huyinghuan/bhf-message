baseURL = ''
class Account
  constructor: (@message)->
    @api = "#{baseURL}/api/session"
    self = @
    @checkLogin(()->
      self.message.ready()
    )

  login: (username, password, cb)->
    self = @
    user =
      account: username
      password: password

    $.ajax(
      type: 'POST'
      url: self.api
      data: user
      success: (data)->
        self.message.ready()
        cb and cb(data)

      error: (x, type)-> console.log 2, x, type
    )

  checkLogin: (cb)->
    self = @
    $.ajax(
      type: 'GET'
      url: self.api
      success: (data)->
        cb and cb(data)
      error: ()-> cb and cb(false)
    )

  logout: (cb)->
    $.ajax(
      type: 'DELETE'
      url: self.api
      success: (data)->
        console.log 'user exit', data
        cb and cb()
      error: ()-> cb and cb()
    )

if window.BHFService
  baseURL = window.BHFService.baseURL
  message = window.BHFService.message
  window.BHFService.account = new Account(message)