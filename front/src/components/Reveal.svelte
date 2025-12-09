<script>
  export let value = "";
  let show = false;
</script>

<div class="flex items-center gap-2">
  <input 
    class="font-mono border rounded px-2 py-1"
    type={show ? "text" : "password"}
    value={value}
    readonly
  />
  <button
    class="px-2 py-1 bg-gray-700 text-white rounded hover:opacity-80"
    on:click={() => (show = !show)}
  >
    {show ? "Masquer" : "Afficher"}
  </button>
</div>
