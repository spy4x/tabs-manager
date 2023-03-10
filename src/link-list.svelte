<script lang="ts">
  import { linkStore } from '$lib/client';
</script>

<div>
  <h1 class="mt-4 mb-2 text-3xl font-bold">Links:</h1>

  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>URL</th>
          <th>Title</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Favorite</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        {#each $linkStore.links as link (link.id)}
          <tr>
            <td>{link.url}</td>
            <td>{link.title}</td>
            <td>{link.description}</td>
            <td>{link.priority}</td>
            <td>{link.isFavorite}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
