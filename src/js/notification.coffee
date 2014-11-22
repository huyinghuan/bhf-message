###
  封装 各个浏览器的消息提醒
###

window.BHFService = {} if not window.BHFService

class ChromeBrowser
  constructor: ->
    @notification = chrome.notifications
    @initEvent()

  show: (message)->

  initEvent: ->
    @notification.onClosed.addListener (nid, byUser)->

    @notification.onClicked.addListener (notificationId)->



  isAllow: (cb)->
    @notification.getPermissionLevel (permission)->
      if permission is 'granted'
        cb && cb(true)
      else
        cb && cb(false)

class FireFoxBrowser
  constructor: ->

class SafariBrowser
  constructor: ->


class Factory
  constructor: ->
    @initFunctions()

  isChrome: ->
    return true if chrome? and chrome.extension?

  isFireFox: ->
    return false

  isSafari: ->
    return false

  initBrowser: ->
    browser = null
    if @isChrome()
      browser = new ChromeBrowser()
    else if @isFireFox()
      browser =  new FireFoxBrowser()
    else if @isSafari()
      browser = new SafariBrowser()
    @browser = browser

  getBrowser: ->
    return @browser


class Notification
  constructor: (factory)->
    @browser = factory.getBrowser()

  show: (message)->
    @browser.show(message)

window.BHFService.notification = new Notification(new Factory())

