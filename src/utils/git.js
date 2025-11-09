import * as vscode from "vscode";

const GIT_VERSION = 1;

// ! DO NOT SAVE GIT OR THE REPO
//   They are dynamically stored
export async function getGitExtension() {
    const gitExtension = vscode.extensions.getExtension('vscode.git');
    if (!gitExtension) {
        console.log("Git extension not found")
        return undefined;
    }
    if (!gitExtension.isActive) {
        await gitExtension.activate();
    }

    return gitExtension.exports.getAPI(GIT_VERSION); 
}

// ! DO NOT SAVE GIT OR THE REPO
//   They are dynamically stored
export async function getCurRepo() {
    const gitExt = await getGitExtension();

    // wait until at least one repository is ready
    if (gitExt.repositories.length === 0) {
        console.log("Waiting for Git repositories to be detected...");
        await new Promise(resolve => {
            const disposable = gitExt.onDidOpenRepository(repo => {
                disposable.dispose();
                resolve();
            });
        });
    }
    return gitExt.repositories[0];
}