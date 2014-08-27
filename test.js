#!/usr/bin/env node

var desc = require('macchiato')
var Interpose = require('./')
var stream = require('readable-stream')
var Writable = stream.Writable;
var Readable = stream.Readable;

desc('Interpose!', function () {
  
  desc.beforeEach(function () {
    var data = this.data = 'some test data'

    this.setup = function (callback) {
      this.readable = new Readable()
      this.readable._read = function () {
        this.push(data)
        this.push(null)
      }

      this.writable = new Writable()
      this.writable._write = function (chunk, enc, next) {
        callback && callback(chunk)
        next()
      }
    }
  })

  desc.it('Should just pass-through', function (t) {
    t.setup(function (chunk) {
      t.equals(chunk.toString('utf8'), t.data)
      t.end()
    })

    t.readable
      .pipe(new Interpose())
      .pipe(t.writable)
  })
  
  desc.it('Should prepend starting string if specified', function (t) {
    var start = 'more than just '
    var expected = start + t.data

    t.setup(function (chunk) {
      t.equals(chunk.toString('utf8'), expected)
      t.end()
    })

    t.readable
      .pipe(new Interpose(start))
      .pipe(t.writable)
  })

  desc.it('Should append ending string if specified', function (t) {
    var end = ' for testing'
    var expected = t.data + end
    var buf = ''
    var i = 0

    t.setup(function (chunk) {
      buf += chunk

      if (++i === 2) {
        t.equals(buf, expected)
        t.end()
      }
    })

    t.readable
      .pipe(new Interpose(null, end))
      .pipe(t.writable)
  })

  desc.it('Should prepend and append', function (t) {
    var start = 'more than just '
    var end = ' for testing'
    var expected = start + t.data + end
    var buf = ''
    var i = 0

    t.setup(function (chunk) {
      buf += chunk

      if (++i === 2) {
        t.equals(buf, expected)
        t.end()
      }
    })

    t.readable
      .pipe(new Interpose(start, end))
      .pipe(t.writable)
  })

  desc.it('Should work when supplied buffers', function (t) {
    var start = 'more than just '
    var end = ' for testing'
    var expected = start + t.data + end
    var buf = ''
    var i = 0

    t.setup(function (chunk) {
      buf += chunk

      if (++i === 2) {
        t.equals(buf, expected)
        t.end()
      }
    })
    
    t.readable
      .pipe(new Interpose(new Buffer(start), new Buffer(end)))
      .pipe(t.writable)
  })
})

