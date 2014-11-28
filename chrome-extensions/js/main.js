(function() {
  var BHFService, dev, socketURL, testSocketURL, testURL, testWebsite, url, website;

  dev = true;

  window.BHFService = BHFService = {};

  testURL = 'http://localhost:8001';

  testSocketURL = 'ws://localhost:8001';

  testWebsite = 'http://localhost:14422';

  url = "http://bhf.hunantv.com:8001";

  socketURL = "ws://bhf.hunantv.com:8001";

  website = "http://bhf.hunantv.com";

  window.BHFService.baseURL = dev ? testURL : url;

  window.BHFService.socketURL = dev ? testSocketURL : socketURL;

  window.BHFService.website = dev ? testWebsite : website;

}).call(this);
