<template>
  <div class="relative inline-block text-left" ref="rootEl">
    <button
      type="button"
      class="inline-flex items-center gap-1 border rounded px-2 py-1 text-sm hover:bg-[color:var(--card)]
             focus:outline-none focus:ring-2 focus:ring-offset-2"
      @click="toggleOpen"
      :aria-expanded="isOpen.toString()"
      aria-haspopup="menu"
    >
      <span>{{ label }}</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-56 rounded-md border bg-[color:var(--card)] shadow-lg z-10"
      role="menu"
      aria-orientation="vertical"
      tabindex="-1"
    >
      <div class="p-2 max-h-72 overflow-auto">
        <div class="flex items-center justify-left gap-4 mb-2">
          <button type="button" class="text-xs underline" @click="selectAll">Select all</button>
          <button type="button" class="text-xs underline" @click="clearAll">Clear</button>
        </div>

        <label
          v-for="opt in options"
          :key="opt.value"
          class="flex items-center gap-2 py-1 cursor-pointer text-sm"
        >
          <input
            type="checkbox"
            class="accent-current"
            :value="opt.value"
            :checked="localSelected.has(opt.value)"
            @change="onToggle(opt.value, $event)"
          />
          <span class="truncate">{{ opt.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

type Option = { value: string; label: string };

const props = defineProps<{
  options: Option[];
  modelValue: string[];
  label?: string;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>();

const isOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const localSelected = ref<Set<string>>(new Set(props.modelValue));

watch(
  () => props.modelValue,
  v => { localSelected.value = new Set(v); }
);

const toggleOpen = () => { isOpen.value = !isOpen.value; };

const onDocClick = (e: MouseEvent) => {
  if (!rootEl.value) return;
  if (!rootEl.value.contains(e.target as Node)) isOpen.value = false;
};

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

const update = () => emit('update:modelValue', Array.from(localSelected.value));

const onToggle = (val: string, ev: Event) => {
  const checked = (ev.target as HTMLInputElement).checked;
  if (checked) localSelected.value.add(val);
  else localSelected.value.delete(val);
  update();
};

const selectAll = () => {
  localSelected.value = new Set(props.options.map(o => o.value));
  update();
};
const clearAll = () => {
  localSelected.value = new Set();
  update();
};
</script>

<style scoped>
/* inherits project tokens */
</style>
