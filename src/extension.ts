// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as urlRegex from 'url-regex'
import { hoverUUID } from './hoverUUID'
import { decorateUUIDasLinks } from './decorateUUIDasLinks'
import { CustomLinkProvider } from './CustomLinkProvider'
import { registerUUIDLinks } from './registerUUIDLinks'
export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function play1(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openCustomLink', url => {
      const panel = vscode.window.createWebviewPanel(
        'customLink',
        'Custom Link',
        vscode.ViewColumn.Two,
        {},
      )

      // Handle link clicks in WebView
      panel.webview.onDidReceiveMessage(message => {
        vscode.window.showInformationMessage(
          `Clicked custom link: ${message.url}`,
        )
      })
      console.log('--here')

      // Load a simple HTML content with a link
      panel.webview.html = `
            <html>
            <body>
                <a href="${url}" onclick="vscode.postMessage({ url: '${url}' })">Open Custom Link</a>
            </body>
            </html>`
    }),
  )
}

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

  // {
  //   vscode.window.onDidChangeActiveTextEditor(editor => {
  //     console.log('Code change!')
  //     if (editor) {
  //       const disposable = vscode.commands.registerCommand(
  //         'extension.customLinkDetection',
  //         () => {
  //           console.log('Custom link detect')
  //           const selection = editor.selection
  //           const text = editor.document.getText(selection)
  //           const regex = /https?:\/\/[^\s]+/g
  //           const match = regex.exec(text)
  //           if (match) {
  //             vscode.env.openExternal(vscode.Uri.parse(match[0]))
  //           }
  //         },
  //       )
  //       context.subscriptions.push(disposable)
  //     }
  //   })
  // }

  // TODO top
  // hoverUUID(context)
  // playWiki_2(context)

  //markdownLinks(context)
  // play1(context)
  // playWiki(context)
  registerUUIDLinks(context)

  // this one bad!
  // playDecorate(context)

  // TODO this one good!
  // decorateUUIDasLinks(context)

  context.subscriptions.push(CustomLinkProvider.register(context))
  console.log('end')
}

// This method is called when your extension is deactivated
export function deactivate() {}

function playWiki_2(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { language: 'markdown' },
      {
        provideDocumentLinks(
          document: vscode.TextDocument,
          token: vscode.CancellationToken,
        ): vscode.DocumentLink[] | Thenable<vscode.DocumentLink[]> {
          const links: vscode.DocumentLink[] = []
          console.log({ links })
          const text = document.getText()

          // Use a regular expression to find smart wikilinks
          const wikilinkRegex = /\[\[([^\]]+)\]\]/g
          let match

          while ((match = wikilinkRegex.exec(text)) !== null) {
            console.log('Found wikilink', match)
            const startPos = document.positionAt(match.index + 2) // Add 2 to skip the [[
            const endPos = document.positionAt(
              match.index + match[0].length - 2,
            ) // Subtract 2 to skip the ]]

            const range = new vscode.Range(startPos, endPos)

            // Construct the URI for the wikilink
            const pageName = match[1]
            const wikilinkUri = vscode.Uri.parse(
              `your-wiki-base-url/${pageName}.md`,
            ) // Customize the URL structure

            const link = new vscode.DocumentLink(range, wikilinkUri)
            console.log({ link, vl: wikilinkUri.toString() })
            links.push(link)
          }

          return links
        },
        resolveDocumentLink(
          link: vscode.DocumentLink,
          token: vscode.CancellationToken,
        ): vscode.ProviderResult<vscode.DocumentLink> {
          // If needed, you can resolve additional information about the link here
          console.log({ resolveLink: link })
          return link
        },
      },
    ),
  )
}
