var Transform = require('readable-stream/transform')
var inherits = require('util').inherits

function normaliseArgs(start, end) {
  if (start && 'object' === typeof start 
    && !Buffer.isBuffer(start)) return start;

  var opts = {}
  if (start) opts.start = start
  if (end) opts.end = end
  return opts
}

function bufferize(str) {
  if (Buffer.isBuffer(str)) return str
  if ("string" === typeof str || "number" === typeof str)
    return new Buffer(str)
}

function Interpose(start, end) {
  if (!(this instanceof Interpose))
    return new Interpose(start, end)

  var opts = normaliseArgs(start, end)
  start = bufferize(opts.start)
  end = bufferize(opts.end)
  
  this._started = false
  this._start = start
  this._end = end

  Transform.call(this, opts)
}

inherits(Interpose, Transform)

module.exports = Interpose

Interpose.prototype._transform = function (chunk, enc, next) {
  if (!this._started) {
    if (this._start)
      chunk = Buffer.concat([this._start, chunk])
    this._started = true
  }

  next(null, chunk)
}

Interpose.prototype._flush = function () {
  if (this._end) this.push(this._end)
}

