BHFService = chrome.extension.getBackgroundPage().BHFService
account = BHFService.account
message = BHFService.message

$ = (selector)->
  idReg = /^#/
  if idReg.test selector
    selector = selector.replace idReg, ''
    return document.getElementById(selector)
  else
    document.querySelector(selector)

class HasUserTemplate
  constructor: (@account, data)->
    @initTemplate(data)
    @initElement()
    @bindEvent()

  initTemplate: (data)->
    ele = $("#hasUserPageTemplate")
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
        new NoUserTemplate(self.account)

class NoUserTemplate
  constructor: (@account)->
    @initTemplate()
    @initElement()
    @bindEvent()

  initTemplate: ->
    ele = $("#noUserPageTemplate")
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
      new HasUserTemplate(self.account, data)


class Popup
  constructor: (@account)->
    @checkLogin()

  checkLogin: ->
    self = @
    @account.checkLogin (data)->
      console.log 'checkLogin', data
      if data
        new HasUserTemplate(self.account, data)
      else
        new NoUserTemplate(self.account)

new Popup(account)