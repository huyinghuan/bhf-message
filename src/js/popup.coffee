account = chrome.extension.getBackgroundPage().BHFService.account

$ = (selector)->
  idReg = /^#/
  if idReg.test selector
    selector = selector.replace idReg, ''
    return document.getElementById(selector)
  else
    document.querySelector(selector)

class LoginTemplate
  constructor: (@account, data)->
    @initTemplate(data)
    @initElement()
    @bindEvent()

  initTemplate: (data)->
    ele = $("#loginPageTemplate")
    source   = ele.innerHTML;
    @template = Handlebars.compile(source);
    $('#content').innerHTML = @template(data)

  initElement: ->
    @element =
      logout: $('#logout')

  bindEvent: ->
    self = @
    $ele = @element
    $ele.logout.addEventListener 'click', ->
      self.account.logout ()->
        new UnLoginTemplate(self.account)

class UnLoginTemplate
  constructor: (@account)->
    @initTemplate()
    @initElement()
    @bindEvent()

  initTemplate: ->
    ele = $("#unLoginPageTemplate")
    source   = ele.innerHTML;
    @template = Handlebars.compile(source);
    $('#content').innerHTML = @template()

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
    self = @
    $ele = @element
    username = $ele.username.value
    password = $ele.password.value
    @account.login username, password, (data)->
      console.log data
      new LoginTemplate(self.account, data)


class Popup
  constructor: (@account)->
    @checkLogin()

  checkLogin: ->
    self = @
    @account.isLogin (data)->
      console.log data
      if data
        new LoginTemplate(self.account, data)
      else
        new UnLoginTemplate(self.account)

new Popup(account)