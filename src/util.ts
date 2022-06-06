import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
  DocumentData,
} from "firebase/firestore";
import { documentObject } from "./type";

export const documentConverter: FirestoreDataConverter<documentObject> = {
  toFirestore(data: documentObject): DocumentData {
    return {
      title: data.title,
      id: data.id,
      url: data.url,
      markdownContent: {
        lead: data.markdownContent.lead,
        procedure: data.markdownContent.procedure,
        question: data.markdownContent.question,
      },
      options: data.options,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): documentObject {
    const data = snapshot.data(options);
    if (!isValid(data)) {
      console.error(data);
      throw new Error("invalid data");
    }
    return {
      title: data.title,
      id: data.id,
      url: data.url,
      markdownContent: {
        lead: data.markdownContent.lead?.replace("\\n", "\n\n"),
        procedure: data.markdownContent.procedure?.replace("\\n", "\n\n"),
        question: data.markdownContent.question.replace("\\n", "\n\n"),
      },
      options: data.options,
    };
  },
};

// ユーザー定義型ガード
const isValid = (data: any): data is documentObject => {
  if (data == null) return false;
  if (!(data.title && typeof data.title === "string")) {
    return false;
  }
  if (!(data.id && typeof data.id === "string")) {
    return false;
  }
  if (!(data.url && typeof data.url === "string")) {
    return false;
  }
  if (
    !(
      !data.markdownContent.lead ||
      typeof data.markdownContent.lead === "string"
    )
  ) {
    return false;
  }
  if (
    !(
      !data.markdownContent.procedure ||
      typeof data.markdownContent.procedure === "string"
    )
  ) {
    return false;
  }
  if (
    !(
      data.markdownContent.question &&
      typeof data.markdownContent.question === "string"
    )
  ) {
    return false;
  }
  if (!(data.options && typeof data.options === "object")) {
    return false;
  }
  return true;
};
