import json
import plotly.graph_objects as go
from datetime import datetime, timedelta
import sys

def load_and_format_data(json_file='data.json'):

    with open(json_file, 'r') as file:
        data = json.load(file)
    
    lines_added_array = data["linesAdded"]
    lines_deleted_array = data["linesDeleted"]
    
    # Initialize dictionaries for last 7 days (index 0-6)
    added_data = {i: 0 for i in range(7)}
    deleted_data = {i: 0 for i in range(7)}
    
    # Take only the last 7 entries (most recent 7 days)
    recent_added = lines_added_array[-7:] if len(lines_added_array) >= 7 else lines_added_array
    recent_deleted = lines_deleted_array[-7:] if len(lines_deleted_array) >= 7 else lines_deleted_array
    
    # Fill the dictionaries (oldest to newest)
    for i, lines in enumerate(recent_added):
        added_data[i] = lines
    
    for i, lines in enumerate(recent_deleted):
        deleted_data[i] = lines
    
    return added_data, deleted_data

def plot_lines_metrics(added_dict, deleted_dict):
    """
    Creates a line graph showing both lines added and lines removed over the last 7 days.
    """
    # Create x-axis labels
    x_labels = []
    for i in range(7):
        if i == 6:
            x_labels.append('Today')
        else:
            days_ago = 6 - i
            x_labels.append('Yesterday ' * days_ago)
    
    # Get y values for both metrics
    added_values = [added_dict[i] for i in range(7)]
    deleted_values = [deleted_dict[i] for i in range(7)]
    
    # Create the plot
    fig = go.Figure()
    
    # Add trace for lines added
    fig.add_trace(go.Scatter(
        x=x_labels,
        y=added_values,
        mode='lines+markers',
        name='Lines Added',
        line=dict(color='#2E86AB', width=4),
        marker=dict(size=8)
    ))
    
    # Add trace for lines removed
    fig.add_trace(go.Scatter(
        x=x_labels,
        y=deleted_values,
        mode='lines+markers',
        name='Lines Removed',
        line=dict(color='#E63946', width=4),
        marker=dict(size=8)
    ))
    
    fig.update_layout(
        title='Code Metrics - Last 7 Days',
        xaxis_title='Day',
        yaxis_title='Lines',
        template='plotly_white',
        hovermode='x unified',
        legend=dict(
            yanchor="top",
            y=0.99,
            xanchor="left",
            x=0.01
        )
    )
    
    return fig

if __name__ == '__main__':

    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    else:
        json_file = 'data.json'  # Default file
    
    print(f"Loading data from: {json_file}")
    added_data, deleted_data = load_and_format_data(json_file)
    fig = plot_lines_metrics(added_data, deleted_data)
    fig.show()
    
    