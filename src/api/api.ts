import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { documentObject } from "../type";
import { documentConverter } from "../util";

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
  queryId: string
) => {
  try {
    await setDoc(
      doc(db, "documents", queryId).withConverter(documentConverter),
      document
    );
    alert("success");
  } catch (e) {
    alert("error");
    console.error("Error adding document: ", e);
  }
};
