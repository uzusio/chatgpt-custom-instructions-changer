document.getElementById("pasteButton").addEventListener("click", () => {
  const text1 = document.getElementById("textArea1").value;
  const text2 = document.getElementById("textArea2").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "pasteText",
      text: text1,
      id: "textArea1",
    });
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "pasteText",
      text: text2,
      id: "textArea2",
    });
  });
  console.log(text1, text2);
});
