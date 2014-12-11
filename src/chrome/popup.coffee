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
    mainTemplate = Handlebars.compile($("#hasUserPageTemplate").html())
    @listTemplate = Handlebars.compile($("#messageListTemplate").html())
    @emptyTemplate = Handlebars.compile($("#messageEmptyTempalte").html())
    $('#content').html mainTemplate(data)
    @initElement()
    @setMessageListEmpty()
    @initMessageList(data)
    @bindEvent()

  initElement: ->
    @element =
      logout: $('#logout')
      messageList: $('#messageList')
      hasReadAll: $('#hasReadAll')
      goToHome: $('#goHome')
      messageCount: $('.messageCount')

  initMessageList: (data)->
    self = @
    $ele = @element
    @message.get((items)->
      data.messageList = items
      return if not items.length
      $ele.messageList.html self.listTemplate data
      self.bindMessageListClickEvents()
      $ele.messageCount.html items.length
    )

  bindEvent: ->
    self = @
    $ele = @element
    $ele.logout.on 'click', ->
      self.account.logout ()-> new NoUserTemplate(self.account)

    $ele.hasReadAll.on 'click', ->
      self.message.setAllHasRead()
      self.clearMessageListHtml()

    $ele.goToHome.on 'click', ->
      window.open baseURL

  bindMessageListClickEvents: ->
    self = @
    $ele = @element
    $ele.messageList.find('a').on 'click', ->
      url = $(this).data('url')
      id = $(this).data('id')
      window.open url if url
      self.message.setMessageAsRead(id)
      $(this).parent('li').remove()
      count = +$ele.messageCount.html()
      $ele.messageCount.html(count - 1)
      self.setMessageListEmpty() if count is 1

  clearMessageListHtml: ->
    $ele = @element
    $ele.messageList.find('li').remove()
    $ele.messageCount.html 0
    @setMessageListEmpty()

  setMessageListEmpty: ->
    $ele = @element.messageList.html @emptyTemplate()


class NoUserTemplate
  constructor: (@account)->
    @initTemplate()
    @initElement()
    @bindEvent()

  initTemplate: ->
    ele = $("#noUserPageTemplate")
    source   = ele.html()
    @template = Handlebars.compile(source)
    $('#content').html @template()

  initElement: ->
    @element =
      username: $('#username')
      password:$('#password')
      login: $('#login')

  bindEvent: ->
    $login = @element.login
    $password = @element.password
    self = @
    $login.on 'click', ->
      self.login()

    $password.on 'keyup', (e)->
      if e.keyCode is 13
        e.preventDefault()
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