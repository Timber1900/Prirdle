<script lang="ts">
  export let show: boolean;
</script>

{#key show}
  <div
    class={`w-[500px] h-[450px] bg-[#121213] rounded-md absolute inset-0 m-auto z-20  origin-bottom transition-all animate-fly ${
      show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}
  >
    Test
  </div>
{/key}
