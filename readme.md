# Interpose

Install:
```bash
$ npm install --save interpose
```

Interpose streamed data between a `start` or `end` token.

### new Interpose(start, end) | new Interpose({ start: start, end: end })

The constructor can take start and end tokens or an options object containing stream options and start and end 

Using is simple:

```javascript
var Interpose = require('interpose')
var wrap = new Interpose('wrap ', ' up')

inputStream.end('some data')

inputStream
  .pipe(wrap)
  .pipe(process.stdout)
  // -> 'wrap some data up'

```
