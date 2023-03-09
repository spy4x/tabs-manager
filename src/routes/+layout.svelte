<script>
  import { authStore } from '$lib/client';
  import '../app.css';
</script>

<div class="navbar bg-base-100 mb-8">
  <div class="container mx-auto">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">Tabs manager</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        {#if $authStore.userId}
          <li>
            <img src="/img/user.svg" class="h-16" alt="User avatar" />
          </li>
          <li><a on:click={authStore.signOut} href="javascript:;">Sign out</a></li>
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
