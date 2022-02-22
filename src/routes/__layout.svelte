<script>
  import Modal from '../components/Modal.svelte';
  import Popup from '../components/Popup.svelte';
  import '../app.css';
  import { show } from '../store';

  const close = () => {
    $show = false;
  };
</script>

<div class="relative z-0">
  <Modal show={$show} exit={() => ($show = !$show)} />
  <Popup show={$show} />
  <div class={`${$show ? 'blur-[1px]' : 'blur-none'} transition-all`}>
    <slot />
  </div>
</div>
