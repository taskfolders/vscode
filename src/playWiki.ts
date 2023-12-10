import * as vscode from 'vscode'

function playWiki(context: vscode.ExtensionContext) {
  // Register an onDidChangeTextEditorSelection handler
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(event => {
      const editor = vscode.window.activeTextEditor
      if (editor && isMarkdownDocument(editor.document)) {
        provideSmartWikilinks(editor)
      }
    }),
  )

  function isMarkdownDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'markdown'
  }

  function provideSmartWikilinks(editor: vscode.TextEditor) {
    const selection = editor.selection
    const selectedText = editor.document.getText(selection).trim()

    // Check if the selected text looks like a wikilink
    if (selectedText.startsWith('[[') && selectedText.endsWith(']]')) {
      const pageName = selectedText.substring(2, selectedText.length - 2)
      const wikilinkUri = `your-wiki-base-url/${pageName}.md` // Customize the URL structure based on your setup

      vscode.window.showInformationMessage(`Smart Wikilink: ${wikilinkUri}`)
      // Open the wikilink in the editor or WebView as needed
      // Example: vscode.commands.executeCommand('markdown.showPreviewToSide', vscode.Uri.file(wikilinkUri));
    }
  }
}
