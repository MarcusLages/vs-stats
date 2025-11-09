import * as vscode from 'vscode';

export class WindowItem extends vscode.TreeItem {
    constructor(label, description, collapsibleState) {
        super(label, collapsibleState);
        this.description = description;
    }
}