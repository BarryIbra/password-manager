<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let username = "";
  let password = "";
  let message = "";

  async function login() {
    const res = await window.api.login({ username, password });
    if (res.success) dispatch("login", res.user);
    else message = res.error;
  }

  async function register() {
    const res = await window.api.register({ username, password });
    message = res.success ? "Inscription réussie" : res.error;
  }
</script>

<div class="bg-white p-8 rounded-2xl shadow border border-gray-200 max-w-md mx-auto">
  <h2 class="text-2xl font-bold text-gray-700 mb-6 text-center">
    Gestionnaire de mots de passe
  </h2>

  <div class="flex flex-col gap-4">
    <input
      class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      bind:value={username}
      placeholder="Nom d'utilisateur"
    />

    <input
      type="password"
      class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      bind:value={password}
      placeholder="Mot de passe"
    />
  </div>

  <div class="flex gap-4 mt-6">
    <button
      class="flex-1 bg-primary text-white py-3 rounded-lg shadow hover:opacity-90 transition"
      on:click={login}
    >
      Se connecter
    </button>

    <button
      class="flex-1 bg-accent text-white py-3 rounded-lg shadow hover:opacity-90 transition"
      on:click={register}
    >
      S'inscrire
    </button>
  </div>

  {#if message}
    <p class="mt-4 text-center text-red-500 font-medium">{message}</p>
  {/if}
</div>
