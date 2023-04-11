<script lang="ts">
  import { linkStore } from '@stores';
  import type { LinkAddCommand } from '@models';

  const initialValue: LinkAddCommand = {
    url: '',
    priority: 0,
    isFavorite: false,
    tagIds: [],
  };

  const priorities = [
    { value: 2, label: 'High' },
    { value: 1, label: 'Medium' },
    { value: 0, label: 'Low' },
  ];

  let linkAddCommand: LinkAddCommand = { ...initialValue };

  function createLink() {
    linkStore.link.add(linkAddCommand);
    linkAddCommand = { ...initialValue };
  }

  $: tags = linkStore.tags.data;
</script>

<form on:submit|preventDefault={createLink} class="flex flex-col gap-3">
  <div class="form-control w-full max-w-xs">
    <input
      bind:value={linkAddCommand.url}
      type="text"
      placeholder="URL"
      class="input-bordered input w-full max-w-xs"
    />
  </div>
  <div class="form-control w-full max-w-xs">
    <select bind:value={linkAddCommand.priority} class="select-bordered select w-full max-w-xs">
      {#each priorities as priority}
        <option value={priority.value}>{priority.label}</option>
      {/each}
    </select>
  </div>
  <!-- Tags select with multiple selection -->
  <div class="form-control w-full max-w-xs">
    <select
      bind:value={linkAddCommand.tagIds}
      class="select-bordered select w-full max-w-xs"
      multiple
    >
      {#each $tags as tag (tag.id)}
        <option value={tag.id} style="color: {tag.color};">{tag.title}</option>
      {/each}
    </select>
  </div>
  <div class="form-control max-w-xs">
    <label class="label cursor-pointer justify-start gap-3">
      <input bind:checked={linkAddCommand.isFavorite} type="checkbox" class="checkbox" />
      <span class="label-text">Is favorite?</span>
    </label>
  </div>
  <button class="btn-primary btn max-w-xs {$linkStore.link.isAdding ? 'loading' : ''}">Add</button>
  {#if $linkStore.link.addError}
    <div class="text-red-500">{$linkStore.link.addError}</div>
  {/if}
</form>
