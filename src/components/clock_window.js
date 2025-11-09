import * as vscode from "vscode";

// export class MainWindow implements vscode.TreeDataProvider<WindowItem>
export class ClockWindow {
    constructor() {
    }

    // getTreeItem(element: WindowItem): vscode.TreeItem
    getTreeItem(elem) {
        return elem;
    }

    // getChildren(element?: WindowItem): Thenable<WindowItem[]>
    getChildren(_) {
        return Promise.resolve([
            new WindowItem("Title", vscode.TreeItemCollapsibleState.None)
        ])
    }
}

export class WindowItem extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        // can include tooltip, description, iconPath
    }

    update(data) {

    }
}