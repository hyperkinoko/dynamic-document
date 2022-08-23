import { FirebaseError } from "firebase/app";
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
  DocumentData,
} from "firebase/firestore";
import { documentObject } from "./types/documentObjectType";

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
export const isValid = (data: any): data is documentObject => {
  const missingData: string[] = [];
  if (data == null) return false;
  if (!(data.title && typeof data.title === "string")) {
    missingData.push("タイトル");
  }
  if (!(data.id && typeof data.id === "string")) {
    missingData.push("id");
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

// エラーハンドリング
export const errorHandling = (error: FirebaseError): void => {
  const errorCode: string = error.code;
  const errorName: string = error.name;
  const errorMessage: string = error.message;

  if (errorName === "Error") {
    alert("メール認証を済ませてください");
  } else if (errorCode === "auth/invalid-email") {
    alert("正しい形式のメールアドレスを入力してください");
  } else if (errorCode === "auth/wrong-password") {
    alert("パスワードが違います");
  } else if (errorCode === "auth/auth/weak-password") {
    alert("パスワードは7文字以上に設定してください");
  } else if (errorCode === "auth/too-many-requests") {
    alert(
      "連続でログインに失敗しました。少し時間を開けてもう一度お試しください"
    );
  } else if (errorCode === "auth/email-already-in-use") {
    alert("そのメールアドレスは既に登録されています");
  } else if (errorCode === "auth/user-not-found") {
    alert("ユーザーが存在しません");
  } else {
    alert(`エラー:${errorMessage}`);
  }
};
