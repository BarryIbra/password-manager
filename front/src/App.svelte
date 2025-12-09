<script>
  import Login from "./components/Login.svelte";
  import PasswordList from "./components/PasswordList.svelte";
  import PasswordForm from "./components/PasswordForm.svelte";

  let user = null;
  let passwords = [];

  window.api.receivePasswords((data) => {
    passwords = data;
  });

  function onLogin(u) {
    user = u;
    window.api.getPasswords();
  }
</script>

<main class="min-h-screen bg-soft p-10">
  <div class="max-w-4xl mx-auto space-y-8">
    {#if !user}
      <Login on:login={event => onLogin(event.detail)} />
    {:else}
      <h1 class="text-4xl font-bold text-primary text-center">
        Bonjour {user.username} 👋
      </h1>

      <PasswordForm />

      <PasswordList {passwords} />
    {/if}
  </div>
</main>

<style>
  /* Couleurs et styles globaux si besoin */
</style>
