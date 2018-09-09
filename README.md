Time Series Buffer
-----------------

Simple library that takes into account data points and calculates minimums, maximums and averages.

The buffer is limited in age. Expired entries are removed.

Example
-------

```js
const TimeSeriesBuffer = require('time-series-buffer')

// entries older than 1 second will be ignored
const timeSeriesBuffer = new TimeSeriesBuffer(1000)

timeSeriesBuffer.enqueue({ x: 1 })
timeSeriesBuffer.enqueue({ x: 2, y: 10 })
timeSeriesBuffer.enqueue({ x: 3, y: 20 })

timeSeriesBuffer.average('x') // 2
timeSeriesBuffer.minimum('x') // 1
timeSeriesBuffer.maximum('y') // 20
timeSeriesBuffer.maximum('z') // undefined

// wait 2 seconds for the data points to expire
setTimeout(() => {
    timeSeriesBuffer.average('x') // undefined
}, 2000)
```
