<script>
  import '../app.css';
</script>

<div class="navbar bg-base-100 mb-8">
  <div class="container mx-auto">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">Tabs manager</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/sign-in">Sign in</a></li>
        <li><a href="/sign-up">Sign up</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="container mx-auto">
  <slot />
</div>
