import * as vscode from "vscode";
import { getCurRepo } from "./utils/git.js";
import { MainWindow } from "./components/view_window.js";
import { LineTracker } from "./tracker/lineTracker.js"
import { CommitTracker } from "./tracker/getCommits.js";

// activate(context: vscode.ExtensionContext)
export function activate(context) {
	console.log('Extension "statosaurus" activated.');
	const mainWindow = vscode.window.registerTreeDataProvider(
		'mainWindow',
		new MainWindow()

	)

    // Start tracking
    new LineTracker().start({update: function(m) { console.log(`+${m.added} -${m.removed}`) }});
    new CommitTracker().start();

	context.subscriptions.push(mainWindow);
}

// This method is called when your extension is deactivated
export function deactivate() {}