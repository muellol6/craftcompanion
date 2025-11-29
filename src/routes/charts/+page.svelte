<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    let canvas;
    let chart;

    onMount(async () => {
        const res = await fetch("/api/itemlist");
        const items = await res.json();

        // ---------------------------------------------
        // 1️⃣ Kategorien aggregieren → SUMME von amount
        // ---------------------------------------------
        const categoryTotals = {};

        for (const item of items) {
            const category = item.category || "Unknown";
            const amount = Number(item.amount) || 0;

            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }

            categoryTotals[category] += amount;
        }

        // ---------------------------------------------
        // 2️⃣ Daten für das Chart vorbereiten
        // ---------------------------------------------
        const labels = Object.keys(categoryTotals);
        const values = Object.values(categoryTotals);

        // Destroy old chart when navigating
        if (chart) chart.destroy();

        chart = new Chart(canvas, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Items per Category (Total Amount)",
                        data: values,
                        backgroundColor: "rgba(77, 163, 255, 0.5)",
                        borderColor: "#4da3ff",
                        borderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "white" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    },
                    x: {
                        ticks: { color: "white" },
                        grid: { color: "rgba(255,255,255,0.05)" }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: "white" }
                    }
                }
            }
        });
    });
</script>

<div class="chart-wrapper">
    <h1>Category Statistics</h1>

    <div class="chart-box">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .chart-wrapper {
        padding: 3rem;
        color: white;
        text-align: center;
        font-family: 'Minecraftia';
    }

    h1 {
        font-size: 2.6rem;
        margin-bottom: 2rem;
    }

    .chart-box {
        width: 85%;
        height: 480px;
        margin: 0 auto;
        background: #ffffff08;
        backdrop-filter: blur(14px);
        border-radius: 20px;
        border: 1px solid #ffffff20;
        padding: 1rem;
    }
</style>
