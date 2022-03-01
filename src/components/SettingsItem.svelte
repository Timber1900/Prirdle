<script lang="ts">
  import Switch from 'svelte-switch';
  export let changeFunc: () => void;
  export let checked: boolean;
</script>

<span
  class="w-full h-max py-4 flex flex-row items-center justify-center px-4 gap-2"
>
  <div class="grow flex flex-col justify-center items-start">
    <span class="text-lg font-semibold">
      <slot name="title" />
    </span>
    <span class="text-sm text-[#818384]">
      <slot name="description" />
    </span>
  </div>
  <Switch
    width={32}
    height={20}
    offColor="#565758"
    onColor="#538d4e"
    handleDiameter={16}
    on:change={changeFunc}
    {checked}
  >
    <div slot="unCheckedIcon" />
    <div slot="checkedIcon" />
  </Switch>
</span>
