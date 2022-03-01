<script lang="ts">
  import Backspace from './Backspace.svelte';

  export let addToGuess: (n: number) => void;
  export let submitGuess: () => void;
  export let keypadColors: number[];
  export let deleteFunc: () => void;
  let keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<footer class="mb-2">
  <div
    class="grid grid-cols-3 grid-rows-3 gap-2 small:w-[145px] w-[calc(30vw+16px)] mx-auto"
  >
    {#each keypad as digit, i}
      <div
        on:click={() => {
          addToGuess(digit);
        }}
        class="keyboardNumber"
        data-color={keypadColors[i + 1]}
      >
        {digit}
      </div>
    {/each}
  </div>
  <div class="flex flex-row gap-2 mt-2">
    <div on:click={submitGuess} class="keyboardKey">Enter</div>
    <div
      on:click={() => {
        addToGuess(0);
      }}
      class="keyboardNumber"
      data-color={keypadColors[0]}
    >
      0
    </div>
    <div on:click={deleteFunc} class="keyboardKey">
      <Backspace width={24} height={24} />
    </div>
  </div>
</footer>

<style type="text/postcss">
  .keyboardNumber {
    @apply small:w-[43px] small:h-[58px] aspect-[43/58] w-[10vw] rounded small:text-xl text-base font-semibold flex items-center justify-center;
  }
  .keyboardNumber[data-color='0'] {
    @apply bg-[#538d4e];
  }
  .keyboardNumber[data-color='1'] {
    @apply bg-[#B59F3B];
  }
  .keyboardNumber[data-color='2'] {
    @apply bg-[#818384];
  }
  .keyboardNumber[data-color='3'] {
    @apply bg-[#3a3a3c];
  }
  .keyboardKey {
    @apply small:w-[100px] small:h-[58px] aspect-[100/58] w-[20vw] rounded small:text-xl text-base font-semibold flex items-center justify-center bg-[#818384];
  }
</style>
