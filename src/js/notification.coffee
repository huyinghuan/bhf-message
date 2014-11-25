###
  封装 各个浏览器的消息提醒
###
utils = {}
storage = {}

#chrome 浏览器的消息通知机制
class ChromeBrowser
  constructor: ->
    @notification = chrome.notifications
    @browserAction = chrome.browserAction
    @initEvent()

  show: (data = {}, cb)->
    options = @getOptions()

    options.message = data.message if data.message
    options.title = data.title if data.title

    if not data.link
      options.buttons = [{title: '忽略'}]

    @notification.create('', options, (nid)-> cb and cb(nid))

    #设置浏览器上面的文字
    @browserAction.setBadgeText({text: "10+"});

  getOptions: ->
    setting =
      type: "basic",
      title: "BHF 消息",
      message: 'Test Message'
      iconUrl: "assets/icon_128.png"
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
    self = @
    storage.get(nid, (data)->
      if not data.link
        return self.close(nid)
      console.log '点击查看按钮的动作拉取数据', data
      #self.close(nid)
    )

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
    @browser.show(message, (nid)->
      console.log 'create nid', nid
      message.timestamp = new Date().getTime()
      storage.set nid, message
    )


if window.BHFService
  utils = window.BHFService.utils
  storage = window.BHFService.storage
  window.BHFService.notification = new Notification(new Factory())

