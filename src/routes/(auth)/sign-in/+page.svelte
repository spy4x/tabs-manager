<script lang="ts">
  import { authStore } from '$lib/client';

  let email = '';
  let password = '';
</script>

<h1>Sign-in</h1>

<input type="email" bind:value={email} placeholder="Email" class="input input-bordered max-w-xs" />
<input
  type="password"
  bind:value={password}
  placeholder="Password"
  class="input input-bordered max-w-xs"
/>
<button on:click={() => authStore.signIn(email, password)} type="button" class="btn btn-primary"
  >Sign-in</button
>
