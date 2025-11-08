import * as vscode from "vscode";
import { MainWindow } from "./components/view_window.js";

// activate(context: vscode.ExtensionContext)
export function activate(context) {
	console.log('Extension "statosaurus" activated.');

	const mainWindow = vscode.window.registerTreeDataProvider(
		'mainWindow',
		new MainWindow()
	)
	context.subscriptions.push(mainWindow);
}

// This method is called when your extension is deactivated
export function deactivate() {}