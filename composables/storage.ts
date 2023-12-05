import { createStorage } from "unstorage";
import indexedDbDriver from "unstorage/drivers/indexedb";

export type BackupItem = {
  image?: string | null;
  title?: string | null;
  description?: string | null;
  domain: string;
  link: string;
};

export type BackupItems = Map<string, BackupItem>;

export const useStorage = () =>
  useState("storage", () =>
    createStorage<BackupItem>({
      driver: indexedDbDriver({ base: "brain:" }),
    }),
  );

export async function getBackup() {
  const storage = useStorage();
  const keys = await storage.value.getKeys();
  // slice 6 is here to remove brain: from the key
  const items = await storage.value.getItems(keys.map((x) => x.slice(6)));
  return new Map(items.map((x) => [x.key, x.value])) as BackupItems;
}

export async function setBackup(data: BackupItems) {
  const storage = useStorage();

  return Promise.all(
    Array.from(data.entries()).map(([key, value]) =>
      storage.value.setItem(key, value),
    ),
  );
}
