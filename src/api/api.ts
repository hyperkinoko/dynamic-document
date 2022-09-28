import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { documentObject } from "../types/documentObjectType";
import { documentConverter } from "../util";
import { index } from "../firebase/algolia";

export const getAllDocuments = async (): Promise<documentObject[]> => {
  const collectionName = "documents";
  const querySnapshot = await getDocs(
    collection(db, collectionName).withConverter(documentConverter)
  );
  // TODO:タイトルに重複がある場合どうする
  const data = querySnapshot.docs.map((doc) => doc.data());
  return data;
};

export const getDocument = async (queryId: string): Promise<documentObject> => {
  const docRef = doc(db, "documents", queryId).withConverter(documentConverter);
  const res = await getDoc(docRef).then((document) => document.data());
  if (res === undefined) {
    console.error(queryId);
    alert(`${queryId} document doesn't exist`);
    throw new Error(`${queryId} document doesn't exist`);
  }
  return res;
};

export const saveDocument = async (document: documentObject): Promise<void> => {
  try {
    const collectionName = "documents";
    if (document.id === "") {
      // 新規
      const docRef = await addDoc(
        collection(db, collectionName).withConverter(documentConverter),
        document
      );
      await updateDoc(docRef, {
        id: docRef.id,
      });
    } else {
      // 更新のみ
      await setDoc(
        doc(db, collectionName, document.id).withConverter(documentConverter),
        document
      );
    }
    alert("success");
  } catch (e) {
    alert("error");
    console.error("Error adding document: ", e);
  }
};

export const documentSearch = async (searchWord: string) => {
  const res = await index
    .search(searchWord, {
      attributesToHighlight: [],
      responseFields: ["hits", "hitsPerPage", "nbPages", "page"],
    })
    .then(({ hits }) => hits);
  return res;
};
