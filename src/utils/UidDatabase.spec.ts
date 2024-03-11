import { expect, describe, it } from 'vitest'

import { UidDatabase } from './UidDatabase'

it('x', async () => {
  let sut = new UidDatabase()
  sut.load()
  $dev(sut)
})
