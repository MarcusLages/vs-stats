import * as vscode from "vscode";
import { getCurRepo } from "./utils/git.js";
import { ClockWindow } from "./components/clock_window.js";
import { LineTracker } from "./tracker/lineTracker.js"
import { CommitTracker } from "./tracker/getCommits.js";
import { TimeTracker } from "./tracker/timeTracker.js";

// activate(context: vscode.ExtensionContext)
export function activate(context) {
	console.log('Extension "statosaurus" activated.');
    // Start tracking
    new LineTracker().start({update: function(m) { console.log(`+${m.added} -${m.removed}`) }});
    new CommitTracker().start();
    new TimeTracker(context).start();

	const clockWindow = vscode.window.registerTreeDataProvider(
		'clocksWindow',
		new ClockWindow()
	)


	context.subscriptions.push(clockWindow);
}

// This method is called when your extension is deactivated
export function deactivate() {}