import * as vscode from 'vscode'

export class CustomLinkProvider implements vscode.CustomTextEditorProvider {
  private static readonly viewType = 'customLink.editor'

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new CustomLinkProvider(context)
    console.log('custom-register-provider')
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      CustomLinkProvider.viewType,
      provider,
    )

    return providerRegistration
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): void {
    console.log('...resolve')
    const content = document.getText()
    const linkedContent = this.linkifyCustomLinks(content)
    webviewPanel.webview.html = this.getHtmlForWebview(linkedContent)
  }
  private linkifyCustomLinks(content: string): string {
    // Regular expression to match custom links of the form mylink://some/path
    const linkRegex = /mylink:\/\/[^\s]+/g

    console.log({ content })
    return content.replace(linkRegex, match => {
      console.log({ match })
      return `<a href="${match}" target="_blank">${match}</a>`
    })
  }
  private getHtmlForWebview(content: string): string {
    console.log('...render-view')
    return `
      <html>
      <head></head>
      <body>
        <p>${content}</p>
      </body>
      </html>
    `
  }
}
