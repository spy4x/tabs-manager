<script lang="ts">
  import { authStore } from '$lib/client';

  let email = '';
  let password = '';
</script>

<h1>Sign-up</h1>

<input type="email" bind:value={email} placeholder="Email" class="input input-bordered max-w-xs" />
<input
  type="password"
  bind:value={password}
  placeholder="Password"
  class="input input-bordered max-w-xs"
/>
<button on:click={() => authStore.signUp(email, password)} type="button" class="btn btn-primary"
  >Sign-up</button
>
