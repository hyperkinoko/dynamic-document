import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { documentObject } from "../types/documentObjectType";
import { documentConverter } from "../util";

export const getAllDocuments = async (
  collectionName: string
): Promise<documentObject[]> => {
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

export const saveDocument = async (
  document: documentObject,
  collectionName: string
): Promise<void> => {
  try {
    const docRef = await addDoc(
      collection(db, collectionName).withConverter(documentConverter),
      document
    );
    await updateDoc(docRef, {
      id: docRef.id,
    });
    alert("success");
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    alert("error");
    console.error("Error adding document: ", e);
  }
};
