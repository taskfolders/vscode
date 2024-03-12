import { join } from 'path'
import { readFileSync } from 'fs'

// TODO bring official Read/View model types .. or sdk?
// import '@taskfolders/utils/markdown'

let singleton: UidDatabase

export class UidDatabase {
  uidToPath: Record<string, string> = {}
  sidToPath: Record<string, string> = {}

  static singleton() {
    if (!singleton) {
      singleton = new UidDatabase()
      singleton.load()
    }
    return singleton
  }

  //parsePathUids() {
  load() {
    let p1 = join(
      process.env.HOME,
      'Library/Application Support/TaskFolders.com',
    )
    let p2 = join(process.env.HOME, '.config/TaskFolders.com/db.json')

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
