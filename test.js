'use strict'

/* eslint-env jest */

const TimeSeries = require('./index.js')

describe('test time series database', () => {
  describe('with unexpired data', () => {
    const timeSeries = new TimeSeries(1000)

    beforeAll(() => {
      timeSeries.enqueue({ data: 1 })
      timeSeries.enqueue({ data: 2 })
      timeSeries.enqueue({ data: 3 })
      timeSeries.enqueue({ data: 4 })
    })

    it('returns an average of 2', () =>
      expect(timeSeries.average(`data`)).toBe(2.5))

    it('returns an minimum of 1', () =>
      expect(timeSeries.minimum(`data`)).toBe(1))

    it('returns an maximum of 4', () =>
      expect(timeSeries.maximum(`data`)).toBe(4))
  })

  describe('with expired data', () => {
    const timeSeries = new TimeSeries(10)

    beforeAll(async () => {
      timeSeries.enqueue({ data: 1 })
      timeSeries.enqueue({ data: 2 })
      timeSeries.enqueue({ data: 3 })
      timeSeries.enqueue({ data: 4 })
      await timeout(20)
    })

    it('returns an undefined average', () =>
      expect(timeSeries.average(`data`)).toBeUndefined())

    it('returns an undefined  minimum', () =>
      expect(timeSeries.minimum(`data`)).toBeUndefined())

    it('returns an undefined maximum', () =>
      expect(timeSeries.maximum(`data`)).toBeUndefined())
  })

  describe('with partially expired data', () => {
    const timeSeries = new TimeSeries(1000)

    beforeAll(async () => {
      timeSeries.enqueue({ data: 1 })
      timeSeries.enqueue({ data: 2 })
      await timeout(2000)
      timeSeries.enqueue({ data: 3 })
      timeSeries.enqueue({ data: 4 })
    })

    it('returns an average of 3.5', () =>
      expect(timeSeries.average(`data`)).toBe(3.5))

    it('returns a minumum of 3', () =>
      expect(timeSeries.minimum(`data`)).toBe(3))

    it('returns a maximum of 4', () =>
      expect(timeSeries.maximum(`data`)).toBe(4))
  })

  describe('with a large set', () => {
    const timeSeries = new TimeSeries(1000000)
    it('performs in', () => {
      for (let i = 0; i < 1000000; i++) {
        timeSeries.enqueue({ data: i })
      }
      expect(timeSeries.minimum(`data`)).toBeDefined()
      expect(timeSeries.maximum(`data`)).toBeDefined()
      expect(timeSeries.average(`data`)).toBeDefined()
    })
  })
})

async function timeout (time) {
  return new Promise(resolve =>
    setTimeout(() => resolve(), time))
}
