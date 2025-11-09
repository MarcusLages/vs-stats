import * as vscode from "vscode";

// export class MainWindow implements vscode.TreeDataProvider<WindowItem>
export class ClockWindow {

    static SESS_IDX = 0;
    static WEEKLY_IDX = 1;
    static TOTAL_IDX = 2;
    static WEEKLY_PROJ_IDX = 3;

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.items = [
            new WindowItem("Hours in this session", "0", vscode.TreeItemCollapsibleState.None),
            new WindowItem("Hours weekly", "0", vscode.TreeItemCollapsibleState.None),
            new WindowItem("Hours in this project", "0", vscode.TreeItemCollapsibleState.None),
            new WindowItem("Hours in this project (this week)", "0", vscode.TreeItemCollapsibleState.None)
        ]
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

export class WindowItem extends vscode.TreeItem {
    constructor(label, description, collapsibleState) {
        super(label, collapsibleState);
        this.description = description;
    }
}