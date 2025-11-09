export class LineWindow {

    constructor() {
        this.webview = null;
    }

    resolveWebviewView(webviewView) {
        this.webview = webviewView;
        webviewView.webview.options = { enableScripts: true };
        // initial placeholder; actual HTML will be set by extension.refresh(html)
        webviewView.webview.html = this.getHtmlPlaceholder();
        console.log("LineWindow webviewView", webviewView)
    }

    refresh(data) {
        if (!this.webview) return;
        try {
            // Accept full HTML string produced by the extension
            this.webview.webview.html = data || this.getHtmlPlaceholder();
        } catch (e) {
            console.error('Failed to set line webview HTML', e);
        }
    }
    getHtmlPlaceholder() {
        return `<!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>body{font-family:sans-serif;padding:12px;margin:0;color:#666}</style>
            </head>
            <body><div>Loading changes…</div></body>
            </html>`;
    }
}
