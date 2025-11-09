function processCommitsHTMLString(data) {
    const commitsArray = data.commits || [];
    const commitsData = Array(7).fill(0);
    commitsArray.slice(-7).forEach((v, i) => commitsData[i] = v);

    const xLabels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const trace = {
        z: [commitsData],
        x: xLabels,
        y: ['Commits'],
        type: 'heatmap',
        colorscale: [
            [0.0, '#ffe5e5'], [0.33, '#ff9999'],
            [0.66, '#ff4d4d'], [1.0, '#cc0000']
        ],
        text: [commitsData],
        texttemplate: '%{text}',
        textfont: { size: 16, color: 'black' },
        hovertemplate: '%{x}<br>Commits: %{z}<extra></extra>',
        colorbar: { title: 'Commits' },
    };

    const layout = {
        title: 'Commit Activity - Last 7 Days',
        height: 500,
        width: 1250,
        template: 'plotly_white'
    };

    // Return full HTML string
    return `
        <div id="plotlyDiv"></div>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <script>
            const data = ${JSON.stringify([trace])};
            const layout = ${JSON.stringify(layout)};
            Plotly.newPlot('plotlyDiv', data, layout);
        </script>
    `;
}

function processLinesHTMLString(data) {
    const addedArray = data.linesAdded || [];
    const deletedArray = data.linesDeleted || [];
    const addedData = Array(7).fill(0);
    const deletedData = Array(7).fill(0);
    addedArray.slice(-7).forEach((v, i) => addedData[i] = v);
    deletedArray.slice(-7).forEach((v, i) => deletedData[i] = v);

    const xLabels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const traceAdded = {
        x: xLabels,
        y: addedData,
        mode: 'lines+markers',
        name: 'Lines Added',
        line: { color: '#2E86AB', width: 4 }
    };

    const traceDeleted = {
        x: xLabels,
        y: deletedData,
        mode: 'lines+markers',
        name: 'Lines Removed',
        line: { color: '#E63946', width: 4 }
    };

    const layout = {
        title: 'Code Metrics - Last 7 Days',
        xaxis: { title: 'Day' },
        yaxis: { title: 'Lines' },
        hovermode: 'x unified',
        template: 'plotly_white'
    };

    return `
        <div id="plotlyDiv"></div>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <script>
            const data = ${JSON.stringify([traceAdded, traceDeleted])};
            const layout = ${JSON.stringify(layout)};
            Plotly.newPlot('plotlyDiv', data, layout);
        </script>
    `;
}
