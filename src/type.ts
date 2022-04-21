export type documentObject = {
  title: string;
  id: string;
  url: string;
  markdownContent: {
    lead?: string[];
    procedure?: string[];
    question: string[];
  };
  options: { label: string; next: string }[];
};
