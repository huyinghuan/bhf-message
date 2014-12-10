storage = null
baseURL = ""

class MessageList
  constructor: ->
    @api = "#{baseURL}/api/message"

  refresh: ->
    @get (items)-> storage.save 'newMessage', items

  getRemoteData: (setting)->
    type = setting.type or 'GET'
    data = setting.data or {}
    success = setting.success or ->
    error = setting.error or ->
    url = @api
    $.ajax(
      type: type
      url: url
      data: data
      success: (data)->
        success and success(data)
      error: ()->
        error and error()
    )

  clear: -> storage.save 'newMessage', []

  get: (cb)->
    setting =
      data: status: "new"
      success: (result)-> cb and cb(result.items)

    @getRemoteData(setting)


  setAllHasRead: ()->
    self = @
    setting =
      type: 'PUT'
      success: ()-> self.refresh()

    @getRemoteData(setting)


  setMessageAsRead: (id, cb)->
    self = @
    setting =
      data: id: id
      type: 'PUT'
      success: ()-> self.refresh()

    @getRemoteData(setting)


if window.BHFService
  baseURL = window.BHFService.baseURL
  window.BHFService.messageList = new MessageList()
  storage = window.BHFService.storage