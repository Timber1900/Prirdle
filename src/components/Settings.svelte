<script lang="ts">
  import { fly } from 'svelte/transition';
  import { showSettings } from '../store';
  import CloseIcon from './CloseIcon.svelte';
  import SettingsIcon from './SettingsIcon.svelte';
  import SettingsItem from './SettingsItem.svelte';
</script>

<div
  in:fly={{ y: 50 }}
  out:fly={{ y: 50 }}
  class="absolute inset-0 bg-[#121213] text-white z-20"
>
  <div
    class="absolute inset-0 mx-auto max-w-[500px] w-full flex flex-col justify-start items-center gap-2"
  >
    <span
      class="w-full relative flex items-center justify-center text-xl font-semibold uppercase py-1"
    >
      <h1>Settings</h1>
      <span
        class="absolute aspect-square right-2 my-auto"
        on:click={() => ($showSettings = false)}
      >
        <CloseIcon height={24} width={24} />
      </span>
    </span>
    <span
      class="w-full h-full flex flex-col justify-start items-center divide-y divide-[#3a3a3c]"
    >
      <SettingsItem changeFunc={() => {}}>
        <p slot="title">Expert Mode</p>
        <p slot="description">
          Every time a non prime number is inserted a line is removed, after 5
          strikes.
        </p>
      </SettingsItem>
      <SettingsItem changeFunc={() => {}}>
        <p slot="title">Dark Theme</p>
        <p slot="description">Toggle on and off the dark theme.</p>
      </SettingsItem>
    </span>
  </div>
</div>
