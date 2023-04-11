<script>
  import { authStore } from '@stores';
  import '../app.css';
  import { page } from '$app/stores';

  const menu = [
    {
      title: 'Links',
      href: '/',
    },
    {
      title: 'Tags',
      href: '/tags',
    },
  ];
</script>

<div class="navbar mb-8 bg-base-100">
  <div class="container mx-auto">
    <div class="flex flex-1 gap-3">
      {#each menu as item}
        <a
          href={item.href}
          class="btn-ghost btn text-xl normal-case"
          class:bg-gray-700={$page.url.pathname === item.href}>{item.title}</a
        >
      {/each}
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        {#if $authStore.userId}
          <li>
            <img src="/img/user.svg" class="h-16" alt="User avatar" />
          </li>
          <li><button on:click={authStore.signOut}>Sign out</button></li>
        {:else}
          <li><a href="/sign-in">Sign in</a></li>
          <li><a href="/sign-up">Sign up</a></li>
        {/if}
      </ul>
    </div>
  </div>
</div>

<div class="container mx-auto">
  <slot />
</div>
