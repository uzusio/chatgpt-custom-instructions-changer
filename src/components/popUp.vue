<template>
  <v-app>
    <v-list>
      <v-list-item v-for="item in items" :key="item.id">
        <v-list-item-content class="d-flex align-center justify-space-between">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
          <div class="no-overflow">
            <v-btn
              class="fixed-btn"
              icon
              @click="pasteText(item.text1, item.text2)"
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn class="fixed-btn" icon @click="editItem(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="fixed-btn"
              icon
              @click="toggleDeleteConfirmation(item.id)"
            >
              <v-icon v-if="deletingItems[item.id]">mdi-check</v-icon>
              <!-- 確認アイコン -->
              <v-icon v-else>mdi-delete</v-icon>
              <!-- 削除アイコン -->
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-btn
      @click="toggleEditItemForm"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ buttonText }}
    </v-btn>
    <div v-if="showNewItemForm || showEditItemForm">
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
      <v-btn
        style="width: 100%; bottom: 2px"
        @click="editMode ? updateItem() : saveNewItem()"
      >
        保存
      </v-btn>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
const label = ref("");
const text1 = ref("");
const text2 = ref("");
const items = ref([]);
const showNewItemForm = ref(false);
const deletingItems = ref({});
const editingItemId = ref(null);
const showEditItemForm = ref(false);
const editMode = computed(() => editingItemId.value !== null);
const buttonText = computed(() =>
  mouseOverOnToggleButton.value && showEditItemForm.value
    ? "キャンセル"
    : editMode.value
    ? "編集"
    : "新規作成"
);
const mouseOverOnToggleButton = ref(false);

// 初期化時に保存されたデータをロード
chrome.storage.sync.get("items", (result) => {
  if (result.items) {
    items.value = Object.values(result.items);
  }
});

const pasteText = (text1, text2) => {
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
};

const toggleEditItemForm = () => {
  showNewItemForm.value = false;
  showEditItemForm.value = !showEditItemForm.value;
  clearEditForm();
};

const saveNewItem = () => {
  const newItem = {
    id: Date.now(),
    label: label.value,
    text1: text1.value,
    text2: text2.value,
  };
  items.value.push(newItem);
  chrome.storage.sync.set({ items: items.value });

  label.value = "";
  text1.value = "";
  text2.value = "";
  showNewItemForm.value = false;
};

const editItem = (item) => {
  label.value = item.label;
  text1.value = item.text1;
  text2.value = item.text2;
  editingItemId.value = item.id;
  showEditItemForm.value = true;
};

const deleteItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id);
  chrome.storage.sync.set({ items: items.value });
  delete deletingItems.value[id];
};

const toggleDeleteConfirmation = (id) => {
  if (deletingItems.value[id]) {
    deleteItem(id);
  } else {
    deletingItems.value[id] = true;
  }
};

const updateItem = () => {
  const index = items.value.findIndex(
    (item) => item.id === editingItemId.value
  );
  if (index !== -1) {
    items.value[index].label = label.value;
    items.value[index].text1 = text1.value;
    items.value[index].text2 = text2.value;
    chrome.storage.sync.set({ items: items.value });
  }
  clearEditForm();
  showEditItemForm.value = false;
};

const clearEditForm = () => {
  label.value = "";
  text1.value = "";
  text2.value = "";
  editingItemId.value = null;
};

const onMouseOver = () => {
  mouseOverOnToggleButton.value = true;
};

const onMouseOut = () => {
  mouseOverOnToggleButton.value = false;
};
</script>

<style scoped>
.no-overflow {
  overflow: visible;
  white-space: nowrap;
}

.no-overflow .v-list-item-content {
  white-space: nowrap;
}

.v-label {
  white-space: normal;
  overflow: hidden;
}

.fixed-btn {
  margin: 3px;
  flex-shrink: 0; /* ボタンが縮小しないようにする */
}
</style>
