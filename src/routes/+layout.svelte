<script>
	import { page } from '$app/stores';

	/* ---------------------------
	   Navigation Tabs
	---------------------------- */
	const tabs = [
		{ name: 'Finder', path: '/' },
		{ name: 'My List', path: '/mylist' },
		{ name: 'Collect', path: '/collect' },
		{ name: 'Charts', path: '/charts' }
	];

	/* ---------------------------
	   Chatbot State
	---------------------------- */
	let open = false;
	let input = "";

	let messages = [
		{
			from: "bot",
			text: "Biiiep Biiiep! Hey Adventurer, ask me any Minecraft question!"
		}
	];

	/* ---------------------------
	   SEND MESSAGE (modern API)
	---------------------------- */
	async function sendMessage() {
		if (!input.trim()) return;

		const userMessage = input;

		// Show user message in UI
		messages = [...messages, { from: "user", text: userMessage }];

		// clear input immediately
		input = "";

		try {
			const res = await fetch("/api/chat", {   // <<<<< HIER FIX!
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: userMessage })
			});

			const data = await res.json();

			let botReply =
				data?.reply ||
				data?.output_text ||
				data?.choices?.[0]?.message?.content ||
				"Hmm… I’m not sure about that!";

			messages = [...messages, { from: "bot", text: botReply }];
		} catch (e) {
			console.error("Chatbot error:", e);
			messages = [...messages, { from: "bot", text: "Error connecting to AI." }];
		}
	}
</script>


<!-- ---------------------------------------
     NAVIGATION BAR
---------------------------------------- -->
<nav class="navbar">
	<div class="nav-content">
		{#each tabs as t}
			<a
				href={t.path}
				class={"tab " + ($page.url.pathname === t.path ? "active" : "")}>
				{t.name}
			</a>
		{/each}
	</div>
</nav>

<!-- CONTENT SLOT -->
<slot />

<!-- ---------------------------------------
     CHAT BUTTON (BOTTOM RIGHT)
---------------------------------------- -->
<div class="chat-button" on:click={() => open = true}>
	<img src="/src/lib/assets/bot.png" alt="bot" />
</div>

<!-- ---------------------------------------
     CHAT POPUP
---------------------------------------- -->
{#if open}
	<div class="chat-popup">
		<div class="chat-header">
			<span>Minecraft Helper</span>
			<button class="close-btn" on:click={() => open = false}>✖</button>
		</div>

		<div class="chat-messages">
			{#each messages as m}
				<div class="msg {m.from}">
					{m.text}
				</div>
			{/each}
		</div>

		<div class="chat-input">
			<input
				type="text"
				placeholder="Ask something..."
				bind:value={input}
				on:keydown={(e) => e.key === "Enter" && sendMessage()}
			/>
			<button on:click={sendMessage}>Send</button>
		</div>
	</div>
{/if}



<style>
	/* ========== GLOBAL FONT ========== */
	@font-face {
		font-family: 'Minecraftia';
		src: url('/src/lib/fonts/Minecraftia.ttf') format('truetype');
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Minecraftia', sans-serif;
		color: white;
		background: #0b0f19;
	}

	.navbar {
		width: 100%;
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid rgba(255,255,255,0.05);
		backdrop-filter: blur(12px);
		padding: 0.8rem 0;
		position: sticky;
		top: 0;
		z-index: 20;
	}

	.nav-content {
		display: flex;
		gap: 2rem;
		padding: 0 2rem;
	}

	.tab {
		color: #9bb0c8;
		text-decoration: none;
		font-size: 1rem;
		padding-bottom: 4px;
	}

	.tab:hover { color: white; }

	.active {
		color: white;
		border-bottom: 2px solid #4da3ff;
	}

	/* --- CHAT BUTTON --- */
	.chat-button {
		position: fixed;
		bottom: 22px;
		right: 22px;
		width: 90px;
		height: 90px;
		border-radius: 50%;
		overflow: hidden;
		background: rgba(255,255,255,0.1);
		backdrop-filter: blur(6px);
		border: 2px solid rgba(255,255,255,0.35);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 50;
	}

	.chat-button img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.chat-popup {
		position: fixed;
		bottom: 120px;
		right: 20px;
		width: 360px;
		height: 480px;
		background: rgba(20,20,20,0.92);
		border: 2px solid rgba(255,255,255,0.2);
		border-radius: 14px;
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		z-index: 60;
		overflow: hidden;
	}

	.chat-header {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(255,255,255,0.2);
		font-size: 1.4rem;
	}

	.close-btn {
		font-size: 1.3rem;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.chat-messages {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.msg {
		padding: 0.6rem 0.8rem;
		border-radius: 6px;
		max-width: 80%;
		background: rgba(255,255,255,0.12);
	}

	.msg.user {
		align-self: flex-end;
		background: rgba(80,160,255,0.25);
	}

	.chat-input {
		display: flex;
		gap: 0.5rem;
		padding: 0.8rem;
		border-top: 1px solid rgba(255,255,255,0.2);
	}

	.chat-input input {
		flex: 1;
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.25);
		background: rgba(255,255,255,0.1);
		color: white;
	}

	.chat-input button {
		padding: 0 1rem;
		border: none;
		border-radius: 6px;
		background: #4da3ff;
		color: white;
		cursor: pointer;
	}
</style>
