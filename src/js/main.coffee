window.BHFService = BHFService = {}

class Account
  constructor: ->

  login: (username, password)->
    console.log username, password

  logout: ->


BHFService.account = new Account()