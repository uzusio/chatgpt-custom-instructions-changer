<template>
  <div>
    <textarea
      v-model="text1"
      placeholder="テキスト1を入力してください"
    ></textarea>
    <textarea
      v-model="text2"
      placeholder="テキスト2を入力してください"
    ></textarea>
    <button @click="pasteText">送信</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text1: "",
      text2: "",
    };
  },
  methods: {
    pasteText() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "pasteText",
          text: this.text1,
          id: "textArea1",
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "pasteText",
          text: this.text2,
          id: "textArea2",
        });
      });
      console.log(this.text1, this.text2);
    },
  },
};
</script>

<style scoped>
/* 必要に応じてここでスタイリングを追加 */
</style>
