utils =
  Browser:
    CHROME: 'chrome'
    FIREFOX: 'firefox'
    SAFARI: 'safari'
  getBrowser: ->
    return utils.Browser.CHROME if chrome? and chrome.extension?

if window.BHFService
  window.BHFService.utils = utils