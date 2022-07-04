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
export const isValid = (data: any): data is documentObject => {
  const missingData: string[] = [];
  if (data == null) return false;
  if (!(data.title && typeof data.title === "string")) {
    missingData.push("タイトル");
  }
  if (!(data.url && typeof data.url === "string")) {
    missingData.push("url");
  }
  if (
    !(
      !data.markdownContent.lead ||
      typeof data.markdownContent.lead === "string"
    )
  ) {
    missingData.push("リード");
  }
  if (
    !(
      !data.markdownContent.procedure ||
      typeof data.markdownContent.procedure === "string"
    )
  ) {
    missingData.push("手順");
  }
  if (
    !(
      data.markdownContent.question &&
      typeof data.markdownContent.question === "string"
    )
  ) {
    missingData.push("質問");
  }
  if (
    !(
      data.options &&
      data.options.length !== 0 &&
      typeof data.options === "object"
    )
  ) {
    missingData.push("質問の回答");
  }
  if (missingData.length !== 0) {
    alert(`次の項目が不足しています
    ${missingData}
    `);
    console.error(missingData);
    return false;
  } else {
    return true;
  }
};
