import plotly.express as px
import pandas as pd

fig = px.scatter(x=[1, 2, 3],
                 y=[1, 3, 2], 
                 title="Plotly Test Plot")
fig.show()