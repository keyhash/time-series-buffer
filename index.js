'use strict'

class TimeSeriesBuffer {
  /**
   * Creates a new time series
   *
   * @param {Number} ttl time to live of the items enqueued in the time series
   */
  constructor (ttl = 60000) {
    this.ttl = ttl
    this._buffer = []
  }

  enqueue (item) {
    if (typeof item !== 'object') {
      throw new Error('Enqueued data must be an object.')
    }

    if (Object.keys(item) === 0) {
      // Skip object without data
      return
    }

    this._buffer.push({
      date: new Date().getTime(),
      item
    })
  }

  forEach (cb) {
    const now = new Date().getTime()
    for (let i = this._buffer.length - 1; i >= 0; i--) {
      const e = this._buffer[i]
      if (now - e.date > this.ttl) {
        this._buffer.splice(0, i)
        return
      }
      cb(e.item)
    }
  }

  minimum (key) {
    let minimum = Number.MAX_SAFE_INTEGER
    this.forEach(e => (minimum = Math.min(minimum, e[key])))
    return minimum !== Number.MAX_SAFE_INTEGER
      ? minimum
      : undefined
  }

  maximum (key) {
    let maximum = Number.MIN_SAFE_INTEGER
    this.forEach(e => (maximum = Math.max(maximum, e[key])))
    return maximum !== Number.MIN_SAFE_INTEGER
      ? maximum
      : undefined
  }

  average (key) {
    let sum = 0
    let count = 0
    this.forEach(e => {
      sum += e[key]
      count++
    })
    return count > 0
      ? sum / count
      : undefined
  }
}

module.exports = TimeSeriesBuffer
