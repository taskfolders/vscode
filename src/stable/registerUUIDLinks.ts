import * as vscode from 'vscode'
import { parseUidLinks } from './parseUidLinks'

export function registerUUIDLinks(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      {
        scheme: 'file',
        //language: 'markdown'
        language: '*',
      },
      {
        provideDocumentLinks(
          document: vscode.TextDocument,
          token: vscode.CancellationToken,
        ): vscode.DocumentLink[] | Thenable<vscode.DocumentLink[]> {
          const links: vscode.DocumentLink[] = []
          const text = document.getText()
          let all = parseUidLinks(text)
          console.log({ all, text })

          for (let item of all) {
            //console.log('Found uuid match', match)
            const startPos = document.positionAt(item.index + 0) // Add 2 to skip the [[
            const endPos = document.positionAt(item.index + item.uid.length - 0) // Subtract 2 to skip the ]]

            const range = new vscode.Range(startPos, endPos)

            // Construct the URI for the wikilink
            //const pageName = match[0]
            let linkUri = vscode.Uri.parse(
              item.path,
              //`your-wiki-base-url/${pageName}.md`,
            ) // Customize the URL structure

            let lineNumber
            if (lineNumber) {
              linkUri = linkUri.with({ fragment: `L${lineNumber}` })
            }
            const link = new vscode.DocumentLink(range, linkUri)
            // console.log({ linkL: link.target, vl: wikilinkUri.toString() })
            links.push(link)
          }

          console.log({ links })
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
