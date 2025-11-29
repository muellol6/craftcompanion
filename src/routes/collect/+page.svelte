<script>
    import { onMount } from "svelte";

    let materials = [];

    onMount(async () => {
        const res = await fetch("/api/collect");
        materials = await res.json();
    });

    function downloadJSON() {
        const data = JSON.stringify(materials, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "materials.json";
        a.click();

        URL.revokeObjectURL(url);
    }
</script>

<div class="bg">
    <div class="wrapper">
        <h1>Materials to Collect</h1>

        {#each materials as mat}
            <div class="entry">
                <span class="name">{mat.name}</span>
                <span class="amount">{mat.amount}</span>
            </div>
        {/each}

        <button class="download-btn" on:click={downloadJSON}>
            Download JSON
        </button>
    </div>
</div>

<style>
    .bg {
        width: 100%;
        min-height: 100vh;
        background-image: url('/src/lib/assets/Blossom.png');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 3rem;
    }

    .wrapper {
        background: #ffffff0c;
        backdrop-filter: blur(15px);
        border: 1px solid #ffffff30;
        padding: 2.5rem 3rem;
        border-radius: 20px;
        width: 450px;
        color: white;
        text-align: center;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        font-family: Minecraft, sans-serif;
    }

    .entry {
        display: flex;
        justify-content: space-between;
        padding: 0.7rem 0;
        border-bottom: 1px solid #ffffff25;
        font-size: 1.25rem;
        font-family: Minecraft, sans-serif;
    }

    .entry:last-child {
        border-bottom: none;
    }

    .name {
        opacity: 0.9;
    }

    .amount {
        font-weight: bold;
    }

    .download-btn {
        margin-top: 2rem;
        padding: 0.8rem 1.3rem;
        background: #4da3ff;
        border: none;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        transition: 0.15s;
        width: 100%;
        font-family: Minecraft, sans-serif;
    }

    .download-btn:hover {
        background: #6bb6ff;
    }
</style>
