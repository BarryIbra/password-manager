<script>
  import Reveal from "./Reveal.svelte";
  export let passwords = [];

  function del(id) {
    window.api.deletePassword(id);
  }
</script>

<div class="bg-white p-6 rounded-2xl shadow border border-gray-200">
  <h3 class="text-xl font-semibold mb-4">Vos mots de passe</h3>

  <table class="w-full text-left">
    <thead>
      <tr class="border-b border-gray-300">
        <th class="pb-2">Service</th>
        <th class="pb-2">Identifiant</th>
        <th class="pb-2">Mot de passe</th>
        <th class="pb-2">Actions</th>
      </tr>
    </thead>

    <tbody>
      {#each passwords as p (p.id)}
        <tr class="border-b border-gray-200">
          <td class="py-2">{p.name}</td>
          <td>{p.username}</td>
          <td>
            <Reveal value={p.password} />
          </td>
          <td>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-lg hover:opacity-80"
              on:click={() => del(p.id)}
            >
              Supprimer
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
