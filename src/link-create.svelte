<script lang="ts">
  const socket = new WebSocket('ws://localhost:8080');

  let url = '';
  let priority = '';
  let isFavorite = false;

  function createLink() {
    const link = {
      url,
      priority,
      isFavorite,
    };
    socket.send(JSON.stringify(link));
    url = '';
    priority = '';
    isFavorite = false;
    location.reload();
  }
</script>

<form on:submit|preventDefault={createLink} class="flex flex-col gap-3">
  <h1 class="mt-4 mb-2 text-3xl font-bold">Add your link:</h1>
  <div class="form-control w-full max-w-xs">
    <input
      bind:value={url}
      type="text"
      placeholder="URL"
      class="input input-bordered w-full max-w-xs"
    />
  </div>
  <div class="form-control w-full max-w-xs">
    <select bind:value={priority} class="select select-bordered w-full max-w-xs">
      <option disabled selected>Priority</option>
      <option value="HIGH">High</option>
      <option value="MEDIUM">Medium</option>
      <option value="LOW">Low</option>
    </select>
  </div>
  <div class="form-control max-w-xs">
    <label class="label cursor-pointer justify-start gap-3">
      <input bind:checked={isFavorite} type="checkbox" class="checkbox" />
      <span class="label-text">Is favorite?</span>
    </label>
  </div>
  <button class="btn btn-primary max-w-xs">Add</button>
</form>
