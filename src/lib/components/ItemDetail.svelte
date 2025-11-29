<script>
    export let item = null;
    export let visible = false;
    export let close = () => {};
</script>

{#if visible && item}
<div class="overlay" on:click={close}>
    <div class="modal" on:click|stopPropagation>
        
        <!-- Close Button -->
        <button class="close-btn" on:click={close}>×</button>

        <!-- Title -->
        <h1>{item.name}</h1>

        <!-- Category -->
        <p class="category">
            <strong>Category:</strong> {item.category}
        </p>

        <!-- Crafting Requirements -->
        <h2>Crafting Requirements</h2>

        {#if item.ingredients}
            <div class="ingredients">
                {#each Object.entries(item.ingredients) as [ing, amt]}
                    <div class="ingredient">
                        <span>{ing}</span>
                        <span>x{amt}</span>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Output -->
        <h2>Output</h2>

        <p class="output-text">You receive: {item.output}</p>

    </div>
</div>
{/if}

<style>
/* Background overlay */
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
}

/* Modal window */
.modal {
    background: #1e1e1e;
    padding: 2.5rem;
    border-radius: 20px;
    width: 550px;
    text-align: center;
    color: white;
    font-family: "Minecraft", sans-serif;
    position: relative;
}

/* Close button */
.close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
}

/* Headings */
h1 {
    margin-top: 0.5rem;
    font-size: 2rem;
}

h2 {
    margin-top: 2rem;
    font-size: 1.5rem;
    text-decoration: underline;
}

/* Category */
.category {
    font-size: 1.3rem;
    margin-top: 0.5rem;
    opacity: 0.9;
}

/* Ingredients list */
.ingredients {
    margin-top: 1rem;
}

.ingredient {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
    border-bottom: 1px solid #444;
    font-size: 1.2rem;
}

.output-text {
    margin-top: 1rem;
    font-size: 1.2rem;
}
</style>
