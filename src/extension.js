import * as vscode from "vscode";
import { getCurRepo } from "./utils/git.js";
import { ClockWindow } from "./components/clock_window.js";
import { LineTracker } from "./tracker/lineTracker.js"
import { CommitTracker } from "./tracker/commitTracker.js";
import { TimeTracker } from "./tracker/timeTracker.js";

// activate(context: vscode.ExtensionContext)
export function activate(context) {
	console.log('Extension "statosaurus" activated.');

    // Start tracking
    const lineTracker = new LineTracker();
    const commitTracker = new CommitTracker();
    const timeTracker = new TimeTracker(context);
    
    // lineTracker.start({update: function(m) { console.log(`+${m.added} -${m.removed}`) }});
    lineTracker.start();
    commitTracker.start();
    timeTracker.start();

	const clockWindow = vscode.window.registerTreeDataProvider(
		'clocksWindow',
		new ClockWindow()
	)


	context.subscriptions.push(clockWindow);
}

// This method is called when your extension is deactivated
export function deactivate() {}