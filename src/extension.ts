// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as urlRegex from 'url-regex'
import { hoverUUID } from './stable/hoverUUID'
import { decorateUUIDasLinks } from './decorateUUIDasLinks'
import { CustomLinkProvider } from './CustomLinkProvider'
import { registerUUIDLinks } from './stable/registerUUIDLinks'
import { registerWikiLinks } from './stable/registerWikiLinks'
import { MemFS } from './tmp/MemFS'
import { UidDatabase } from './utils/UidDatabase'

// TODO replace by tf-std lib
// import {isUUID} from '@taskfolders/utils/regex/UUID'
export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const outputChannel = vscode.window.createOutputChannel('TaskFolders Output')

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

function linkifyUUIDs() {
  throw Error('boom')
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
  // console.log(context.subscriptions)
  console.error('Activate TF')

  {
    let d1 = vscode.commands.registerCommand(
      'TaskFolders.reload-database',
      () => {
        let db = UidDatabase.singleton()
        db.load()
        vscode.window.showInformationMessage('TaskFolders database reloaded')
      },
    )
    context.subscriptions.push(d1)
  }

  // ----
  {
    console.log('DEBUG: register linkify')
    // Register a command to transform UUIDs into clickable links
    let d3 = vscode.commands.registerCommand('TaskFolders.linkifyUUIDs', () => {
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
  //markdownLinks(context)
  // play1(context)
  // playWiki(context)

  outputChannel.appendLine('TaskFolders channel started')

  registerUUIDLinks(context)
  registerWikiLinks(context)

  // this one bad!
  // playDecorate(context)

  // TODO this one good!
  // decorateUUIDasLinks(context)

  context.subscriptions.push(CustomLinkProvider.register(context))

  play(context)

  // vscode.commands.executeCommand('vscode.executeLinkProvider').then(links => {
  //   console.log({ result: links })
  // })
  // let r1 = vscode.commands.executeCommand('vscode.executeLinkProvider')
}

function play(context: vscode.ExtensionContext) {
  class Panda {
    readFile(uri: any) {
      console.log({ uri })
      return new Uint8Array(
        Buffer.from('Hello, this is a custom file content!', 'utf-8'),
      )
    }

    onDidChangeFile() {
      console.log('change !!!!')
      return new vscode.Disposable(() => {})
    }

    readDirectory() {
      console.log('read dir!!!!')
      return []
    }
    writeFile(uri, content, options) {
      // Save the content of the file
      console.log(`Writing to ${uri.path}`)
      console.log(`Content: ${content.toString()}`)
      return Promise.resolve()
    }

    delete(uri, options) {
      // Delete the file
      console.log(`Deleting ${uri.path}`)
      return Promise.resolve()
    }

    createDirectory(uri) {
      // Create a directory (not supported in this example)
      return Promise.reject('Creating directories is not supported.')
    }

    rename(oldUri, newUri, options) {
      // Rename the file (not supported in this example)
      return Promise.reject('Renaming files is not supported.')
    }
    watch() {
      console.log('wa!!!!')
      return new vscode.Disposable(() => {})
    }
    stat() {
      console.log('Stat!!!!')
      return null
    }
  }
  //let memFs = new Panda()
  let memFs = new MemFS()
  memFs.writeFile(vscode.Uri.parse(`memfs:/file.txt`), Buffer.from('foo'), {
    create: true,
    overwrite: true,
  })
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider('memfs', memFs, {
      isCaseSensitive: false,
    }),
  )
  // vscode.window.registerUriHandler({})
  const disposable = vscode.window.registerUriHandler({
    handleUri(uri) {
      // Customize the link handling logic
      console.log('Custom link handling:', uri)
      vscode.window.showInformationMessage(`Opening custom link: ${uri.path}`)
    },
  })
}

// This method is called when your extension is deactivated
export function deactivate() {}
