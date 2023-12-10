// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as urlRegex from 'url-regex'
import { hoverUUID } from './hoverUUID'
export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

console.log('Hello world!')
export function isUUID(str: string) {
  return uuidRegex.test(str)
}

function linkifyUUIDs() {
  console.log('DEBUG: doing links')
  // Get the active text editor
  const editor = vscode.window.activeTextEditor

  if (editor) {
    // Get the selected text or the entire document
    const selection = editor.selection
    const text = selection.isEmpty
      ? editor.document.getText()
      : editor.document.getText(selection)

    // Regular expression to match UUIDs
    const uuidRegex = /\b([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/gi

    // Replace UUIDs with clickable links
    const transformedText = text.replace(uuidRegex, (_, uuid) => {
      const link = `[${uuid}](https://example.com/uuid/${uuid})`
      return link
    })

    // Replace the text in the editor
    editor.edit(editBuilder => {
      if (selection.isEmpty) {
        const documentStart = new vscode.Position(0, 0)
        const documentEnd = new vscode.Position(
          editor.document.lineCount - 1,
          0,
        )
        editBuilder.replace(
          new vscode.Range(documentStart, documentEnd),
          transformedText,
        )
      } else {
        editBuilder.replace(selection, transformedText)
      }
    })
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-play" is now active!')

  let d1 = vscode.commands.registerCommand('code-play.playHello', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from code-play 2!')
  })
  context.subscriptions.push(d1)

  {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
      'code-play.helloWorld',
      () => {
        console.log('DEBUG: inside hello')
        console.log('This is a log message')
        console.warn('This is a warning message')
        console.error('This is an error message')
        vscode.window.showInformationMessage('This is an information message')
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage(
          'Hello World from code-play MODIFIED 2!',
        )
      },
    )

    context.subscriptions.push(disposable)
  }

  // ----
  {
    console.log('DEBUG: register linkify')
    // Register a command to transform UUIDs into clickable links
    let d3 = vscode.commands.registerCommand('code-play.linkifyUUIDs', () => {
      linkifyUUIDs()
    })

    // Add the command to the extension's context
    context.subscriptions.push(d3)
  }

  {
    let disposable = hoverUUID()
    context.subscriptions.push(disposable)
  }

  {
    vscode.window.onDidChangeActiveTextEditor(editor => {
      console.log('Code change!')
      if (editor) {
        const disposable = vscode.commands.registerCommand(
          'extension.customLinkDetection',
          () => {
            console.log('Custom link detect')
            const selection = editor.selection
            const text = editor.document.getText(selection)
            const regex = /https?:\/\/[^\s]+/g
            const match = regex.exec(text)
            if (match) {
              vscode.env.openExternal(vscode.Uri.parse(match[0]))
            }
          },
        )
        context.subscriptions.push(disposable)
      }
    })
  }

  // playDecorate(context)
}

// This method is called when your extension is deactivated
export function deactivate() {}
