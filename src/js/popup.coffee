BHFService = chrome.extension.getBackgroundPage().BHFService
account = BHFService.account
messageList = BHFService.messageList
baseURL = BHFService.website

class HasUserTemplate
  constructor: (@account, data)->
    @message = messageList
    @initTemplate(data)


  initTemplate: (data)->
    data.baseURL = baseURL
    self = @
    ele = $("#hasUserPageTemplate")
    source   = $(ele).html()
    template = Handlebars.compile(source)
    @message.get((items)->
      data.messageList = items
      $('#content').html template(data)
      self.initElement()
      self.bindEvent()
    )

  initElement: ->
    @element =
      logout: $('#logout')
      messageList: $('#messageList')

  bindEvent: ->
    self = @
    $ele = @element
    $ele.logout.on 'click', ->
      self.account.logout ()-> new NoUserTemplate(self.account)
    $ele.messageList.find('a').on 'click', ->
      url = $(this).data('url')
      id = $(this).data('id')
      window.open url if url
      if id
        self.message.setMessageAsRead(id)
        $(this).parent('li').remove()
        $('.messageCount').html $('.messageCount').html() - 1

class NoUserTemplate
  constructor: (@account)->
    @initTemplate()
    @initElement()
    @bindEvent()

  initTemplate: ->
    ele = $("#noUserPageTemplate")
    source   = ele.html();
    @template = Handlebars.compile(source);
    $('#content').html @template()

  initElement: ->
    @element =
      username: $('#username')
      password:$('#password')
      login: $('#login')

  bindEvent: ->
    $login = @element.login
    self = @
    $login.on 'click', ->
      self.login()

  login: ->
    self = @
    $ele = @element
    username = $ele.username.val()
    password = $ele.password.val()
    @account.login username, password, (error, data)->
      if not error
        new HasUserTemplate(self.account, data)
      else
        self.showError(error)

  showError: (error)->
    $('#errorMsg').html error

class Popup
  constructor: (@account)->
    self = @
    @account.checkLogin(
      (data)->
        new HasUserTemplate(self.account, data)
      ,()->
        new NoUserTemplate(self.account)
    )

new Popup(account)