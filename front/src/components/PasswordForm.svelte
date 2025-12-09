<script>
  let id = null;
  let name = "";
  let username = "";
  let password = "";

  function submit() {
    if (id)
      window.api.updatePassword({ id, name, username, password });
    else
      window.api.addPassword({ name, username, password });

    id = null;
    name = "";
    username = "";
    password = "";
  }
</script>

<div class="bg-white p-6 rounded-2xl shadow border border-gray-200 max-w-4xl mx-auto mb-6">
  <h3 class="text-xl font-semibold text-gray-700 mb-4">Ajouter / Modifier un mot de passe</h3>

  <div class="grid grid-cols-3 gap-4 mb-4">
    <input
      class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      bind:value={name}
      placeholder="Nom du service"
    />

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

  <button
    class="bg-primary text-white px-5 py-2 rounded-2xl shadow hover:opacity-90 transition"
    on:click={submit}
  >
    Valider
  </button>
</div>
