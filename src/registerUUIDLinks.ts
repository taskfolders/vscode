import * as vscode from 'vscode'

export const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

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

          let all = text.matchAll(new RegExp(uuidRegex, 'g'))

          for (let match of all) {
            console.log('Found uuid match', match)
            const startPos = document.positionAt(match.index + 0) // Add 2 to skip the [[
            const endPos = document.positionAt(
              match.index + match[0].length - 0,
            ) // Subtract 2 to skip the ]]

            const range = new vscode.Range(startPos, endPos)

            // Construct the URI for the wikilink
            const pageName = match[0]
            const wikilinkUri = vscode.Uri.parse(
              `your-wiki-base-url/${pageName}.md`,
            ) // Customize the URL structure

            const link = new vscode.DocumentLink(range, wikilinkUri)
            console.log({ linkL: link.target, vl: wikilinkUri.toString() })
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
