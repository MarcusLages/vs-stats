import * as vscode from "vscode";
import { MainWindow } from "./components/view_window.js";
import { LineTracker } from "./tracker/lineTracker.js"

// activate(context: vscode.ExtensionContext)
export function activate(context) {
	console.log('Extension "statosaurus" activated.');

	const mainWindow = vscode.window.registerTreeDataProvider(
		'mainWindow',
		new MainWindow()
	)

    // Example usage
    new LineTracker().start({update: function(m) { console.log(`+${m.added} -${m.removed}`) }})

	context.subscriptions.push(mainWindow);
}

// This method is called when your extension is deactivated
export function deactivate() {}