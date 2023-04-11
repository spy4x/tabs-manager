<script lang="ts">
  import { linkStore } from '@stores';
  $: tags = linkStore.tags.data;
</script>

<div>
  <div class="max-w-xs">
    <ul class="flex flex-col gap-5">
      {#each $tags as tag (tag.id)}
        <li>
          <div class="flex items-center gap-3">
            <!-- #region Circle Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={tag.color}
              stroke={tag.color}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-circle"><circle cx="12" cy="12" r="10" /></svg
            >
            <!-- #endregion -->
            <div>
              <p class="text-2xl">{tag.title}</p>
              <p class="text-slate-500">{tag.amount} links</p>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
