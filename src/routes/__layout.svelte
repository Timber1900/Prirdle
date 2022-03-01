<script lang="ts">
  import Modal from '../components/Modal.svelte';
  import Popup from '../components/Popup.svelte';
  import Info from '../components/Info.svelte';
  import { expertMode, show, showSettings } from '../store';
  import '../app.css';
  import Settings from '../components/Settings.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    $expertMode = JSON.parse(localStorage.getItem('expert') ?? 'false');
  });
</script>

<svelte:head>
  <title>Prirdle</title>
  <meta
    name="description"
    content="Guess the prime number in 7 tries. A new puzzle is available each day."
  />

  <meta property="og:title" content="Prirdle" />
  <meta
    property="og:description"
    content="Guess the prime number in 7 tries. A new puzzle is available each day."
  />
  <meta
    property="og:image"
    content="https://www.prirdle.com/icon-512x512.png"
  />
  <meta property="og:url" content="https://www.prirdle.com" />
  <meta property="og:site_name" content="Prirdle" />

  <meta name="twitter:title" content="Prirdle" />
  <meta
    name="twitter:description"
    content="Guess the prime number in 6 tries. A new puzzle is available each day."
  />
  <meta
    name="twitter:image"
    content="https://www.prirdle.com/icon-512x512.png"
  />
  <meta name="twitter:creator" content="@timber1901" />
  <meta name="twitter:card" content="app" />
</svelte:head>

<div class="relative z-0 w-full h-full">
  <Modal show={$show} exit={() => ($show = !$show)} />
  <Popup _show={$show} />
  {#if $showSettings}
    <Settings />
  {/if}
  <Info />
  <slot />
</div>
