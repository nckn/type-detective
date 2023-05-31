document.getElementById('analyze').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "analyze"}, function(response) {
      document.getElementById('results').innerHTML = response.result;
    });
  });
});
