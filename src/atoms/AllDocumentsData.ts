import { atom } from "recoil";

export const allDocumentsState = atom<{ [key: string]: string }>({
  key: "allDocumentsState",
  default: {},
});
