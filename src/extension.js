import * as vscode from "vscode";
import { ClockWindow } from "./components/clock_window.js";
import { LineTracker } from "./tracker/lineTracker.js"
import { CommitTracker } from "./tracker/commitTracker.js";
import { TimeTracker } from "./tracker/timeTracker.js";
import { CommitWindow } from "./components/commit_window.js";
import { LineWindow } from "./components/line_window.js";
import { processCommitsHTMLString, processLinesHTMLString } from "./visualization/dataView.js";
import { runPy } from "./utils/pipe.js";
import path from "path";
import { fileURLToPath } from "url";

// activate(context: vscode.ExtensionContext)
export function activate(context) {
	console.log('Extension "statosaurus" activated.');

    // const daemon = new PythonDaemon(context, "./visualization/daemon.py");
    
    // Start tracking
    const lineTracker = new LineTracker(context);
    const commitTracker = new CommitTracker(context);
    const timeTracker = new TimeTracker(context);
    
    // lineTracker.start({update: function(m) { console.log(`+${m.added} -${m.removed}`) }});
    lineTracker.start();
    commitTracker.start();
    timeTracker.start();

    const clockWindow = new ClockWindow();
    const heatCommitWindow = new CommitWindow();
    const lineStatsWindow = new LineWindow();

	const clockWindowDisp = vscode.window.registerTreeDataProvider(
		'clocksWindow',
		clockWindow
	);
    const heatCommitWindowDisp = vscode.window.registerWebviewViewProvider(
        'heatCommitWindow',
        heatCommitWindow
    );
    const lineStatsWindowDisp = vscode.window.registerWebviewViewProvider(
        'lineStatsWindow',
        lineStatsWindow
    );

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // const scriptPath = path.join(__dirname, "utils", "test.py");
    // runPy(context, scriptPath, "input from Node", ["argA", "argB"])
    //     .then(out => console.log("Result from Python:", out))
    //     .catch(err => console.error("Error:", err));

    // Time tracker updates
    timeTracker.onUpdate(clocks => {
        clockWindow.refresh(clocks);
    });

    // Commit tracker updates - produce full HTML and set it into the webview
    commitTracker.onUpdate(async commits => {
        // if (!heatCommitWindow.webview) return;
        // const html = processCommitsHTMLString(commits);
        // heatCommitWindow.refresh(html);
        const scriptPath = path.join(__dirname, "visualization", "commitMap.py");
        const html = runPy(context, scriptPath, JSON.stringify(commits))
        .then(out => {
            // console.log("Result from Python:", out);
            heatCommitWindow.refresh(out)
        })
        .catch(err => console.error("Error:", err));
    });

    // Line tracker updates - produce full HTML and set it into the webview
    lineTracker.onUpdate(async lines => {
        if (!lineStatsWindow.webview) return;
        const html = processLinesHTMLString(lines);
        lineStatsWindow.refresh(html);
    });

	context.subscriptions.push(clockWindowDisp);
	context.subscriptions.push(heatCommitWindowDisp);
	context.subscriptions.push(lineStatsWindowDisp);
}

// This method is called when your extension is deactivated
export function deactivate() {}