import { isUUID } from '../isUUID'
import { UidDatabase } from '../utils/UidDatabase'
import nodeFS from 'node:fs'
import { join } from 'node:path'
let $dev = console.log

export function parseWikiLinks(kv: { text: string; dir: string; fs?: any }) {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
  let all = kv.text.matchAll(wikiLinkRegex)
  let db = UidDatabase.singleton()
  let fs: typeof nodeFS = kv.fs ?? nodeFS

  let acu: { text: string; index: number; path: string }[] = []
  for (let ma of all) {
    let link = ma[1].trim()
    if (isUUID(link)) {
      let path = db.uidToPath[link]
      if (path) {
        acu.push({ text: ma[0], index: ma.index as number, path })
      }
    } else if (link.startsWith(':')) {
      let path = db.sidToPath[link.slice(1)]
      if (path) {
        acu.push({ text: ma[0], index: ma.index as number, path })
      }
    } else if (link.startsWith('.')) {
      let path = join(kv.dir, link)
      if (fs.existsSync(path)) {
        let stat = fs.statSync(path)
        if (stat.isDirectory()) {
          path = join(path, 'index.md')
        }
        acu.push({ text: ma[0], index: ma.index as number, path })
      }
    }
  }
  return acu
}
