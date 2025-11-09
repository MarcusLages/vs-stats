import * as vscode from "vscode";
import { getCurRepo } from "../utils/git.js";
import path from "path";

export class LineTracker {
   
    start(component) {
        vscode.workspace.onDidChangeTextDocument(async () => {
            const repo = await getCurRepo();
            if (!repo || repo.state.workingTreeChanges.length === 0) return;

            for (const change of repo.state.workingTreeChanges) {
                const absPath = vscode.Uri.file(change.uri.fsPath);
                const relPath = path.relative(repo.rootUri.fsPath, absPath.fsPath);

                try {
                    const diff = await repo.diffWithHEAD(relPath);
                    if (!diff) continue;

                    // Ignore diff headers like +++/---
                    const added = (diff.match(/^\+(?!\+\+)/gm) || []).length;
                    const removed = (diff.match(/^\-(?!\-)/gm) || []).length;

                    component.update({ "added": added, "removed": removed})
                } catch (err) {
                    console.error(`Diff failed - ${relPath}: `, err);
                }
            }
        });
    }
}