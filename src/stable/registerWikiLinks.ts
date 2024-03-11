import * as vscode from 'vscode'
import { parseWikiLinks } from './parseWikiLinks'
import { dirname } from 'path'

export function registerWikiLinks(context: vscode.ExtensionContext) {
  // let langs = vscode.languages.getLanguages().then(x => {
  //   console.log({ langs: x })
  // })
  // let conf = vscode.workspace.getConfiguration('markdown')

  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { language: 'markdown' },
      {
        provideDocumentLinks(
          document: vscode.TextDocument,
          token: vscode.CancellationToken,
        ): vscode.DocumentLink[] | Thenable<vscode.DocumentLink[]> {
          console.log('Register WikiLinks')
          const links: vscode.DocumentLink[] = []
          const text = document.getText()

          let dir = dirname(document.fileName)
          let all = parseWikiLinks({ text, dir })
          for (let item of all) {
            const startPos = document.positionAt(item.index + 2) // Add 2 to skip the [[
            const endPos = document.positionAt(
              item.index + item.text.length - 2,
            ) // Subtract 2 to skip the ]]

            const range = new vscode.Range(startPos, endPos)

            // Construct the URI for the wikilink
            const wikiLinkUri = vscode.Uri.parse(
              item.path,
              //`your-wiki-base-url/${pageName}.md`,
            ) // Customize the URL structure

            const link = new vscode.DocumentLink(range, wikiLinkUri)
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
