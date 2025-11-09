import * as vscode from "vscode";
import { WindowItem } from "./window.js";

// export class MainWindow implements vscode.TreeDataProvider<WindowItem>
export class ClockWindow {

    static SESS_IDX = 0;
    static WEEKLY_IDX = 1;
    static TOTAL_IDX = 2;
    static WEEKLY_PROJ_IDX = 3;

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;

        // prettier labels + emojis
        this.items = [
            new WindowItem("Session", "0", vscode.TreeItemCollapsibleState.None),
            new WindowItem("Weekly", "0", vscode.TreeItemCollapsibleState.None),
            new WindowItem("Project Total", "0", vscode.TreeItemCollapsibleState.None),
            new WindowItem("Project (this week)", "0", vscode.TreeItemCollapsibleState.None)
        ];
    }

    // getTreeItem(element: WindowItem): vscode.TreeItem
    getTreeItem(elem) {
        return elem;
    }

    // getChildren(element?: WindowItem): Thenable<WindowItem[]>
    getChildren(_) {
        return Promise.resolve(this.items)
    }

    setClocks(data) {
        this.items[ClockWindow.SESS_IDX].description = data.session;

        this.items[ClockWindow.WEEKLY_IDX].description = data.weekly;

        this.items[ClockWindow.TOTAL_IDX].description = data.total;

        this.items[ClockWindow.WEEKLY_PROJ_IDX].description = data.weekProject;
    }

    refresh(data) {
        this.setClocks(data)
        this._onDidChangeTreeData.fire(null)
    }
}