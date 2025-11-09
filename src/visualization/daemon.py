import json
import sys

import sys
import json
import plotly.graph_objects as go
import plotly.io as pio
from datetime import datetime, timedelta

def process_commits(data):
    # commits_data = {"commits": [0, 3, 2, 5, 1, 0, 4]}
    commits_array = data.get("commits", [])
    commits_data = {i: 0 for i in range(7)}
    recent = commits_array[-7:] if len(commits_array) >= 7 else commits_array
    for i, v in enumerate(recent):
        commits_data[i] = v

    x_labels = [(datetime.now() - timedelta(days=6-i)).strftime("%a") for i in range(7)]
    commit_values = [[commits_data[i] for i in range(7)]]
    fig = go.Figure(data=go.Heatmap(
        z=commit_values,
        x=x_labels,
        y=['Commits'],
        colorscale=[
            [0.0, '#ffe5e5'], [0.33, '#ff9999'], [0.66, '#ff4d4d'], [1.0, '#cc0000']
        ],
        text=commit_values,
        texttemplate='%{text}',
        textfont={"size": 16, "color": "black"},
        hovertemplate='%{x}<br>Commits: %{z}<extra></extra>',
        colorbar=dict(title="Commits"),
    ))
    fig.update_layout(
        title='Commit Activity - Last 7 Days',
        template='plotly_white',
        height=500,
        width=1250
    )
    return fig

def process_lines(data):
    # lines_data = {"linesAdded": [...], "linesDeleted": [...]}
    added_array = data.get("linesAdded", [])
    deleted_array = data.get("linesDeleted", [])
    added_data = {i: 0 for i in range(7)}
    deleted_data = {i: 0 for i in range(7)}

    recent_added = added_array[-7:] if len(added_array) >= 7 else added_array
    recent_deleted = deleted_array[-7:] if len(deleted_array) >= 7 else deleted_array
    for i, v in enumerate(recent_added):
        added_data[i] = v
    for i, v in enumerate(recent_deleted):
        deleted_data[i] = v

    x_labels = [(datetime.now() - timedelta(days=6-i)).strftime("%a") for i in range(7)]
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x_labels, y=[added_data[i] for i in range(7)],
                             mode='lines+markers', name='Lines Added',
                             line=dict(color='#2E86AB', width=4)))
    fig.add_trace(go.Scatter(x=x_labels, y=[deleted_data[i] for i in range(7)],
                             mode='lines+markers', name='Lines Removed',
                             line=dict(color='#E63946', width=4)))
    fig.update_layout(
        title='Code Metrics - Last 7 Days',
        xaxis_title='Day',
        yaxis_title='Lines',
        template='plotly_white',
        hovermode='x unified'
    )
    return fig

while True:
    line = sys.stdin.readline()
    if not line:
        break
    try:
        data = json.loads(line)
        if "commits" in data:
            fig = process_commits(data)
        else:
            fig = process_lines(data)
        print(pip.to_html(fig), flush=True)
    except Exception as e:
        print(json.dumps({"error": str(e)}), flush=True)
    