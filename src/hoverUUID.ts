import * as vscode from 'vscode'
import * as fs from 'fs'
import { isUUID } from './extension'

import { join } from 'path'
import { readFileSync } from 'fs'

function parsePathUids() {
  let path = join(
    // @ts-expect-error TODO
    process.env.HOME,
    '.config/TaskFolders.com/db.json',
  )
  let data = JSON.parse(readFileSync(path).toString()) as {
    paths: {
      uid: any
      contentIds: { uids: any }
    }[]
  }

  let uids = {} as any
  Object.entries(data.paths).map(([path, value]) => {
    uids[value.uid] = path

    let con = value.contentIds?.uids
    if (con) {
      console.log('TODO')
      // $dev(value)
    }
  })
  return uids
}

export function hoverUUID(context: vscode.ExtensionContext) {
  console.log('DEBUG: hover provider')
  let uidsMap = parsePathUids()
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
