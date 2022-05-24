import db from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { documentObject } from "../type";
import documentConverter from "../util";

const getDocument = async (queryId: string): Promise<documentObject> => {
  const collRef = collection(db, "documents").withConverter(documentConverter);
  const snapshot = await getDocs(collRef);
  const res: documentObject | undefined = snapshot.docs
    .find((doc) => doc.data().id === queryId)
    ?.data();
  if (res === undefined) {
    console.error(queryId);
    alert(`${queryId} document isnt exist`);
    throw new Error(`${queryId} document isnt exist`);
  }
  return res;
};

export default getDocument;

// return data.docs.find((doc) => doc.data().id === queryId).data()
