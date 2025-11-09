export class LineWindow {

    constructor() {
        this.webview = null;
    }

    resolveWebviewView(webviewView) {
        this.webview = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtml("");
        console.log("LineWindow webviewView", webviewView)
    }

    refresh(snippet) {
        console.log("Refreshing LineWindow with snippet:", snippet)
        if (this.webview) {
            this.webview.webview.html = this.getHtml(snippet);
        }
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
