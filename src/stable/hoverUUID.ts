import * as vscode from 'vscode'
import * as fs from 'fs'
import { isUUID } from '../isUUID'

import { UidDatabase } from '../utils/UidDatabase'

export function hoverUUID(context: vscode.ExtensionContext) {
  console.log('DEBUG: hover provider')
  let db = new UidDatabase()
  db.load()
  let uidsMap = db.uidsMap
  let r1 = fs.readdirSync(process.env.HOME as string)
  console.log({ r1 })
  let disposable = vscode.languages.registerHoverProvider('*', {
    provideHover(document, position, token) {
      const hyphenatedWordRegex = /[\w\d-]+/g
      const range = document.getWordRangeAtPosition(
        position,
        hyphenatedWordRegex,
      )
      const word = document.getText(range)
      // console.log('DEBUG: hover!', { word, is: isUUID(word) })
      if (isUUID(word)) {
        let uid = word
        console.log('DEBUG: hover on UUID!')
        let link1 = `https://example.com/uuid/${word}`
        let link2 = 'vscode:///home/fgarcia/work/action/now/code-play/index.md'
        let uuidLink = 'file:///home/fgarcia/work/action/now/code-play/index.md'
        // return new vscode.Hover(
        //   `Open link ${uuidLink}\n${link1}\n${link2}\n\n[Open 1](file:///tmp/foo.md)\n\n[open 2](file:///home/fgarcia/work/action/now/code-play/index.md)`,
        // )
        let path = uidsMap[uid]
        console.log({ path, uid })
        return new vscode.Hover(`[Open](file://${path}) ${path}`)
      }
    },
  })

  context.subscriptions.push(disposable)
}
