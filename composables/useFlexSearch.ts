import { Document } from "@akryum/flexsearch-es";
import type { BackupItems, BackupItem } from "./storage";

export default function useFlexSearch(initalDocs: BackupItems) {
  const document = new Document<BackupItem>({
    preset: "match",
    tokenize: "reverse",
    // worker: true,
    document: {
      id: "link",
      field: ["description", "title", "domain"],
    },
  });

  Array.from(initalDocs.entries()).forEach(([key, item]) =>
    document.add(key, item),
  );

  return document;
}
