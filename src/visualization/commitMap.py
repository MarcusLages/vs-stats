import json
import plotly.graph_objects as go
from datetime import datetime, timedelta
import sys

def load_and_format_data(json_file='commitdata.json'):
    
    with open(json_file, 'r') as file:
        data = json.load(file)
    
    commits_array = data["commits"]
    
    # Initialize dictionary for last 7 days (index 0-6)
    commits_data = {i: 0 for i in range(7)}
    
    # Take only the last 7 entries (most recent 7 days)
    recent_commits = commits_array[-7:] if len(commits_array) >= 7 else commits_array
    
    # Fill the dictionary (oldest to newest)
    for i, commits in enumerate(recent_commits):
        commits_data[i] = commits
    
    return commits_data

def plot_commit_heatmap(commits_dict):
    x_labels = []
    for i in range(7):
        if i == 6:
            x_labels.append('Today')
        else:
            days_ago = 6 - i
            x_labels.append('Yesterday ' * days_ago)
    
    # Get commit values and reshape for heatmap (1 row, 7 columns)
    commit_values = [[commits_dict[i] for i in range(7)]]
    
    # Get min/max from the actuals
    all_values = [commits_dict[i] for i in range(7)]
    min_val = min(all_values) if all_values else 0
    max_val = max(all_values) if all_values else 1
    
    fig = go.Figure(data=go.Heatmap(
        z=commit_values,
        x=x_labels,
        y=['Commits'],
        colorscale=[
            [0.0, '#ffe5e5'],  # very light red
            [0.33, '#ff9999'], # light red
            [0.66, '#ff4d4d'], # medium red
            [1.0, '#cc0000'],  # dark red
        ],
        zmin=min_val,
        zmax=max_val,
        text=commit_values,
        texttemplate='%{text}',
        textfont={"size": 16, "color": "black"},
        hovertemplate='%{x}<br>Commits: %{z}<extra></extra>',
        colorbar=dict(title="Commits"),
        showscale=True
    ))

    fig.update_layout(
        title='Commit Activity - Last 7 Days',
        xaxis_title='Day',
        template='plotly_white',
        height=500,
        width=1250,
        xaxis=dict(side='bottom'),
        yaxis=dict(showticklabels=True),
    )
        
        
    return fig

if __name__ == '__main__':
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    else:
        json_file = 'data.json'
        
    commits_data = load_and_format_data('commitdata.json')    
    fig = plot_commit_heatmap(commits_data)
    fig.show()