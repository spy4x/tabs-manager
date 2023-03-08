<script lang="ts">
  import { authStore } from '$lib/client';
  import { onMount } from 'svelte';

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
  onMount(() => {
    authStore.reset();
  });
</script>

<div class="flex flex-col max-w-xs gap-3 mx-auto">
  <h1 class="text-2xl font-bold">{mode === 'sign-in' ? 'Sign in' : 'Sign up'}</h1>
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
    class="input input-bordered max-w-xs"
  />
  {#if $authStore.error?.email}
    <div class="text-red-500">{$authStore.error.email._errors}</div>
  {/if}
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    class="input input-bordered max-w-xs"
  />
  {#if $authStore.error?.password}
    <div class="text-red-500">{$authStore.error.password._errors}</div>
  {/if}
  <button on:click={submit} type="button" class="btn btn-primary"> Submit </button>

  {#if $authStore.error?._errors}
    <div class="text-red-500">{$authStore.error?._errors}</div>
  {/if}
</div>
