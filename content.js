function getFontAttributes(element) {
  let style = window.getComputedStyle(element);
  return {
    "font-family": style.fontFamily,
    "font-size": style.fontSize,
    "font-weight": style.fontWeight,
    "font-style": style.fontStyle
  };
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "analyze") {
      let textTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"];
      let results = [];

      textTags.forEach(tag => {
        let elements = document.getElementsByTagName(tag);

        for(let i=0; i<elements.length; i++) {
          results.push({
            "tag": tag,
            "innerText": elements[i].innerText,
            "fontAttributes": getFontAttributes(elements[i])
          });
        }
      });

      sendResponse({result: JSON.stringify(results, null, 2)});
    }
  }
);
