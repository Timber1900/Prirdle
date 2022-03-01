<script lang="ts">
  import { show, showSettings } from '../store';
  import SettingsIcon from './SettingsIcon.svelte';
  import StatsIcon from './StatsIcon.svelte';
</script>

<header
  class="relative h-14 w-full flex items-center justify-center font-sans text-3xl font-semibold border-b border-[#3a3a3c]"
>
  <p class="mx-auto">Prirdle</p>
  <span class="absolute inset-y-auto right-2 text-white flex flex-row gap-2">
    <span on:click={() => ($show = !$show)}>
      <StatsIcon height={24} width={24} />
    </span>
    <span on:click={() => ($showSettings = !$showSettings)}>
      <SettingsIcon height={24} width={24} />
    </span>
  </span>
</header>
