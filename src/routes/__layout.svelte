<script lang="ts">
  import Modal from '../components/Modal.svelte';
  import Popup from '../components/Popup.svelte';
  import Info from '../components/Info.svelte';
  import { show } from '../store';
  import '../app.css';
</script>

<div class="relative z-0 w-full h-full">
  <Modal show={$show} exit={() => ($show = !$show)} />
  <Popup _show={$show} />
  <Info />
  <slot />
</div>
