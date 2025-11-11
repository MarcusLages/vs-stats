export class CommitWindow {

    constructor() {
        this.webview = null;
    }

    resolveWebviewView(webviewView) {
        this.webview = webviewView;
        webviewView.webview.options = { enableScripts: true };
        // initial placeholder; actual HTML will be set by extension.refresh(html)
        webviewView.webview.html = this.getHtmlPlaceholder();
        // console.log("CommitWindow webviewView", webviewView)
    }

    refresh(snippet) {
        if (!this.webview) return;
        try {
            // Accept full HTML string produced by the extension
            console.log(typeof(snippet))
            this.webview.webview.html = snippet || this.getHtmlPlaceholder();
        } catch (e) {
            console.error('Failed to set commit webview HTML', e);
        }
    }

    getHtmlPlaceholder() {
        return `<!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body><div>Loading commits…</div></body>
            </html>`;
    }
}