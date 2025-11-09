export class WebWindow {

    constructor() {
        this.webview = null;
    }

    resolveWebviewView(webviewView) {
        this.webview = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtml("");
        console.log("webviewView" , webviewView)
    }

    refresh(snippet) {
        console.log(snippet)
        this.webview.webview.html = this.getHtml(snippet);
    }

    getHtml(snippet) {
        return `
            <!DOCTYPE html>
            <html>
                <body>
                    ${snippet}
                </body>
            </html>
        `;
    }
}