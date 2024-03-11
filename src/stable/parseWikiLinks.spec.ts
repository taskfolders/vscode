import { expect, describe, it } from 'vitest'
let $dev = console.log
import { Volume } from 'memfs'
import { parseWikiLinks } from './parseWikiLinks'

describe('x', () => {
  it('x', async () => {
    let text = `
    some text [[wiki]]
    some short [[:aws-practitioner]]
    with uid [[9223c2ee-1d5c-446e-ae8b-8024d66b11d9]]
    with local file [[./foo]]
    with local file [[./foo/index.md]]
    `
    let vol = Volume.fromJSON({ '/app/foo/index.md': 'hi' })
    let res = parseWikiLinks({ text, dir: '/app', fs: vol })
  })
})
