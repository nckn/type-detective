// content.js

// Function to get font attributes
function getFontAttributes(element) {
  let style = window.getComputedStyle(element);
  return {
    "font-family": style.fontFamily,
    "font-size": style.fontSize,
    "font-weight": style.fontWeight,
    "font-style": style.fontStyle
  };
}

// Listener for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "inject") {
    // Create and inject the iframe
    let iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('panel.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '10px';
    iframe.style.right = '10px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.zIndex = '999999';
    document.body.appendChild(iframe);
  }
});

// Function to analyze font attributes
function analyzeFonts() {
  let textTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"];
  let uniqueResults = new Set();

  textTags.forEach(tag => {
    let elements = document.getElementsByTagName(tag);

    for (let i = 0; i < elements.length; i++) {
      let fontAttributes = getFontAttributes(elements[i]);
      let id = elements[i].id ? `#${elements[i].id}` : '';
      let textContent = elements[i].textContent.trim();
      let uniqueKey = JSON.stringify({ tag: tag + id, fontAttributes, textContent });

      // Only add to the result set if it's a new, unique entry
      if (!uniqueResults.has(uniqueKey)) {
        uniqueResults.add(uniqueKey);
      }
    }
  });

  // Now create HTML rows for each unique entry
  let resultHTML = '';
  uniqueResults.forEach(key => {
    let entry = JSON.parse(key);
    let fontAttributes = JSON.stringify(entry.fontAttributes, null, 2).replace(/"/g, '');
    resultHTML += `<tr><td>${entry.tag}</td><td><pre>${fontAttributes}</pre></td><td>${entry.textContent}</td></tr>`;
  });

  // Update the results div in the panel
  let resultsDiv = document.getElementById('results');
  if (resultsDiv) {
    resultsDiv.innerHTML = resultHTML;
  }
}
