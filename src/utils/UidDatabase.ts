import { join } from 'path'
import { readFileSync } from 'fs'

let single: UidDatabase

export class UidDatabase {
  uidToPath: Record<string, string> = {}
  sidToPath: Record<string, string> = {}

  static singleton() {
    if (!single) {
      single = new UidDatabase()
      single.load()
    }
    return single
  }

  //parsePathUids() {
  load() {
    let path = join(process.env.HOME, '.config/TaskFolders.com/db.json')
    console.log('Loading TaskFolders uid database', path)
    let data = JSON.parse(readFileSync(path).toString()) as {
      uids: Record<string, { path: string }>
      sids: Record<string, string>
      // paths: {
      //   uid: any
      //   sid: any
      //   contentIds: { uids: any }
      // } []
    }

    let uids = {} as any
    Object.entries(data.uids).map(([uid, value]) => {
      uids[uid] = value.path

      // TODO #now
      // if (value.sid) {
      //   sids[value.sid] = path
      // }

      // TODO #now
      // let con = value.contentIds?.uids
      // if (con) {
      //   // $dev(value)
      // }
    })

    let sids = {} as any
    Object.entries(data.sids).map(([sid, uid]) => {
      let val = data.uids[uid]
      sids[sid] = val.path
    })

    this.uidToPath = uids
    this.sidToPath = sids
  }
}
