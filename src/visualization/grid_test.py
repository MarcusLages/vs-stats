# %%
import plotly.express as px
import pandas as pd
import numpy as np

# Sample data
data = np.random.rand(1, 7)
fig = px.imshow(data, title="Plotly Heatmap in VS Code")

# Display the figure in the interactive window
fig.show()
