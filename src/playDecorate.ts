import * as vscode from 'vscode'
import { uuidRegex } from './extension'

function playDecorate(context: vscode.ExtensionContext) {
  {
    function decorateClickableLinks(
      editor: vscode.TextEditor,
      decorationType: vscode.TextEditorDecorationType,
    ) {
      console.log('Decorate--')
      if (editor) {
        const text = editor.document.getText()
        let linkRegex = uuidRegex
        linkRegex = /a8b8/

        const decorations: vscode.DecorationOptions[] = []
        let match
        // console.log({ text })
        while ((match = linkRegex.exec(text))) {
          console.log({ match })
          const [linkMatch] = match
          const startPos = editor.document.positionAt(match.index)
          const endPos = editor.document.positionAt(
            match.index + linkMatch.length,
          )

          const decoration = { range: new vscode.Range(startPos, endPos) }
          decorations.push(decoration)

          // Register a command for each clickable link
          context.subscriptions.push(
            vscode.commands.registerCommand(
              `extension.openLink.${decoration.range.start.line}.${decoration.range.start.character}`,
              () => {
                vscode.commands.executeCommand('extension.openLink', linkMatch)
              },
            ),
          )
        }
        console.log({ endMatch: match })

        editor.setDecorations(decorationType, decorations)
      }
    }

    // Register a command to open the clicked link
    context.subscriptions.push(
      vscode.commands.registerCommand('extension.openLink', url => {
        console.log('command open-link')
        vscode.env.openExternal(vscode.Uri.parse(url))
      }),
    )

    // Create a decoration type for clickable links
    const clickableLinkDecorationType =
      vscode.window.createTextEditorDecorationType({
        cursor: 'pointer',
        textDecoration: 'underline',
      })

    // Register an onChangeTextEditorSelection handler
    context.subscriptions.push(
      vscode.window.onDidChangeTextEditorSelection(event => {
        console.log('on did change text')
        const editor = event.textEditor
        if (editor) {
          decorateClickableLinks(editor, clickableLinkDecorationType)
        }
      }),
    )

    // Decorate clickable links initially
    vscode.window.visibleTextEditors.forEach(editor => {
      console.log('on visible textEditors')
      decorateClickableLinks(editor, clickableLinkDecorationType)
    })
  }
}
