<template>
  <v-app>
    <v-list>
      <v-list-item v-for="item in items" :key="item.id">
        <v-list-item-content>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item-content>
        <v-btn @click="pasteText(item.text1, item.text2)">上書き</v-btn>
      </v-list-item>
    </v-list>
    <v-btn @click="createNewItem">新規作成</v-btn>
    <div v-if="showNewItemForm">
      <v-text-field
        v-model="label"
        label="ロール名を入力してください"
        :rules="[
          (v) => (v || '').length <= 128 || '128文字以内で入力してください',
        ]"
      ></v-text-field>
      <v-textarea
        v-model="text1"
        label="より良い回答を提供するために、ChatGPTに何を知ってもらいたいですか？"
        :rules="[
          (v) => (v || '').length <= 1500 || '1500文字以内で入力してください',
        ]"
      ></v-textarea>
      <v-textarea
        v-model="text2"
        label="ChatGPTにはどのように対応してほしいですか？"
        :rules="[
          (v) => (v || '').length <= 1500 || '1500文字以内で入力してください',
        ]"
      ></v-textarea>
      <v-btn @click="saveNewItem">保存</v-btn>
    </div>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      label: "",
      text1: "",
      text2: "",
      items: [],
      showNewItemForm: false,
    };
  },
  mounted() {
    // 初期化時に保存されたデータをロード
    // chrome.storage.sync.get("items", (result) => {
    //   if (result.items) {
    //     this.items = result.items;
    //   }
    // });
  },
  methods: {
    pasteText(text1, text2) {
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
    },
    createNewItem() {
      this.showNewItemForm = true;
    },
    saveNewItem() {
      // 新しいアイテムを保存
      const newItem = {
        id: Date.now(),
        label: this.label,
        text1: this.text1,
        text2: this.text2,
      };
      this.items.push(newItem);
      // chrome.storage.sync.set({ items: this.items });

      this.label = "";
      this.text1 = "";
      this.text2 = "";
      this.showNewItemForm = false;
    },
  },
};
</script>

<style scoped>
.v-label {
  white-space: normal;
  overflow: hidden;
}
</style>
