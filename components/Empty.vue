<script setup lang="ts">
defineEmits<{
  (event: "click"): void;
}>();
</script>

<template>
  <div class="text-center">
    <svg
      class="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <h3 class="mt-2 text-sm font-semibold text-slate-50">No bookmarks</h3>
    <p class="my-2 text-sm text-gray-200">
      Drag and drop or
      <kbd
        class="px-1.5 py-1 mx-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
        >Ctrl+V</kbd
      >
      a link to get started.
    </p>
    <div class="mt-6">
      <button
        type="button"
        class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="$emit('click')"
      >
        <Icon class="-ml-0.5 mr-1.5 h-5 w-5" name="heroicons:clipboard" />
        Paste Link
      </button>
    </div>
  </div>
</template>
