Service = chrome.extension.getBackgroundPage().BHFService

$ = (selector)->
  idReg = /^#/
  if idReg.test selector
    selector = selector.replace idReg, ''
    return document.getElementById(selector)
  else
    document.querySelector(selector)

class BrowserAction
  constructor: (@service)->
    @initElement()
    @bindEvent()

  initElement: ->
    @element =
      username: $('#username')
      password:$('#password')
      login: $('#login')

  bindEvent: ->
    $login = @element.login
    self = @
    $login.addEventListener 'click', ->
      self.login()

  login: ->
    $ele = @element
    username = $ele.username.value
    password = $ele.password.value
    @service.account.login username, password

  logout: ->

new BrowserAction(Service)