<script lang="ts">
  import { linkStore } from '@stores';
  import type { TagAddCommand } from '@models';

  const initialValue: TagAddCommand = {
    title: '',
    color: '#FF0000',
  };

  let tagAddCommand: TagAddCommand = { ...initialValue };

  function createtag() {
    linkStore.tags.add(tagAddCommand);
    tagAddCommand = { ...initialValue };
  }
</script>

<form on:submit|preventDefault={createtag} class="flex flex-col gap-3">
  <div class="flex w-full max-w-xs gap-2">
    <input
      bind:value={tagAddCommand.title}
      type="text"
      placeholder="Title"
      class="input-bordered input w-full max-w-xs grow"
    />
    <input bind:value={tagAddCommand.color} type="color" class="input-bordered input w-14 p-1" />
  </div>
  <button class="btn-primary btn max-w-xs {$linkStore.tag.isAdding ? 'loading' : ''}">Add</button>
  {#if $linkStore.tag.addError}
    <div class="text-red-500">{$linkStore.tag.addError}</div>
  {/if}
</form>
