import { defineStore } from "pinia";
import DocumentContractJSON from "@/assets/Document.json";
import Web3  from "web3";

const web3 = new Web3("ws://localhost:7545");

const contractAddress = "0x8E44e55f589E3c249A65c1Af7905b19D5F83d8De";

export const useAccountStore = defineStore({
  id: "account",
  state: () => ({
    currentAccount: "",
  }),
  getters: {
    getCurrentAccount: (state) => state.currentAccount,
    allAccounts: async () => await web3.eth.getAccounts(),
    // @ts-ignore
    contract: (store) => store.currentAccount === "" ? undefined : new web3.eth.Contract(DocumentContractJSON.abi, contractAddress),
  },
  actions: {
    setAccount(account: string) {
      this.currentAccount = account;
    },
  },
});
