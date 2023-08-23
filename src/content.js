chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.action === "pasteText") {
    // ターゲットとなるエレメントを取得
    const pElements = document.querySelectorAll("p.text-muted");
    const element1 = pElements[0].nextElementSibling.querySelector("textarea");
    const element2 = pElements[1].nextElementSibling.querySelector("textarea");

    // 両方のエレメントが存在することを確認
    if (element1 && element2) {
      // テキストを上書き
      if (request.id === "textArea1") {
        element1.value = request.text;
        element1.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (request.id === "textArea2") {
        element2.value = request.text;
        element2.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }
});
