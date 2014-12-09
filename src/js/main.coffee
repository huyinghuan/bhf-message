dev = false
window.BHFService = BHFService = {}
testURL = 'http://localhost:8001'
testSocketURL = 'ws://localhost:8001'
testWebsite = 'http://localhost:14422'
url = "http://bhf.hunantv.com:8001"
socketURL = "ws://bhf.hunantv.com:8001"
website = "http://bhf.hunantv.com"
window.BHFService.baseURL = if dev then testURL else url
window.BHFService.socketURL = if dev then testSocketURL else socketURL
window.BHFService.website =  if dev then testWebsite else website