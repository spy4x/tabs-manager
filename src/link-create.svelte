<script lang="ts">
  import { linkStore } from '$lib/client';
  import type { LinkAddCommand } from '@models/link';

  const initialValue: LinkAddCommand = {
    url: '',
    priority: 'MEDIUM',
    isFavorite: false,
  };

  let linkAddCommand: LinkAddCommand = { ...initialValue };

  function createLink() {
    linkStore.add(linkAddCommand);
    linkAddCommand = { ...initialValue };
  }
</script>

<form on:submit|preventDefault={createLink} class="flex flex-col gap-3">
  <h1 class="mt-4 mb-2 text-3xl font-bold">Add your link:</h1>
  <div class="form-control w-full max-w-xs">
    <input
      bind:value={linkAddCommand.url}
      type="text"
      placeholder="URL"
      class="input input-bordered w-full max-w-xs"
    />
  </div>
  <div class="form-control w-full max-w-xs">
    <select bind:value={linkAddCommand.priority} class="select select-bordered w-full max-w-xs">
      <option value="HIGH">High</option>
      <option value="MEDIUM" selected>Medium</option>
      <option value="LOW">Low</option>
    </select>
  </div>
  <div class="form-control max-w-xs">
    <label class="label cursor-pointer justify-start gap-3">
      <input bind:checked={linkAddCommand.isFavorite} type="checkbox" class="checkbox" />
      <span class="label-text">Is favorite?</span>
    </label>
  </div>
  <button class="btn btn-primary max-w-xs {$linkStore.isAdding ? 'loading' : ''}">Add</button>
  {#if $linkStore.addError}
    <div class="text-red-500">{$linkStore.addError}</div>
  {/if}
</form>
