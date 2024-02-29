<script setup lang="ts">
import type { Document as FlexDocument } from "@akryum/flexsearch-es";
import type { BackupItem } from "~/composables/storage";

const isDragHoveringAndValid = ref(false);
const searchQuery = ref("");
const toast = useToast();

const records = ref(new Map<string, BackupItem>());
const flex: Ref<FlexDocument<unknown, false> | undefined> = ref();
const searchResults = computed(() => {
  if (!flex.value) return [];

  const ids = new Set(
    flex.value
      .search(searchQuery.value, {
        suggest: true,
        limit: 100,
      })
      .flatMap((x) => x.result),
  );

  return new Map(
    Array.from(records.value.entries()).filter(([key]) => ids.has(key)),
  ).values();
});

onMounted(async () => {
  const items = await getBackup();
  if (items) records.value = items;
  watch(records, async (items) => setBackup(items), { deep: true });
  flex.value = useFlexSearch(items);
});

function dragEnter(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (
    e.dataTransfer?.types.includes("text/uri-list") ||
    e.dataTransfer?.types.includes("text/plain")
  ) {
    isDragHoveringAndValid.value = true;
  }
}

function dragLeave(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDragHoveringAndValid.value = false;
}

async function addLink(link: string) {
  const { data, error } = await useFetch("/api/meta", {
    query: { uri: link },
    cache: "force-cache",
  });

  if (error.value) {
    console.error(error.value);
    return false;
  }

  if (!data.value?.success) return false;

  const key = encodeURIComponent(link);
  const value = {
    image:
      data.value.image ||
      data.value.ogImage?.url ||
      data.value.twitterImage?.url,
    domain: data.value.domain,
    description: data.value.ogDescription,
    title: data.value.ogTitle || data.value.twitterTitle,
    link,
  };

  records.value.set(key, value);
  flex.value?.add(key, value);
  toast.success("Link added.", 5000);
  return true;
}

async function processDataTransfer(data: DataTransfer | null) {
  if (
    data?.types.includes("text/uri-list") ||
    data?.types.includes("text/plain")
  ) {
    const URIs = parseUriList(data?.getData("text/uri-list"));
    const textData = data?.getData("text/plain");

    if (!textData.includes("://")) {
      URIs.push("https://" + textData);
      URIs.push("http://" + textData);
    } else {
      URIs.push(textData);
    }

    const validURIs = URIs.filter(isValidURI);

    for (const uri of validURIs) {
      if (await addLink(uri)) return;
    }
    toast.error("Failed to add a link.", 5000);
  }
}

async function dropHandler(e: DragEvent | ClipboardEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDragHoveringAndValid.value = false;

  processDataTransfer(
    (e as DragEvent).dataTransfer || (e as ClipboardEvent).clipboardData,
  );
}

async function promptNewLink() {
  const x = prompt("Paste your link");

  if (!x) return toast.warn("Aborted.");
  if (!(await addLink(x))) toast.error("Failed to add a link.", 5000);
}

async function getLinkFromClipboard() {
  const hasAccess = await hasClipboardReadAccess();

  if (!hasAccess) return promptNewLink();

  try {
    const clipboardContents = await navigator.clipboard.read();

    for (const item of clipboardContents) {
      const URIs: string[] = [];

      if (item?.types.includes("text/uri-list")) {
        const URIListBlob = await item.getType("text/uri-list");
        const URIList = await URIListBlob.text();
        URIs.push(...parseUriList(URIList));
      }

      if (item?.types.includes("text/plain")) {
        const blob = await item.getType("text/plain");
        const textData = await blob.text();

        if (!textData.includes("://")) {
          URIs.push("https://" + textData);
          URIs.push("http://" + textData);
        } else {
          URIs.push(textData);
        }
      }

      const validURIs = URIs.filter(isValidURI);

      for (const uri of validURIs) {
        if (await addLink(uri)) return;
      }
    }

    toast.error("Failed to add a link.", 5000);
  } catch (error) {
    console.error(error);
    return promptNewLink();
  }
}

function remove(link: string, event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  const id = encodeURIComponent(link);

  records.value.delete(id);
  records.value.delete("brain:" + id);
  flex.value?.remove(id);
  flex.value?.remove("brain:" + id);
}
</script>

<template>
  <main
    :aria-checked="isDragHoveringAndValid"
    class="px-5 py-10 aria-checked:blur-xl"
    @paste="dropHandler"
    @drop="dropHandler"
    @dragenter="dragEnter"
    @dragover="dragEnter"
    @dragleave="dragLeave"
  >
    <header class="flex flex-col items-center max-w-xl mx-auto">
      <h1 class="text-6xl font-black text-white/50">Brain;</h1>
      <input
        id="search"
        v-model="searchQuery"
        autofocus
        class="py-4 px-5 text-md my-10 rounded-xl block w-full border-0 text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-600"
        placeholder="Query your brain"
        type="search"
        name="search"
      />
    </header>

    <div class="mt-10 mx-auto max-w-6xl flex flex-wrap justify-center gap-5">
      <NuxtLink
        v-for="card in searchQuery ? searchResults : records.values()"
        :key="card.link"
        target="_blank"
        :to="card.link"
        class="contents"
      >
        <article
          class="group relative h-36 max-w-[17.2rem] w-full bg-white/10 rounded-lg overflow-hidden"
        >
          <img
            v-if="card.image"
            class="object-cover h-full w-full"
            :src="card.image"
          />
          <img
            v-else-if="card.domain"
            class="object-scale-down h-full w-full"
            :src="`https://${card.domain}/favicon.ico`"
          />
          <button
            class="absolute top-1 right-1 hidden group-hover:block z-10"
            @click="remove(card.link, $event)"
          >
            <Icon
              name="ic:sharp-remove-circle"
              class="h-6 w-6 text-white/50 hover:text-white/80"
            />
          </button>
          <header
            class="flex absolute p-4 bottom-0 inset-x-0 group-hover:top-0 backdrop-blur-md bg-black/20"
          >
            <p class="mt-auto line-clamp-1 group-hover:line-clamp-none">
              {{ card.title }}
            </p>
            <!-- <p>{{ card.description }}</p> -->
          </header>
        </article>
      </NuxtLink>
      <Empty v-if="!records.size" @click="getLinkFromClipboard" />
    </div>

    <ClientOnly>
      <Teleport to="body">
        <button
          type="button"
          class="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex rounded-full bg-indigo-600 p-3.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="getLinkFromClipboard"
        >
          <Icon name="heroicons:clipboard" class="h-7 w-7" />
        </button>
      </Teleport>
    </ClientOnly>
  </main>
</template>
