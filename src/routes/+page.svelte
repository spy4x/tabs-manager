<script lang="ts">
  import LinkCreate from '../link-create.svelte';
  import LinkList from '../link-list.svelte';

  export let data;
</script>

<div class="flex gap-12">
  <LinkCreate />
  <LinkList links={data.links} />
</div>
