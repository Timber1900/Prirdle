<script lang="ts">
  export let show: boolean;
  export let exit: () => void;
</script>

<div
  on:click={exit}
  class={`absolute z-10 bg-black  w-screen h-screen transition-all ${
    show
      ? 'visible pointer-events-auto opacity-40'
      : 'invisible pointer-events-none opacity-0'
  }`}
/>
