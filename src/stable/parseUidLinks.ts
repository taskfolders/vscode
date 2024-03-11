import { UidDatabase } from '../utils/UidDatabase'
export const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export function parseUidLinks(text: string) {
  let all = [...text.matchAll(new RegExp(uuidRegex, 'g'))]
  let db = UidDatabase.singleton()

  let acu: { index: number; uid: string; path: string }[] = []
  for (let match of all) {
    // console.log('Found uuid match', match)
    let uid = match[0]
    let pathFound = db.uidToPath[uid]
    if (pathFound) {
      acu.push({ index: match.index as number, uid, path: pathFound })
    } else {
      // acu.push({ index: match.index as number, uid, path: '-unknown-' })
    }
  }
  return acu
}
