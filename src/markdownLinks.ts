import * as vscode from 'vscode'

function markdownLinks(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(document => {
      const editor = vscode.window.activeTextEditor
      console.log('Open document onDidOpenTextDocument', {
        file: document.fileName,
        langId: document.languageId,
        editor,
      })
      return
      if (isMarkdownDocument(document)) {
        console.log('Is md!')
        updateMarkdownLinks(document)
      }
    }),
  )

  // Register an onDidChangeTextDocument handler
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      if (isMarkdownDocument(event.document)) {
        updateMarkdownLinks(event.document)
      }
    }),
  )
  function isMarkdownDocument(document: vscode.TextDocument): boolean {
    console.log('Check if is md', { lang: document.languageId })
    if (document.languageId === 'markdown') return true

    // TODO before:release /tmp/foo.md seems to require this?
    // if (document.languageId === 'log') return true
    return false
  }

  function updateMarkdownLinks(document: vscode.TextDocument): void {
    const editor = vscode.window.activeTextEditor
    console.log('[MD] Update link', { file: document.fileName, editor })
    if (editor) {
      const text = document.getText()
      console.log({ text })

      // Define the link pattern you want to customize
      const customLinkPattern = /\[.*?\]\(https:\/\/example\.com\/.*?\)/g

      // Check if the document contains a link that matches the pattern
      if (customLinkPattern.test(text)) {
        console.log('Do here!!!!')
        // Modify the link behavior for the matching pattern
        editor.options = {
          ...editor.options,
          // @ts-expect-error TODO
          openCommand: {
            id: 'extension.openCustomLink',
          },
        }
      } else {
        // Reset to the default link behavior for other links
        editor.options = {
          ...editor.options,
          // @ts-expect-error TODO
          openCommand: {
            id: 'default:opener',
          },
        }
      }
    }
  }

  // --
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openCustomLink', url => {
      vscode.window.showInformationMessage(`Custom link clicked: ${url}`)
      // Implement your custom action here, e.g., open a specific URL
    }),
  )
  //
  const provider = vscode.workspace.registerTextDocumentContentProvider(
    'markdown',
    {
      provideTextDocumentContent(uri: vscode.Uri): string {
        const text = `You are viewing ${uri.toString()}`
        console.log({ see: text })
        return text
      },
    },
  )

  context.subscriptions.push(provider)
}
