# debug.trace

A small trace utility that allows debugging info to be printed from
any function pipeline.

### Why not just console.log?

I'm lazy. It takes a few seconds to convert some arrow functions into
a form that allows `console.log`.

For example,

```js
const add = (x, y) => x + y

// What was x and y?
// I have to modify the add function with curly braces and a return.
const add = (x, y) => {
  console.log('x', x)
  console.log('y', y)
  return x + y
}

// Or with trace I can leave everything inline, and still have the same effect.
const add = (x, y) => trace('x')(x) + trace('y')(y)

// Can even trace the result before returning.
const add = (x, y) => trace('result')(trace('x')(x) + trace('y')(y))
```

If you use compose from [Ramda](http://ramdajs.com) or [Lodash](https://lodash.com/), then you 
can simply sprinkle `trace`s throughout the pipeline.

```js
const R = require('ramda')
const trace = require('debug.trace')

const f = R.compose(trace('result'), R.multiply(2), trace('before multiply'), R.subtract(R.__, 1))
f(10) // prints "before multiply 9", "result 18", then returns 18
``` 

### Usage

Install module:

```
npm install debug.trace
```

Use in code:

```js
const trace = require('trace')

const x = 1
trace('what is x?')(1) // prints 'what is x? 1'
```

You can also import to globals automatically.

```js
require('trace/global')

trace(...)
```

### API

`trace :: String -> A -> A`

Prints a message and value, then return the original value. Arguments are curried.

```js
const trace = require('debug.trace')
trace('Hello', 'World') // => 'Hello World' is printed
trace('Hello')('World') // => 'Hello World' is printed
trace('x', 'y') === 'y' // true
```

---

`traceP :: String -> Promise A -> Promise A`

Prints a message and resolved promise value, then return the promise. Arguments are curried.

```js
const traceP = require('debug.trace').traceP
traceP('Hello', Promise.resolve('World')) // => 'Hello World' is printed
traceP('Hello')(Promise.resolve('World')) // => 'Hello World' is printed
traceP('x', Promise.resolve('y')).then((a) => a === 'y') //resolves to true
```

---

`traceStack :: String -> A -> A`

Prints a message and value, then prints the stack trace, and returns original value. Arguments are curried.

```js
const traceStack = require('debug.trace').traceStack
traceStack('Hello', 'World') // => 'Hello World' is printed
// stack trace is printed
traceStack('Hello')('World') // => 'Hello World' is printed
// stack trace is printed
traceStack('x', 'y') === 'y' // true
// stack trace is printed
```
