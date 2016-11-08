'use strict';

let soft_validate = true;

let spectest = {
  print: print || ((...xs) => console.log(...xs)),
  global: 666,
  table: new WebAssembly.Table({initial: 10, maximum: 20, element: 'anyfunc'}),  memory: new WebAssembly.Memory({initial: 1, maximum: 2}),};

let registry = {spectest};
let $$;

function register(name, instance) {
  registry[name] = instance.exports;
}

function module(bytes) {
  let buffer = new ArrayBuffer(bytes.length);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; ++i) {
    view[i] = bytes.charCodeAt(i);
  }
  return new WebAssembly.Module(buffer);
}

function instance(bytes, imports = registry) {
  return new WebAssembly.Instance(module(bytes), imports);
}

function assert_malformed(bytes) {
  try { module(bytes) } catch (e) {
    if (e instanceof WebAssembly.CompileError) return;
  }
  throw new Error("Wasm decoding failure expected");
}

function assert_invalid(bytes) {
  try { module(bytes) } catch (e) {
    if (e instanceof WebAssembly.CompileError) return;
  }
  throw new Error("Wasm validation failure expected");
}

function assert_soft_invalid(bytes) {
  try { module(bytes) } catch (e) {
    if (e instanceof WebAssembly.CompileError) return;
    throw new Error("Wasm validation failure expected");
  }
  if (soft_validate)
    throw new Error("Wasm validation failure expected");
}

function assert_unlinkable(bytes) {
  let mod = module(bytes);
  try { new WebAssembly.Instance(mod, registry) } catch (e) {
    if (e instanceof TypeError) return;
  }
  throw new Error("Wasm linking failure expected");
}

function assert_uninstantiable(bytes) {
  let mod = module(bytes);
  try { new WebAssembly.Instance(mod, registry) } catch (e) {
    if (e instanceof WebAssembly.RuntimeError) return;
  }
  throw new Error("Wasm trap expected");
}

function assert_trap(action) {
  try { action() } catch (e) {
    if (e instanceof WebAssembly.RuntimeError) return;
  }
  throw new Error("Wasm trap expected");
}

function assert_return(action, expected) {
  let actual = action();
  if (!Object.is(actual, expected)) {
    throw new Error("Wasm return value " + expected + " expected, got " + actual);
  };
}

function assert_return_nan(action) {
  let actual = action();
  if (!Number.isNaN(actual)) {
    throw new Error("Wasm return value NaN expected, got " + actual);
  };
}

$$ = instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7f\x00\x02\x92\x80\x80\x80\x00\x01\x08\x73\x70\x65\x63\x74\x65\x73\x74\x05\x70\x72\x69\x6e\x74\x00\x00\x03\x83\x80\x80\x80\x00\x02\x00\x00\x05\x83\x80\x80\x80\x00\x01\x00\x01\x07\x8e\x80\x80\x80\x00\x02\x04\x67\x6f\x6f\x64\x00\x01\x03\x62\x61\x64\x00\x02\x0a\xf4\x80\x80\x80\x00\x02\xdd\x80\x80\x80\x00\x00\x20\x00\x2d\x00\x00\x10\x00\x20\x00\x2d\x00\x01\x10\x00\x20\x00\x2d\x00\x02\x10\x00\x20\x00\x2d\x00\x19\x10\x00\x20\x00\x2f\x01\x00\x10\x00\x20\x00\x2f\x00\x00\x10\x00\x20\x00\x2f\x00\x01\x10\x00\x20\x00\x2f\x01\x02\x10\x00\x20\x00\x2f\x00\x19\x10\x00\x20\x00\x28\x02\x00\x10\x00\x20\x00\x28\x00\x01\x10\x00\x20\x00\x28\x01\x02\x10\x00\x20\x00\x28\x00\x19\x10\x00\x0b\x8c\x80\x80\x80\x00\x00\x20\x00\x28\x02\xff\xff\xff\xff\x0f\x1a\x0b\x0b\xa0\x80\x80\x80\x00\x01\x00\x41\x00\x0b\x1a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a");
$$.exports["good"](0);
$$.exports["good"](65507);
assert_trap(() => $$.exports["good"](65508));
assert_trap(() => $$.exports["bad"](0));
assert_trap(() => $$.exports["bad"](1));
