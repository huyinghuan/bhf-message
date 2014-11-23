window.BHFService = BHFService = {}

class Account
  constructor: ->

  login: (username, password)->
    console.log username, password
    @test

  logout: ->

  test: ->
    notification = window.BHFService.notification
    notification.show()

BHFService.account = new Account()