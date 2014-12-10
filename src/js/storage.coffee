###
  数据存储的封装
###
class ChromeStorage
  constructor: ->
    @storage = chrome.storage.local

  save: (key, value)->
    obj = {}
    obj[key] = value
    @storage.set obj

  get: (key, cb)->
    @storage.get(key, (data)->
      data = {} if not data
      cb and cb(data[key])
    )

  clear: (key)->
    @storage.remove key

class FireFoxStorage
  constructor: ->

class SafariStorage
  constructor: ->

class Factory
  constructor: ->
    @utils = window.BHFService.utils

  getStorage: ->
    if @utils.getBrowser() is @utils.Browser.CHROME
      return new ChromeStorage()

class Storage
  constructor: (factory)->
    @storage = factory.getStorage()

  save: (key, value)->
    @storage.save key, value

  get: (key, cb)->
    @storage.get key, cb

  clear: (key)->
    @storage.clear key

if window.BHFService
  window.BHFService.storage = new Storage(new Factory())