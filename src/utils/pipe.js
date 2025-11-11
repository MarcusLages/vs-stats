import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export function runPy(context, scriptPath, input = "", args = []) {
    return new Promise((res, rej) => {
        const pyProc = spawn(
            getVenvPython(context), 
            [scriptPath].concat(args),
            {
                // stdin, stdout, stderr
                stdio: ["pipe", "pipe", "pipe"],
                windowsHide: true
            }
        );

        let output = "";
        let errOutput = "";

        // Register res callback
        pyProc.stdout.on("data", data => output += data.toString() );
        pyProc.stderr.on("data", data => errOutput += data.toString() );
        pyProc.on("error", rej);
        pyProc.on("close", sign => {
            if (sign !== 0) {
                console.error("Python stderr:", errOutput.trim());
                rej(new Error("Python returned with error."))
            } else {
                // console.log(output.trim())
                res(output.trim())
            }
        })

        // Send to input pipe for python
        pyProc.stdin.write(input);
        pyProc.stdin.end();
    })
}

function getVenvPython(context) {
    // unix vs windows loation of venv python interpreter
    console.log(context)
    const base = path.join(context.extensionPath, ".venv");
    const unix = path.join(base, "bin", "python");
    const win = path.join(base, "Scripts", "python.exe");
    return process.platform === "win32" ? win : unix;
}