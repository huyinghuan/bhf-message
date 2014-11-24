window.BHFService = BHFService = {}

class Account
  constructor: ->

  login: (username, password)->
    console.log username, password
    user =
      account: "胡瀛寰"
      password: "888888"

#    $.put('http://bhf.hunantv.com/mime', user, (r)->
#      console.log r,222
#    )

    $.ajax(
      type: 'POST'
      url: 'http://localhost:8001/api/session'
      data: user
      success: (d)-> console.log 1, d
      error: (x, type)-> console.log 2, x, type
    )


  logout: ->

  test: ->
    notification = window.BHFService.notification
    notification.show()

BHFService.account = new Account()