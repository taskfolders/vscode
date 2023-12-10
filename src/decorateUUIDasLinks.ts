import * as vscode from 'vscode'

export function decorateUUIDasLinks(context: vscode.ExtensionContext) {
  let uglyIds = {} as any

  // Create a decoration type for clickable links
  const clickableLinkDecorationType =
    vscode.window.createTextEditorDecorationType({
      cursor: 'pointer',
      textDecoration: 'underline',
    })

  // Register an onDidChangeTextDocument handler
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      const editor = vscode.window.activeTextEditor
      if (editor) {
        decorateClickableLinks(editor, clickableLinkDecorationType)
      }
    }),
  )

  // Decorate clickable links initially
  vscode.window.visibleTextEditors.forEach(editor => {
    decorateClickableLinks(editor, clickableLinkDecorationType)
  })

  // ----
  function decorateClickableLinks(
    editor: vscode.TextEditor,
    decorationType: vscode.TextEditorDecorationType,
  ) {
    if (editor) {
      const text = editor.document.getText()
      const uuidRegex = /\b([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/gi

      const decorations: vscode.DecorationOptions[] = []
      let match
      while ((match = uuidRegex.exec(text))) {
        const [uuidMatch] = match
        const startPos = editor.document.positionAt(match.index)
        const endPos = editor.document.positionAt(
          match.index + uuidMatch.length,
        )

        const decoration = { range: new vscode.Range(startPos, endPos) }
        decorations.push(decoration)

        // Register a command for each clickable UUID
        // Generate a unique command key for each clickable UUID
        const commandKey = `code-play.openUUID.${decoration.range.start.line}.${decoration.range.start.character}`
        console.log('Register command... TODO', { commandKey })
        if (!uglyIds[commandKey]) {
          console.warn('ugly hack')
          // Register a command for each clickable UUID
          context.subscriptions.push(
            vscode.commands.registerCommand(commandKey, () => {
              vscode.commands.executeCommand('code-play.openUUID', uuidMatch)
            }),
          )
          uglyIds[commandKey] = true
        }

        // context.subscriptions.push(
        //   vscode.commands.registerCommand(
        //     `code-play.openUUID.${decoration.range.start.line}.${decoration.range.start.character}`,
        //     () => {
        //       vscode.commands.executeCommand('code-play.openUUID', uuidMatch)
        //     },
        //   ),
        // )
      }

      editor.setDecorations(decorationType, decorations)
    }
  }
}
