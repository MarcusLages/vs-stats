export function processCommitsHTMLString(data) {
    const commitsArray = data.commits || [];
    const commitsData = Array(7).fill(0);
    commitsArray.slice(-7).forEach((v, i) => commitsData[i] = v);

    const max = Math.max(...commitsData, 1);
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const cells = commitsData.map((v, i) => {
        const intensity = v / max;
        const color = intensity === 0 ? '#ffe5e5'
            : intensity < 0.33 ? '#ff9999'
            : intensity < 0.66 ? '#ff4d4d'
            : '#cc0000';
        return `<div class="cell" style="background:${color}" title="${days[i]}: ${v} commits">${v}</div>`;
    }).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: sans-serif;
            padding: 10px;
            margin: 0;
        }
        h3 {
            text-align: center;
            margin-bottom: 10px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }
        .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 1/1;
            font-size: 14px;
            border-radius: 6px;
            color: black;
        }
        .labels {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            font-size: 12px;
            margin-top: 4px;
        }
        </style>
        </head>
        <body>
            <h3>Commit Activity - Last 7 Days</h3>
            <div class="grid">${cells}</div>
            <div class="labels">${days.map(d => `<div>${d}</div>`).join('')}</div>
        </body>
        </html>
    `;
}

export function processLinesHTMLString(data) {
    const addedArray = data.linesAdded || [];
    const deletedArray = data.linesDeleted || [];
    const addedData = Array(7).fill(0);
    const deletedData = Array(7).fill(0);
    
    addedArray.slice(-7).forEach((v, i) => addedData[i] = v);
    deletedArray.slice(-7).forEach((v, i) => deletedData[i] = v);

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
        <style>
        body {
            font-family: sans-serif;
            padding: 10px;
            margin: 0;
        }
        #plotlyDiv {
            width: 100%;
            height: 200px;
        }
        </style>
        </head>
        <body>
            <div id="plotlyDiv"></div>
            <script>
                const xLabels = ${JSON.stringify(days)};
                const addedValues = ${JSON.stringify(addedData)};
                const deletedValues = ${JSON.stringify(deletedData)};

                const traceAdded = {
                    x: xLabels,
                    y: addedValues,
                    mode: 'lines+markers',
                    name: 'Lines Added',
                    line: { color: '#2E86AB', width: 3 },
                    marker: { size: 6 }
                };

                const traceDeleted = {
                    x: xLabels,
                    y: deletedValues,
                    mode: 'lines+markers',
                    name: 'Lines Removed',
                    line: { color: '#E63946', width: 3 },
                    marker: { size: 6 }
                };

                const layout = {
                    title: 'Code Metrics - Last 7 Days',
                    xaxis: { title: 'Day' },
                    yaxis: { title: 'Lines' },
                    hovermode: 'x unified',
                    template: 'plotly_white',
                    margin: { t: 40, b: 50, l: 50, r: 20 },
                    showlegend: true,
                    legend: {
                        yanchor: "top",
                        y: 0.99,
                        xanchor: "left",
                        x: 0.01
                    },
                    // enforce reduced height so Plotly renders at the smaller size
                    height: 200
                };

                const config = { responsive: true };
                Plotly.newPlot('plotlyDiv', [traceAdded, traceDeleted], layout, config);
            </script>
        </body>
        </html>
    `;
}