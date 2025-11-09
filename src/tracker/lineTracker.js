import * as vscode from "vscode";
import { getCurRepo } from "../utils/git.js";
import path from "path";

export class LineTracker {

    static ADDED_LINE_REGEX = /^\+(?!\+\+)/gm;
    static REMOVED_LINE_REGEX = /^\-(?!\-)/gm;

    start(component) {
        vscode.workspace.onDidSaveTextDocument(async () => {
            const repo = await getCurRepo();
            if (!repo || repo.state.workingTreeChanges.length === 0) return;

            // TODO for staged ones
            const unstaged_changes = repo.state.workingTreeChanges;
            const staged_changes = repo.state.indexChanges;
            const res = { "added": 0, "removed": 0 };
            
            for (const change of staged_changes) {
                const absPath = vscode.Uri.file(change.uri.fsPath);
                const relPath = path.relative(repo.rootUri.fsPath, absPath.fsPath);

                try {
                    const stagedDiff = await repo.diffIndexWithHEAD(relPath);
                    const stagedDiffRes = this.diffParse(stagedDiff);
                    
                    if (!res) continue;
                    res.added += stagedDiffRes.added;
                    res.removed += stagedDiffRes.removed;
                } catch (err) {
                    console.error(`Diff failed - ${relPath}: `, err);
                }
            }
            for (const change of unstaged_changes) {
                const absPath = vscode.Uri.file(change.uri.fsPath);
                const relPath = path.relative(repo.rootUri.fsPath, absPath.fsPath);
                
                try {
                    const unstagedDiff = await repo.diffWithHEAD(relPath);
                    const unstagedDiffRes = this.diffParse(unstagedDiff);

                    if (!res) continue;
                    res.added += unstagedDiffRes.added;
                    res.removed += unstagedDiffRes.removed;
                } catch (err) {
                    console.error(`Diff failed - ${relPath}: `, err);
                }
            }
            component.update(res)
        });
    }

    diffParse(diff) {
        if (!diff) return null;

        return { 
            "added": (diff.match(LineTracker.ADDED_LINE_REGEX) || []).length, 
            "removed": (diff.match(LineTracker.REMOVED_LINE_REGEX) || []).length
        };
    }

}