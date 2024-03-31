<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { ref, watch } from "vue";

const accountStore = useAccountStore();

const allAccounts = ref<string[]>(await accountStore.allAccounts);
const file = ref<File>();

const selectedAccount = ref("");

async function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

async function uploadFile() {
  if (!file.value) {
    return;
  }

  try {
    const result = await toBase64(file.value);
    console.log(result);
    console.log(
      await accountStore.contract?.methods.setDocument("id", result).send()
    );
  } catch (error) {
    console.error(error);
  }
}

const permission = ref(false);
accountStore.$subscribe(async (_, state) => {
  if (accountStore.contract && selectedAccount.value) {
    accountStore.contract.defaultAccount = state.currentAccount;
    permission.value = await accountStore.contract?.methods
      .getPermissionForDocument(selectedAccount.value, "id")
      .call();
  }
});

watch(selectedAccount, async (newValue, _) => {
  permission.value = await accountStore.contract?.methods
    .getPermissionForDocument(newValue, "id")
    .call();
});
</script>

<template>
  <main>
    <h1>{{ accountStore.currentAccount }}</h1>
    <select v-model="accountStore.currentAccount">
      <option v-for="acc in allAccounts" :key="acc">{{ acc }}</option>
    </select>
    <input type="file" @change="(event) => (file = event?.target?.files[0])" />
    <button @click="uploadFile">Upload</button>
    <h1>{{ file?.name }}</h1>
    <select v-model="selectedAccount">
      <option v-for="acc in allAccounts" :key="acc">{{ acc }}</option>
    </select>
    <h2>{{ permission }}</h2>
  </main>
</template>
