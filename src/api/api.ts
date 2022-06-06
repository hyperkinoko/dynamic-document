import db from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { documentObject } from "../type";
import documentConverter from "../util";

const getDocument = async (queryId: string): Promise<documentObject> => {
  const docRef = doc(db, "documents", queryId).withConverter(documentConverter);
  const res = await getDoc(docRef).then((document) => document.data());
  if (res === undefined) {
    console.error(queryId);
    alert(`${queryId} document doesn't exist`);
    throw new Error(`${queryId} document doesn't exist`);
  }
  return res;
};

export default getDocument;

// return data.docs.find((doc) => doc.data().id === queryId).data()
