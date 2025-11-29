<script>
    import { onMount } from "svelte";
    import ItemDetail from "$lib/components/ItemDetail.svelte";

    let allItems = [];
    let leftPage = [];
    let rightPage = [];
    let extraCount = 0;

    const MAX_LEFT = 5;
    const MAX_RIGHT = 4;

    // Detail popup
    let selectedItem = null;
    let showDetails = false;

    onMount(async () => {
        const res = await fetch("/api/itemlist");
        const items = await res.json();
        allItems = items;
        splitPages();
    });

    function splitPages() {
        leftPage = allItems.slice(0, MAX_LEFT);
        rightPage = allItems.slice(MAX_LEFT, MAX_LEFT + MAX_RIGHT);

        const remaining = allItems.slice(MAX_LEFT + MAX_RIGHT);
        extraCount = remaining.length;
    }

    async function removeItem(id) {
        await fetch("/api/itemlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        allItems = allItems.filter(item => item._id !== id);
        splitPages();
    }

    // NEU – lädt vollständige crafting details korrekt über neue API
    async function openDetails(item) {
        selectedItem = { ...item };

        const res = await fetch(`/api/itemavailable/detail?name=${encodeURIComponent(item.name)}`);
        const full = await res.json();

        selectedItem = { ...selectedItem, ...full };
        showDetails = true;
    }

    function closeDetails() {
        selectedItem = null;
        showDetails = false;
    }
</script>

<!-- BACKGROUND -->
<div class="bg">

    <!-- BOOK -->
    <div class="book-container">

        <!-- LEFT PAGE -->
        <div class="page left">
            {#each leftPage as item}
                <div class="entry" on:click={() => openDetails(item)}>
                    <span>{item.amount}× {item.name}</span>
                    <button
                        class="remove"
                        on:click={(e) => { e.stopPropagation(); removeItem(item._id); }}>
                        –
                    </button>
                </div>
            {/each}
        </div>

        <!-- RIGHT PAGE -->
        <div class="page right">
            {#each rightPage as item}
                <div class="entry" on:click={() => openDetails(item)}>
                    <span>{item.amount}× {item.name}</span>
                    <button
                        class="remove"
                        on:click={(e) => { e.stopPropagation(); removeItem(item._id); }}>
                        –
                    </button>
                </div>
            {/each}

            {#if extraCount > 0}
                <p class="extra">…und {extraCount} weitere</p>
            {/if}
        </div>

    </div>
</div>

<!-- Detail Popup -->
<ItemDetail
    item={selectedItem}
    visible={showDetails}
    close={closeDetails}
/>

<style>
.bg {
    width: 100%;
    height: 100vh;
    background-image: url('/src/lib/assets/Wheat.png');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Minecraft', sans-serif;
}

.book-container {
    width: 1100px;
    height: 650px;
    background: #d6c39a;
    border: 12px solid #3a260f;
    box-shadow: 0 0 40px rgba(0,0,0,0.35);
    border-radius: 8px;
    position: relative;
    display: flex;
}

.book-container::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 3px;
    background: rgba(50, 30, 10, 0.55);
    border-left: 2px solid rgba(20, 10, 5, 0.8);
    border-right: 2px solid rgba(80, 60, 40, 0.5);
    transform: translateX(-50%);
}

.page {
    width: 50%;
    padding: 60px;
    box-sizing: border-box;
    font-size: 1.6rem;
    color: #2b2b2b;
}

.entry {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    margin-bottom: 1rem;
    align-items: center;
    cursor: pointer;
}

.remove {
    background: #ff4d4d;
    border: none;
    color: white;
    font-size: 1.3rem;
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.15s;
}

.remove:hover {
    background: #ff6b6b;
}

.extra {
    margin-top: 1.2rem;
    opacity: 0.8;
    font-style: italic;
}

@font-face {
    font-family: "Minecraft";
    src: url("/src/lib/fonts/Minecraftia.ttf") format("truetype");
}
</style>
