<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import chartsImg from "$lib/assets/charts.png"; 

    let canvas;
    let chart;

    onMount(async () => {
        const res = await fetch("/api/itemlist");
        const items = await res.json();

        
        const categoryTotals = {};

        for (const item of items) {
            const category = item.category || "Unknown";
            const amount = Number(item.amount) || 0;

            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }

            categoryTotals[category] += amount;
        }

        const labels = Object.keys(categoryTotals);
        const values = Object.values(categoryTotals);

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


<div class="bg" style="background-image: url('{chartsImg}');">

    <div class="chart-wrapper">
        <h1>Category Statistics</h1>

        <div class="chart-box">
            <canvas bind:this={canvas}></canvas>
        </div>
    </div>

</div>

<style>
    
    .bg {
        width: 100%;
        min-height: 100vh;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;

        display: flex;
        justify-content: center;
        align-items: flex-start;

        padding-top: 3rem;
    }

    .chart-wrapper {
        padding: 3rem;
        color: white;
        text-align: center;
        font-family: 'Minecraftia';
        width: 100%;
    }

    h1 {
        font-size: 2.6rem;
        margin-bottom: 2rem;
    }

    .chart-box {
        width: 85%;
        height: 480px;
        margin: 0 auto;
        background: #00000066; /* etwas dunkler für bessere Lesbarkeit */
        backdrop-filter: blur(14px);
        border-radius: 20px;
        border: 1px solid #ffffff20;
        padding: 1rem;
    }
</style>
