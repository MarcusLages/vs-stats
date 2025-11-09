# Statosaurus 🦖

A Visual Studio Code extension that tracks your coding activity — commits, lines added/removed, and repository insights — all visualized inside VS Code. Our objective is to help users stay focused on their coding/assignments through easily observable progression and stats.

## Features

- **Live Git Commit Tracking** - Monitor your commits in real-time
- **Line Statistics** - Track lines added and removed per session
- **Plotly Visualizations** - Interactive charts and heatmaps for commit activity
- **Time Tracking** - See how much time you've spent on a repository (session, weekly, total)
- **Visual Dashboard** - Integrated sidebar with multiple views (Clocks, Commits, Changes)

## Installation

### From Marketplace (Coming Soon)
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Statosaurus"
4. Click Install

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/MarcusLages/vs-stats.git
   cd vs-stats
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies (for visualization scripts):
   ```bash
   python -m venv .venv
   .venv\Scripts\Activate.ps1  # Windows PowerShell
   # or: source .venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

4. Press `F5` in VS Code to launch the extension in debug mode

## Requirements

### System Requirements
- **VS Code**
- **Node.js**
- **Python**
- **Git**

### Dependencies

**Node.js (Extension):**
- `vscode.git` extension (built-in)

**Python (Visualization):**
- `plotly` (6.4.0) - Interactive charts
- `pandas` (2.3.3) - Data manipulation
- `numpy` (2.3.4) - Numerical operations

See `package.json` and `requirements.txt` for complete dependency lists.

## Usage

1. **Open a Git repository** in VS Code
2. **Access Statosaurus** from the Activity Bar (sidebar icon)
3. **View your stats** in three panels:
   - **Clocks**: Session, weekly, and total time tracking
   - **Commits**: Commit heatmap for the last 7 days
   - **Changes**: Lines added/removed graphs

### Python Visualization Scripts

The extension includes standalone Python scripts for generating visualizations:

**Line Graph (Lines Added/Removed):**
```bash
# From file
python src/visualization/lineGraphs.py data.json

# From stdin
echo '{"linesAdded":[10,7,12,15,8,20,5],"linesDeleted":[2,3,1,4,0,5,2]}' | python src/visualization/lineGraphs.py
```

**Commit Heatmap:**
```bash
# From file
python src/visualization/commitMap.py commitdata.json

# From stdin
echo '{"commits":[5,10,3,8,12,6,15]}' | python src/visualization/commitMap.py
```

## Extension Settings

This extension does not currently add any configurable settings.

## Known Issues

- Initial time tracking may not start immediately on first activation
- Large repositories may experience slight delays in commit tracking
- Python visualizations require manual execution (not yet integrated into extension UI)

Report issues at: [GitHub Issues](https://github.com/MarcusLages/vs-stats/issues)

## Project Structure

```
vs-stats/
├── src/
│   ├── extension.js          # Extension entry point
│   ├── components/           # UI components
│   ├── tracker/              # Tracking logic (commits, lines, time)
│   └── visualization/        # Python plotting scripts
│       ├── lineGraphs.py     # Lines added/removed graphs
│       └── commitMap.py      # Commit heatmap
├── resources/                # Icons and assets
├── package.json              # Extension manifest
└── requirements.txt          # Python dependencies
```

## Contributing

Contributions are welcome, feel free to make a pull request

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- **Marcus Lages** - [MarcusLages](https://github.com/MarcusLages)
- **Ben Nguyen** - [BenNg1](https://github.com/BenNg1)

## Acknowledgments

- Built with [Plotly](https://plotly.com/) for visualizations
- Powered by VS Code Extension API
- Icons by [Statosaurus gang]