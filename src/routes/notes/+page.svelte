<script>
    import { onMount } from "svelte";

    let notes = [];
    let newNote = "";
    let editingId = null;
    let editText = "";

    // Load notes from MongoDB
    async function loadNotes() {
        const res = await fetch("/api/notes");
        notes = await res.json();
    }

    onMount(loadNotes);

    async function addNote() {
        if (!newNote.trim()) return;

        await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newNote })
        });

        newNote = "";
        await loadNotes();
    }

    async function deleteNote(id) {
        await fetch(`/api/notes/${id}`, {
            method: "DELETE"
        });
        await loadNotes();
    }

    function startEdit(note) {
        editingId = note._id;
        editText = note.text;
    }

    async function saveEdit() {
        await fetch(`/api/notes/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: editText })
        });

        editingId = null;
        editText = "";
        await loadNotes();
    }

    function cancelEdit() {
        editingId = null;
        editText = "";
    }
</script>

<div class="wrapper">
    <h1>Notes</h1>
    <p class="subtitle">
        This is your personal space. Feel free to add, edit or remove notes whenever you like.
    </p>

    <!-- New Note Input -->
    <div class="new-note">
        <textarea placeholder="Write your note..." bind:value={newNote}></textarea>
        <button on:click={addNote}>Add Note</button>
    </div>

    <!-- Existing Notes -->
    <div class="notes-list">
        {#each notes as note}
            {#if editingId === note._id}
                <div class="note editing">
                    <textarea bind:value={editText}></textarea>
                    <div class="buttons">
                        <button class="save" on:click={saveEdit}>Save</button>
                        <button class="cancel" on:click={cancelEdit}>Cancel</button>
                    </div>
                </div>
            {:else}
                <div class="note">
                    <p>{note.text}</p>
                    <div class="buttons">
                        <button class="edit" on:click={() => startEdit(note)}>Edit</button>
                        <button class="delete" on:click={() => deleteNote(note._id)}>Delete</button>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .wrapper {
        max-width: 650px;
        margin: 3rem auto;
        padding: 2.5rem;
        background: #ffffff10;
        border: 1px solid #ffffff20;
        border-radius: 18px;
        backdrop-filter: blur(14px);
        color: white;
        font-family: "Minecraftia";
        text-align: center;
    }

    h1 {
        font-size: 2.4rem;
        margin-bottom: 0.3rem;
    }

    .subtitle {
        margin-bottom: 1.8rem;
        opacity: 0.85;
        font-size: 1.05rem;
        line-height: 1.3;
    }

    /* New smaller input */
    .new-note textarea {
        width: 100%;
        height: 90px; /* Smaller */
        padding: 0.8rem;
        background: #ffffff12;
        border: 1px solid #ffffff30;
        border-radius: 10px;
        color: white;
        resize: none;
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    /* Smaller Add button */
    .new-note button {
        width: 180px; /* Not full width */
        padding: 0.7rem 0;
        background: #4da3ff;
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 1.1rem;
        cursor: pointer;
        margin: 0 auto 2rem auto;
        display: block;
    }

    .new-note button:hover {
        background: #6bb6ff;
    }

    .notes-list {
        margin-top: 1rem;
    }

    .note {
        background: #ffffff08;
        border: 1px solid #ffffff25;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        text-align: left;
    }

    .note p {
        margin-bottom: 0.8rem;
        white-space: pre-wrap;
    }

    textarea {
        width: 100%;
        height: 80px; /* Smaller edit field */
        padding: 0.8rem;
        background: #ffffff15;
        border: 1px solid #ffffff30;
        border-radius: 10px;
        color: white;
        resize: none;
        margin-bottom: 0.5rem;
    }

    .buttons {
        display: flex;
        gap: 0.5rem;
    }

    .edit, .save {
        background: #4da3ff;
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .cancel {
        background: #888;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .delete {
        background: #ff4d4d;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .editing {
        background: #4da3ff22;
    }
</style>
