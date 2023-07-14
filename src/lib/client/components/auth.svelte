<script lang="ts">
  import { authStore } from '@stores';

  export let mode: 'sign-in' | 'sign-up' = 'sign-in';

  let email = '';
  let password = '';

  function submit() {
    if (mode === 'sign-in') {
      authStore.signIn(email, password);
    } else {
      authStore.signUp(email, password);
    }
  }
</script>

<div class="mx-auto flex max-w-xs flex-col gap-3">
  <h1 class="text-2xl font-bold">{mode === 'sign-in' ? 'Sign in' : 'Sign up'}</h1>
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
    class="input-bordered input max-w-xs"
  />
  {#if $authStore.error?.email}
    <div class="text-red-500">{$authStore.error.email._errors}</div>
  {/if}
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    class="input-bordered input max-w-xs"
  />
  {#if $authStore.error?.password}
    <div class="text-red-500">{$authStore.error.password._errors}</div>
  {/if}
  <button on:click={submit} type="button" class="btn-primary btn"> Submit </button>

  {#if $authStore.error?._errors}
    <div class="text-red-500">{$authStore.error?._errors}</div>
  {/if}
</div>
