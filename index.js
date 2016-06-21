const trace = curry2((msg, x) => {
  console.log(msg, x)
  return x
})

const traceP = curry2((msg, p) => {
  p.then(trace(msg))
  return p
})

const traceStack = curry2((msg, p) => {
  console.trace()
  return trace(msg, p)
})

trace.traceP = traceP
trace.traceStack = traceStack

module.trace = trace
module.traceP = traceP
module.traceStack = traceStack
module.exports = trace

// Helpers

function curry2(fn) {
  return (x, y) => y ? fn(x, y) : (y) => fn(x, y)
}
