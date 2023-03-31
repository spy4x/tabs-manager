<script lang="ts">
  import { linkStore } from '$lib/client';
  import { LinkPriority } from '@prisma/client';

  function getCssClassColor(priority: LinkPriority): string {
    switch (priority) {
      case LinkPriority.LOW:
        return 'text-green-500';
      case LinkPriority.MEDIUM:
        return 'text-yellow-500';
      case LinkPriority.HIGH:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }
</script>

<div>
  <h1 class="mt-4 mb-2 text-3xl font-bold">Links:</h1>

  <div class="max-w-xs">
    <ul class="flex flex-col gap-5">
      {#each $linkStore.links as link (link.id)}
        <li>
          <a href={link.url} target="_blank" rel="noreferrer">{link.title || link.url}</a>

          <div class="flex justify-between mt-2">
            <!-- #region Priority Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-flag {getCssClassColor(link.priority)}"
              ><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line
                x1="4"
                y1="22"
                x2="4"
                y2="15"
              /></svg
            >
            <!-- #endregion -->

            <!-- #region Favorite Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={link.isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-star {link.isFavorite ? 'text-yellow-500' : 'text-gray-500'}"
              ><polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              /></svg
            >
            <!-- #endregion -->
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
