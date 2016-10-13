'use strict';

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
  try { module(bytes) } catch (e) { return }
  throw new Error("Wasm decoding failure expected");
}

function assert_invalid(bytes) {
  try { module(bytes) } catch (e) { return }
  throw new Error("Wasm validation failure expected");
}

function assert_unlinkable(bytes) {
  let mod = module(bytes);
  try { new WebAssembly.Instance(mod, registry) } catch (e) { return }
  throw new Error("Wasm linking failure expected");
}

function assert_trap(action) {
  try { action() } catch (e) { return }
  throw new Error("Wasm trap expected");
}

function assert_return(action, expected) {
  let actual = action();
  if (actual !== expected) {
    throw new Error("Wasm return value " + expected + " expected, got " + actual);
  };
}

function assert_return_nan(action) {
  let actual = action();
  if (!Number.isNaN(actual)) {
    throw new Error("Wasm return value NaN expected, got " + actual);
  };
}

assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x08\x81\x80\x80\x80\x00\x01\x0a\x88\x80\x80\x80\x00\x01\x82\x80\x80\x80\x00\x00\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x08\x81\x80\x80\x80\x00\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x10\x00\x09\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x01\x01\x00\x03\x82\x80\x80\x80\x00\x01\x00\x08\x81\x80\x80\x80\x00\x00\x0a\x88\x80\x80\x80\x00\x01\x82\x80\x80\x80\x00\x00\x0f");
$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x00\x00\x40\x00\x01\x01\x03\x84\x80\x80\x80\x00\x03\x00\x01\x00\x05\x84\x80\x80\x80\x00\x01\x01\x01\x01\x07\x8d\x80\x80\x80\x00\x02\x03\x69\x6e\x63\x00\x00\x03\x67\x65\x74\x00\x01\x08\x81\x80\x80\x80\x00\x02\x0a\xaf\x80\x80\x80\x00\x03\x8f\x80\x80\x80\x00\x00\x10\x00\x10\x00\x21\x00\x00\x10\x01\x40\x2e\x00\x00\x0f\x88\x80\x80\x80\x00\x00\x10\x00\x21\x00\x00\x09\x0f\x88\x80\x80\x80\x00\x00\x16\x00\x16\x00\x16\x00\x0f\x0b\x87\x80\x80\x80\x00\x01\x00\x10\x00\x0f\x01\x41");
assert_return(() => $$.exports["get"](), 68);
$$.exports["inc"]();
assert_return(() => $$.exports["get"](), 69);
$$.exports["inc"]();
assert_return(() => $$.exports["get"](), 70);
$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x00\x00\x40\x00\x01\x01\x03\x84\x80\x80\x80\x00\x03\x00\x01\x00\x05\x84\x80\x80\x80\x00\x01\x01\x01\x01\x07\x8d\x80\x80\x80\x00\x02\x03\x69\x6e\x63\x00\x00\x03\x67\x65\x74\x00\x01\x08\x81\x80\x80\x80\x00\x02\x0a\xaf\x80\x80\x80\x00\x03\x8f\x80\x80\x80\x00\x00\x10\x00\x10\x00\x21\x00\x00\x10\x01\x40\x2e\x00\x00\x0f\x88\x80\x80\x80\x00\x00\x10\x00\x21\x00\x00\x09\x0f\x88\x80\x80\x80\x00\x00\x16\x00\x16\x00\x16\x00\x0f\x0b\x87\x80\x80\x80\x00\x01\x00\x10\x00\x0f\x01\x41");
assert_return(() => $$.exports["get"](), 68);
$$.exports["inc"]();
assert_return(() => $$.exports["get"](), 69);
$$.exports["inc"]();
assert_return(() => $$.exports["get"](), 70);
$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x01\x01\x00\x40\x00\x00\x02\x92\x80\x80\x80\x00\x01\x08\x73\x70\x65\x63\x74\x65\x73\x74\x05\x70\x72\x69\x6e\x74\x00\x00\x03\x82\x80\x80\x80\x00\x01\x01\x08\x81\x80\x80\x80\x00\x01\x0a\x8c\x80\x80\x80\x00\x01\x86\x80\x80\x80\x00\x00\x10\x01\x16\x00\x0f");
$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x01\x01\x00\x40\x00\x00\x02\x92\x80\x80\x80\x00\x01\x08\x73\x70\x65\x63\x74\x65\x73\x74\x05\x70\x72\x69\x6e\x74\x00\x00\x03\x82\x80\x80\x80\x00\x01\x01\x08\x81\x80\x80\x80\x00\x01\x0a\x8c\x80\x80\x80\x00\x01\x86\x80\x80\x80\x00\x00\x10\x02\x16\x00\x0f");
