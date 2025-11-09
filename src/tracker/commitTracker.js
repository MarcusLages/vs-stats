import { getCurRepo } from "../utils/git.js";
import * as vscode from "vscode";
import { Tracker } from "./tracker.js";

// ATTENTION! : For now it only gets the commits for today and that's how it populates the array.
//              Later we will think on how we can pull everything from git.
export class CommitTracker extends Tracker {

    static DAYS_IN_WEEK = 7;
    static WEEK_AGO = 0;
    static TODAY = 6;

    static CURR_DATE_STG_KEY = "currDate";
    static COMMITS_STG_KEY = "commits";

    constructor(context) {
        super();
        this.context = context;
        this.commits = this.loadCommits();
        this.currDate = this.loadCurrDate();
        this.updateDate();
    }

    start() {
        getCurRepo().then(async repo => {
            if (!repo) {
                console.log("No Git repository found.");
                return 0;
            }

            // console.log(repo)
            // console.log(repo)
            // console.log(repo.onDidCommit)
            // const prevOnCommit = repo.onDidCommit;

            // repo.onDidChangeStatus;
            // repo.onDidChangeHead;
            vscode.workspace.onDidSaveTextDocument(async ev => {
                try {
                    const repo = await getCurRepo();
                    if (!repo) {
                        console.log("No Git repository found.");
                        return 0;
                    }

                    // Create a Date object for today at 00:00 (midnight)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Get all recent commits
                    const commits = await repo.log({
                        maxEntries: 500
                    });

                    // Filter commits from today (since midnight)
                    const todayCommits = commits.filter(commit => {
                        const commitDate = new Date(commit.authorDate);
                        return commitDate >= today;
                    });

                    this.updateDate();
                    this.updateCommits(todayCommits.length);
                    // console.log(`Commits made today: ${this.commits}`);
                    console.log(this.getData());
                    
                    this._onUpdate.fire(this.getData())
                } catch (error) {
                    console.error("Failed to retrieve commits:", error);
                    return 0;
                }
            })
        });
    }

    loadCommits() {
        return this.context.workspaceState.get(
            CommitTracker.COMMITS_STG_KEY,
            Array(CommitTracker.DAYS_IN_WEEK).fill(0)
        );
    }

    loadCurrDate() {
        const stored = this.context.workspaceState.get(CommitTracker.CURR_DATE_STG_KEY);
        return new Date(stored) || new Date();
    }

    updateDate() {
        const now = new Date();
        while(CommitTracker.differentDays(now, this.currDate)) {
            this.nextDay()
        }
        
        this.currDate = now;
        this.context.workspaceState.update(
            CommitTracker.CURR_DATE_STG_KEY,
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
        
        this.commits.shift();
        this.commits.push(0);
    }

    updateCommits(todayCommits) {
        this.commits[CommitTracker.TODAY] = todayCommits;
        this.context.workspaceState.update(
            CommitTracker.COMMITS_STG_KEY,
            this.commits
        )
    }

    getData() {
        const dateFormatted = `${this.currDate.getDate()}-${this.currDate.getMonth()}-${this.currDate.getFullYear()}`;
        return {
            currDate: dateFormatted,
            commits: this.commits
        }
    }
}