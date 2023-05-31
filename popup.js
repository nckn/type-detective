document.getElementById('analyze').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "analyze"}, function(response) {
      let resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = `<table><tr><th>Tag</th><th>Font Attributes</th><th>Text Content</th></tr>${response.result}</table>`;
    });
  });
});
