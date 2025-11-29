<script>
  export let open = false;
  export let close = () => {};

  let message = "";
  let messages = [
    {
      from: "bot",
      text: "Biiiep Biiiep! Hey Adventurer—ask me any Minecraft question!"
    }
  ];

  async function sendMessage() {
    if (!message.trim()) return;

    messages.push({ from: "user", text: message });

    // Call your backend API route
    const res = await fetch("/api/mcchat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    messages.push({ from: "bot", text: data.reply });

    message = "";
  }
</script>

{#if open}
<div class="chat-wrapper">
  <div class="chat-header">
    <span>Minecraft Helper</span>
    <button class="close-btn" on:click={close}>✖</button>
  </div>

  <div class="chat-body">
    {#each messages as m}
      <div class="msg {m.from}">
        {m.text}
      </div>
    {/each}
  </div>

  <div class="chat-input">
    <input
      placeholder="Ask something…"
      bind:value={message}
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button on:click={sendMessage}>Send</button>
  </div>
</div>
{/if}

<style>
.chat-wrapper {
  position: fixed;
  bottom: 95px;
  right: 25px;
  width: 360px;
  height: 520px;
  background: rgba(20, 20, 20, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  backdrop-filter: blur(14px);
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Minecraftia", sans-serif;
  z-index: 99999;
}

.chat-header {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: white;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.msg {
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.6rem;
  border-radius: 8px;
  line-height: 1.4rem;
}

.msg.bot {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.msg.user {
  background: #4da3ff;
  color: #000;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 0.7rem;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
}

.chat-input input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 0.9rem;
}

.chat-input button {
  padding: 0.6rem 1rem;
  background: #4da3ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: black;
}
</style>
