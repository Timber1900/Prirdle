<script lang="ts">
  import { infos } from '../store';
  import { scale } from 'svelte/transition';
</script>

<div class="absolute inset-0 h-full mx-auto pointer-events-none pt-20 z-20">
  {#each $infos as info}
    <div
      in:scale
      out:scale
      class="text-black text-10xl font-bold mx-auto my-2 min-w-[8rem] w-max h-12 p-4 bg-white rounded-md flex items-center justify-center"
    >
      {info}
    </div>
  {/each}
</div>
