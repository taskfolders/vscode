import { expect, describe, it } from 'vitest'

let sample = `
some 9223c2ee-1d5c-446e-ae8b-8024d66b11d9
and again
a [link](9223c2ee-1d5c-446e-ae8b-8024d66b11d9)
`
let $dev = console.log
let s2 =
  'some text \n\ntext fb72c953-4c50-4ddc-a8b8-d61ee1aa1a78 \n\nhttp://example.com\n\n[[PageName]]\n[[fb72c953-4c50-4ddc-a8b8-d61ee1aa1a78]]\n\nsee mylink://some/path\n\nmy [aws-practitioner](10122860-230f-4036-90cf-48ebdcca43bd)\n\njust plain 10122860-230f-4036-90cf-48ebdcca43bd\n\nand more'

import { UidDatabase } from '../utils/UidDatabase'
import { parseUidLinks, parseSidLinks } from './parseUidLinks'

describe('x', () => {
  it('x #todo', async () => {
    let res = parseUidLinks(sample)
    //$dev(res)
  })

  it('x', async () => {
    let sample = 'Some :work-dir not:foo or @work-dir when john@example.com'
    let res = parseSidLinks(sample)
  })
})
