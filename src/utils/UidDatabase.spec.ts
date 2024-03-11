import { expect, describe, it } from 'vitest'

import { UidDatabase } from './UidDatabase'

it('x #todo #scaffold #live', async () => {
  let sut = new UidDatabase()
  sut.load()
  //$dev(sut)
})

it.skip('x ', async () => {
  let sut = new UidDatabase()
  sut.load()
  //$dev(sut)
})
