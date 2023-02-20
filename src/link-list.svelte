<script lang="ts">
  import type { Link } from '@prisma/client';

  export let links: Link[];
</script>

<div>
  <h1 class="mt-4 mb-2 text-3xl font-bold">Links:</h1>

  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>URL</th>
          <th>Priority</th>
          <th>Favorite</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        {#each links as link (link.id)}
          <tr>
            <td>{link.url}</td>
            <td>{link.priority}</td>
            <td>{link.isFavorite}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
