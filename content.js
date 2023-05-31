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
      let uniqueResults = new Set();

      textTags.forEach(tag => {
        let elements = document.getElementsByTagName(tag);

        for(let i=0; i<elements.length; i++) {
          let fontAttributes = getFontAttributes(elements[i]);
          let id = elements[i].id ? `#${elements[i].id}` : '';
          let uniqueKey = JSON.stringify({ tag: tag + id, fontAttributes });

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
        resultHTML += `<tr><td>${entry.tag}</td><td><pre>${fontAttributes}</pre></td></tr>`;
      });

      sendResponse({result: resultHTML});
    }
  }
);



// function getFontAttributes(element) {
//   let style = window.getComputedStyle(element);
//   return {
//     "font-family": style.fontFamily,
//     "font-size": style.fontSize,
//     "font-weight": style.fontWeight,
//     "font-style": style.fontStyle
//   };
// }

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if(request.action === "analyze") {
//       let textTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"];
//       let results = [];

//       textTags.forEach(tag => {
//         let elements = document.getElementsByTagName(tag);

//         for(let i=0; i<elements.length; i++) {
//           results.push({
//             "tag": tag,
//             "innerText": elements[i].innerText,
//             "fontAttributes": getFontAttributes(elements[i])
//           });
//         }
//       });

//       sendResponse({result: JSON.stringify(results, null, 2)});
//     }
//   }
// );
