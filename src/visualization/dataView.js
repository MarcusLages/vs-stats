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