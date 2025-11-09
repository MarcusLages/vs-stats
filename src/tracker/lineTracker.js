import * as vscode from "vscode";
import { getCurRepo } from "../utils/git.js";
import path from "path";
import { Tracker } from "./tracker.js";

export class LineTracker extends Tracker {

    static DAYS_IN_WEEK = 7;
    static WEEK_AGO = 0;
    static TODAY = 6;

    static CURR_DATE_STG_KEY = "currDate";
    static LINES_ADDED_STG_KEY = "linesAdded";
    static LINES_REMOVED_STG_KEY = "linesRemoved";
    
    static ADDED_LINE_REGEX = /^\+(?!\+\+)/gm;
    static REMOVED_LINE_REGEX = /^\-(?!\-)/gm;
    
    constructor(context) {
        super();
        this.context = context;
        // Always lines first, date last
        this.linesAdded = this.loadLinesAdded();
        this.linesRemoved = this.loadLinesRemoved();
        this.currDate = this.loadCurrDate();
        this.updateDate();
    }

    start() {
        vscode.workspace.onDidSaveTextDocument(async () => {
            const repo = await getCurRepo();
            if (!repo || (repo.state.workingTreeChanges.length === 0 && repo.state.indexChanges.length === 0)) {
                // Still emit current data even if no changes
                this._onUpdate.fire(this.getData());
                return;
            }

            const unstaged_changes = repo.state.workingTreeChanges;
            const staged_changes = repo.state.indexChanges;
            let addedToday = 0;
            let removedToday = 0;
            
            for (const change of staged_changes) {
                const absPath = vscode.Uri.file(change.uri.fsPath);
                const relPath = path.relative(repo.rootUri.fsPath, absPath.fsPath);

                try {
                    const stagedDiff = await repo.diffIndexWithHEAD(relPath);
                    const stagedDiffRes = this.diffParse(stagedDiff);
                    
                    addedToday += stagedDiffRes.added;
                    removedToday += stagedDiffRes.removed;
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

                    addedToday += unstagedDiffRes.added;
                    removedToday += unstagedDiffRes.removed;
                } catch (err) {
                    console.error(`Diff failed - ${relPath}: `, err);
                }
            }

            this.updateDate();
            this.updateTodayLine(addedToday, removedToday);
            console.log("LineTracker data:", this.getData());
            this._onUpdate.fire(this.getData());
        });

        // Fire initial data
        this._onUpdate.fire(this.getData());
    }

    diffParse(diff) {
        if (!diff) return null;

        return { 
            "added": (diff.match(LineTracker.ADDED_LINE_REGEX) || []).length, 
            "removed": (diff.match(LineTracker.REMOVED_LINE_REGEX) || []).length
        };
    }

    loadLinesAdded() {
        return this.context.workspaceState.get(
            LineTracker.LINES_ADDED_STG_KEY,
            Array(LineTracker.DAYS_IN_WEEK).fill(0)
        );
    }
    
    loadLinesRemoved() {
        return this.context.workspaceState.get(
            LineTracker.LINES_REMOVED_STG_KEY,
            Array(LineTracker.DAYS_IN_WEEK).fill(0)
        );
    }

    loadCurrDate() {
        const stored = this.context.workspaceState.get(LineTracker.CURR_DATE_STG_KEY);
        if (stored) {
            return new Date(stored);
        }
        return new Date();
    }

    updateDate() {
        const now = new Date();
        while(LineTracker.differentDays(now, this.currDate)) {
            this.nextDay()
        }
        
        this.currDate = now;
        this.context.workspaceState.update(
            LineTracker.CURR_DATE_STG_KEY,
            this.currDate
        )
    }

    static differentDays(prev, curr) {
        return prev.getFullYear() !== curr.getFullYear() ||
            prev.getMonth() !== curr.getMonth() ||
            prev.getDate() !== curr.getDate();
    }

    nextDay() {
        this.currDate.setDate(this.currDate.getDate() + 1);
        
        this.linesAdded.shift();
        this.linesRemoved.shift();

        this.linesAdded.push(0);
        this.linesRemoved.push(0);
    }

    updateTodayLine(addedToday, removedToday) {
        this.linesAdded[LineTracker.TODAY] = addedToday;
        this.linesRemoved[LineTracker.TODAY] = removedToday;

        this.context.workspaceState.update(
            LineTracker.LINES_ADDED_STG_KEY,
            this.linesAdded
        )
        this.context.workspaceState.update(
            LineTracker.LINES_REMOVED_STG_KEY,
            this.linesRemoved
        )
    }

    getData() {
        const dateFormatted = `${this.currDate.getFullYear()}-${this.currDate.getMonth()}-${this.currDate.getDate()}`;
        return {
            currDate: dateFormatted,
            linesAdded: this.linesAdded,
            linesRemoved: this.linesRemoved
        }
    }

}