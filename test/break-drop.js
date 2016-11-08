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

$$ = instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x84\x80\x80\x80\x00\x03\x00\x00\x00\x07\x99\x80\x80\x80\x00\x03\x02\x62\x72\x00\x00\x05\x62\x72\x5f\x69\x66\x00\x01\x08\x62\x72\x5f\x74\x61\x62\x6c\x65\x00\x02\x0a\xaa\x80\x80\x80\x00\x03\x87\x80\x80\x80\x00\x00\x02\x40\x0c\x00\x0b\x0b\x89\x80\x80\x80\x00\x00\x02\x40\x41\x01\x0d\x00\x0b\x0b\x8a\x80\x80\x80\x00\x00\x02\x40\x41\x00\x0e\x00\x00\x0b\x0b");
assert_return(() => $$.exports["br"]());
assert_return(() => $$.exports["br_if"]());
assert_return(() => $$.exports["br_table"]());
