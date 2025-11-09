import * as vscode from "vscode";
import { ClockWindow } from "./components/clock_window.js";
import { LineTracker } from "./tracker/lineTracker.js"
import { CommitTracker } from "./tracker/commitTracker.js";
import { TimeTracker } from "./tracker/timeTracker.js";
import { CommitWindow } from "./components/commit_window.js";
import { processCommitsHTMLString } from "./visualization/dataView.js";

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
    let heatCommitWindow = new CommitWindow();

	const clockWindowDisp = vscode.window.registerTreeDataProvider(
		'clocksWindow',
		clockWindow
	)
    const heatCommitWindowDisp = vscode.window.registerWebviewViewProvider(
        'heatCommitWindow',
        heatCommitWindow
    )

    timeTracker.onUpdate( clocks => {
        clockWindow.refresh(clocks)
    })
    commitTracker.onUpdate(async commits => {
        
        if (!heatCommitWindow.webview) return;
        const resHTML = processCommitsHTMLString(commits);
        // const resHTML = "<h1>Hello hello</h1>"
        // console.log(resHTML) 
        heatCommitWindow.refresh(resHTML);
    })

	context.subscriptions.push(heatCommitWindowDisp);
	context.subscriptions.push(clockWindowDisp);
}

// This method is called when your extension is deactivated
export function deactivate() {}