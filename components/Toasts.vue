<script setup lang="ts">
const toasts = useToasts();
const { dismiss } = useToast();
const theme: Record<Toast["type"], string> = {
  info: "bg-gray-900 border-gray-500 text-white",
  success: "bg-green-900 border-green-500 text-white",
  warning: "bg-yellow-900 border-yellow-500 text-white",
  error: "bg-red-900 border-red-500 text-white",
};

// https://vercel.com/design/toast
</script>

<template>
  <client-only>
    <Teleport to="body">
      <div
        class="group fixed inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5 z-[99]"
      >
        <TransitionGroup name="toast" :duration="300">
          <div
            v-for="toast in toasts.filter((x) => x.visible)"
            :key="toast.uuid"
            :class="theme[toast.type]"
            role="alert"
            class="absolute bottom-0 right-0 backdrop-blur-md transition-all ease-in-circ duration-300 transform second-last:-translate-y-[25%] second-last:scale-95 third-last:-translate-y-[50%] third-last:scale-90 fourth-last:-translate-y-[75%] fourth-last:scale-[85%] group-hover:second-last:-translate-y-[115%] group-hover:third-last:-translate-y-[230%] group-hover:fourth-last:-translate-y-[345%] before:top-full before:-bottom-full before:right-0 before:left-0 before:absolute group-hover:scale-100 flex items-center p-4 w-full max-w-sm border text-sm rounded-lg"
          >
            <p>{{ toast.content }}</p>
            <div class="ms-auto">
              <button
                class="inline-flex flex-shrink-0 justify-center items-center p-1 rounded-md opacity-50 hover:opacity-100 hover:backdrop-brightness-95 focus:backdrop-brightness-95 focus:outline-none focus:opacity-100"
                @click="dismiss(toast.uuid)"
              >
                <span class="sr-only">Close</span>
                <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5" />
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </client-only>
</template>

<style scoped lang="postcss">
.group {
  /** deplier */
  &:hover {
    .toast-enter-from {
      &:nth-last-child(n + 3) {
        --tw-translate-y: -345%;
      }
      &:nth-last-child(-n + 2) {
        --tw-translate-y: 2.5rem /* 40px */ !important;
        --tw-scale-x: 1.1 !important;
        --tw-scale-y: 1.1 !important;
      }
      opacity: 0 !important;
    }

    .toast-leave-to {
      &:nth-last-child(n + 3) {
        --tw-translate-y: -230%;
      }

      &:nth-last-child(2) {
        --tw-translate-y: -115%;
      }

      opacity: 0 !important;
    }
  }

  /** fermer */
  &:not(:hover) {
    .toast-enter-from {
      &:nth-last-child(n + 3) {
        --tw-scale-x: 85% !important;
        --tw-scale-y: 85% !important;
        --tw-translate-y: -75% !important;
      }
      &:nth-last-child(-n + 12) {
        --tw-translate-y: 2.5rem /* 40px */ !important;
        --tw-scale-x: 1.1 !important;
        --tw-scale-y: 1.1 !important;
      }
      opacity: 0 !important;
    }

    .toast-leave-to {
      &:nth-last-child(n + 2) {
        --tw-scale-x: 85% !important;
        --tw-scale-y: 85% !important;
        --tw-translate-y: -75% !important;
      }
      &:nth-last-child(-n + 1) {
        --tw-translate-y: 2.5rem /* 40px */ !important;
        --tw-scale-x: 1.1 !important;
        --tw-scale-y: 1.1 !important;
      }

      opacity: 0 !important;
    }
  }
}
</style>
