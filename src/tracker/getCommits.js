import { getCurRepo } from "../utils/git.js";
import * as vscode from "vscode";

export class CommitTracker {
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

                    console.log(`Commits made today: ${todayCommits.length}`);
                    console.log('Today started at:', today);
                    // return todayCommits.length;
                    // prevOnCommit(ev);
                } catch (error) {
                    console.error("Failed to retrieve commits:", error);
                    return 0;
                }
            })
        });
    }
}