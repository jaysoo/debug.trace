const test = require('tape')
const sinon = require('sinon')
const R = require('ramda')
const trace = require('./')
const traceP = trace.traceP
const traceStack = trace.traceStack
const traceStackP = trace.traceStackP

const __ = '__'

test('trace (logging)', (assert) => {
  const log = sinon.spy(console, 'log')

  trace('Hello')('World')

  assert.equal(log.getCall(0).args[0], 'Hello', 'curries first argument')
  assert.equal(log.getCall(0).args[1], 'World', 'curries second argument')

  log.reset()

  trace('Hello', 'World')

  assert.equal(log.getCall(0).args[0], 'Hello', 'calls with first argument')
  assert.equal(log.getCall(0).args[1], 'World', 'calls with second argument')

  assert.end()
  log.restore()
})

test('trace (return value)', (assert) => {
  const log = sinon.spy(console, 'log')
  assert.equal(trace(__, 'hello'), 'hello')
  assert.equal(trace(__, '123'), '123')
  log.restore()
  assert.end()
})

test('traceP (logging)', (assert) => {
  const log = sinon.spy(console, 'log')

  traceP('Hello')(Promise.resolve('World'))

  setTimeout(() => {
    assert.equal(log.getCall(0).args[0], 'Hello', 'curries first argument')
    assert.equal(log.getCall(0).args[1], 'World', 'curries second argument')

    log.reset()

    traceP('Hello', Promise.resolve('World'))

    setTimeout(() => {

      assert.equal(log.getCall(0).args[0], 'Hello', 'calls with first argument')
      assert.equal(log.getCall(0).args[1], 'World', 'calls with second argument')

      assert.end()
      log.restore()
    })
  })
})


test('traceP (resolve value)', (assert) => {
  const log = sinon.spy(console, 'log')
  const p1 = Promise.resolve('hello')
  const p2 = Promise.resolve('123')
  assert.equal(traceP(__, p1), p1)
  assert.equal(traceP(__, p2), p2)
  setTimeout(() => {
    log.restore()
    assert.end()
  })
})

test('traceStack', (assert) => {
  const log = sinon.spy(console, 'log')
  const trace = sinon.stub(console, 'trace')

  traceStack('x', 'y')
  assert.ok(trace.called, 'calls console.trace')

  log.restore()
  trace.restore()
  assert.end()
})

test('with ramda', (assert) => {
  const log = sinon.spy(console, 'log')

  const f = R.compose(R.multiply(2), trace('x'), R.subtract(R.__, 1))
  const g = R.composeP(x => x * 2, trace('x'), x => Promise.resolve(x - 1))

  assert.equal(f(1), 0, 'returns value')
  assert.equal(log.getCall(0).args[0], 'x', 'calls with message')
  assert.equal(log.getCall(0).args[1], 0, 'calls with value')

  log.reset()

  assert.equal(f(2), 2, 'returns value')
  assert.equal(log.getCall(0).args[0], 'x', 'calls with message')
  assert.equal(log.getCall(0).args[1], 1, 'calls with value')


  log.reset()

  g(2).then((x) => {
    assert.equal(x, 2, 'resolves value')
    assert.equal(log.getCall(0).args[0], 'x', 'calls with message')
    assert.equal(log.getCall(0).args[1], 1, 'calls with value')

    log.restore()
    assert.end()
  })
})
