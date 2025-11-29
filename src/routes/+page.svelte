<script>
  import { onMount } from "svelte";

  let search = "";
  let amount = "1";  // ← Standardwert wieder 1
  let items = [];
  let suggestions = [];
  let message = "";

  onMount(async () => {
    const res = await fetch("/api/itemavailable");
    items = await res.json();
  });

  // Vorschläge aktualisieren
  $: {
    if (search.trim().length === 0) {
      suggestions = [];
    } else {
      suggestions = items
        .filter((item) =>
          item.name.toLowerCase().startsWith(search.toLowerCase())
        )
        .slice(0, 6);

      if (suggestions.length === 1 && suggestions[0].name === search) {
        suggestions = [];
      }
    }
  }

  function chooseSuggestion(name) {
    search = name;
    suggestions = [];
  }

  // Amount validieren (keine Kommas, keine negativen Werte)
  function validateAmount(e) {
    let val = parseInt(e.target.value);

    if (isNaN(val) || val < 1) {
      amount = "1"; // ← niemals leer, immer 1 fallback
    } else {
      amount = Math.floor(val);
    }
  }

  async function addItem() {
    if (!amount || amount < 1) {
      message = "Please enter a positive whole number!";
      setTimeout(() => (message = ""), 2000);
      return;
    }

    if (search.trim().length === 0) return;

    const res = await fetch("/api/itemlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: search,
        amount: amount
      })
    });

    if (res.ok) {
      message = `${search} added!`;
      search = "";
      amount = "1"; // reset back to 1
      suggestions = [];
      setTimeout(() => (message = ""), 2000);
    } else {
      const err = await res.json();
      message = err.error || "Error!";
      setTimeout(() => (message = ""), 2000);
    }
  }
</script>

<!-- BACKGROUND WRAPPER -->
<div class="finder-bg">

  <div class="finder-wrapper">
    <div class="finder-card">

      <h1 class="title">Craft Companion</h1>

      <p class="subtitle">
        Search craftable Redstone or Food items<br />
        and add them to your list
      </p>

      <!-- SEARCH -->
      <div class="search-container">
        <input type="text" placeholder="Search item..." bind:value={search} />
        <button class="add-btn" on:click={addItem}>+</button>
      </div>

      {#if suggestions.length > 0}
        <div class="suggestions">
          {#each suggestions as s}
            <div class="suggestion" on:click={() => chooseSuggestion(s.name)}>
              {s.name}
            </div>
          {/each}
        </div>
      {/if}

      <div class="amount-box">
        <input
          type="number"
          min="1"
          step="1"
          bind:value={amount}
          on:input={validateAmount}
        />
      </div>

      {#if message}
        <p class="msg">{message}</p>
      {/if}

    </div>
  </div>

</div>

<style>

  /* Hintergrund */
  .finder-bg {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-image: url('/src/lib/assets/Field.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .finder-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }

  .finder-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 4rem;
    position: relative;
    z-index: 2;
  }

  .finder-card {
    width: 650px;
    background: #ffffff08;
    backdrop-filter: blur(18px);
    border: 1px solid #ffffff20;
    padding: 2.5rem;
    border-radius: 20px;
    color: white;
    text-align: center;
  }

  .title {
    font-size: 2.6rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    opacity: 0.9;
    line-height: 1.4;
    margin-bottom: 2rem;
    font-size: 1.2rem;
  }

  .search-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  input[type="text"] {
    flex: 1;
    padding: 0.9rem 1.2rem;
    background: #ffffff15;
    border: 1px solid #ffffff30;
    border-radius: 10px;
    color: white;
    font-size: 1rem;
  }

  .add-btn {
    background: #4da3ff;
    border: none;
    width: 48px;
    border-radius: 10px;
    font-size: 1.6rem;
    cursor: pointer;
  }

  .suggestions {
    margin-top: 0.3rem;
    background: #ffffff10;
    border: 1px solid #ffffff25;
    border-radius: 12px;
    padding: 0.4rem;
    backdrop-filter: blur(12px);
    text-align: left;
  }

  .suggestion {
    padding: 0.7rem 1rem;
    cursor: pointer;
    border-radius: 8px;
  }

  .suggestion:hover {
    background: #ffffff20;
  }

  .amount-box {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  .amount-box input {
    width: 120px;
    padding: 0.6rem;
    border-radius: 10px;
    background: #ffffff10;
    border: 1px solid #ffffff20;
    text-align: center;
    color: white;
    font-size: 1.1rem;
  }

  .msg {
    margin-top: 1rem;
    opacity: 0.9;
  }
</style>
