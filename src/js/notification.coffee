###
  封装 各个浏览器的消息提醒
###
utils = {}
#浏览器动作
class BrowserAction
  constructor: ->

  close: ()->

  click: ()->

  save: (key, value)->

#chrome 浏览器的消息通知机制
class ChromeBrowser
  constructor: ->
    @action = new BrowserAction()
    @notification = chrome.notifications
    @initEvent()

  show: (data = {})->
    options = @getOptions()

    options.message = data.message if data.message
    options.title = data.title if data.title

    @notification.create '', options, (nid)->

  getOptions: ->
    setting =
      type: "basic",
      title: "BHF 消息",
      message: 'Test Message'
      iconUrl: "assets/icon_16.png"
      buttons: [
        {title: '查看'}
        {title: '忽略'}
      ]

  initEvent: ->
    self = @
    @notification.onButtonClicked.addListener (nid, index)->
      if index is 0
        self.click(nid)
      else
        self.close(nid)

  close: (nid)->
    @notification.clear(nid, ->)

  click: (nid)->
    console.log nid
    @close(nid)

  isAllow: (cb)->
    @notification.getPermissionLevel (permission)->
      if permission is 'granted'
        cb && cb(true)
      else
        cb && cb(false)

#FireFox的消息通知机制
class FireFoxBrowser
  constructor: ->

#Safari的消息通知机制
class SafariBrowser
  constructor: ->

#浏览器判断
class Factory
  constructor: ->
    @utils = utils
    @initBrowser()

  initBrowser: ->
    browser = @utils.getBrowser()
    if browser is @utils.Browser.CHROME
      browser = new ChromeBrowser()
    else if browser is @utils.Browser.FIREFOX
      browser =  new FireFoxBrowser()
    else if browser is @utils.Browser.SAFARI
      browser = new SafariBrowser()
    @browser = browser

  getBrowser: ->
    return @browser

#对外接口
class Notification
  constructor: (factory)->
    @browser = factory.getBrowser()

  show: (message)->
    @browser.show(message)


if window.BHFService
  utils = window.BHFService.utils
  window.BHFService.notification = new Notification(new Factory())

