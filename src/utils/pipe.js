import { spawn } from "child_process";
import path from "path";

export function runPy(scriptPath, input = "", args = []) {
    return new Promise((res, rej) => {
        const pyProc = spawn(
            getVenvPython(), 
            [scriptPath].concat(args),
            {
                // stdin, stdout, stderr
                stdio: ["pipe", "pipe", "inherit"]
            }
        );

        let output = "";

        // Register res callback
        pyProc.stdout.on("data", data => output += data.toString() );
        pyProc.on("error", rej);
        pyProc.on("close", sign => {
            if (sign !== 0) {
                rej(new Error("Python returned with error."))
            } else {
                console.log(output.trim())
                res(output.trim())
            }
        })

        // Send to input pipe for python
        pyProc.stdin.write(input);
        pyProc.stdin.end();
    })
}

function getVenvPython() {
    // unix vs windows loation of venv python interpreter
    const base = path.join(process.cwd(), ".venv");
    const unix = path.join(base, "bin", "python");
    const win = path.join(base, "Scripts", "python.exe");
    return process.platform === "win32" ? win : unix;
}