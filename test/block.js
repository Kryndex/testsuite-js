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

$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x00\x00\x40\x00\x01\x01\x03\x90\x80\x80\x80\x00\x0f\x00\x00\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x07\xbe\x81\x80\x80\x00\x0e\x05\x65\x6d\x70\x74\x79\x00\x01\x08\x73\x69\x6e\x67\x75\x6c\x61\x72\x00\x02\x05\x6d\x75\x6c\x74\x69\x00\x03\x06\x6e\x65\x73\x74\x65\x64\x00\x04\x04\x64\x65\x65\x70\x00\x05\x10\x61\x73\x2d\x75\x6e\x61\x72\x79\x2d\x6f\x70\x65\x72\x61\x6e\x64\x00\x06\x11\x61\x73\x2d\x62\x69\x6e\x61\x72\x79\x2d\x6f\x70\x65\x72\x61\x6e\x64\x00\x07\x0f\x61\x73\x2d\x74\x65\x73\x74\x2d\x6f\x70\x65\x72\x61\x6e\x64\x00\x08\x12\x61\x73\x2d\x63\x6f\x6d\x70\x61\x72\x65\x2d\x6f\x70\x65\x72\x61\x6e\x64\x00\x09\x0a\x62\x72\x65\x61\x6b\x2d\x62\x61\x72\x65\x00\x0a\x0b\x62\x72\x65\x61\x6b\x2d\x76\x61\x6c\x75\x65\x00\x0b\x0e\x62\x72\x65\x61\x6b\x2d\x72\x65\x70\x65\x61\x74\x65\x64\x00\x0c\x0b\x62\x72\x65\x61\x6b\x2d\x69\x6e\x6e\x65\x72\x00\x0d\x07\x65\x66\x66\x65\x63\x74\x73\x00\x0e\x0a\x99\x84\x80\x80\x00\x0f\x82\x80\x80\x80\x00\x00\x0f\x88\x80\x80\x80\x00\x00\x01\x00\x0f\x01\x00\x0f\x0f\x8b\x80\x80\x80\x00\x00\x01\x00\x0a\x0f\x01\x01\x10\x07\x0f\x0f\x98\x80\x80\x80\x00\x00\x01\x00\x16\x00\x16\x00\x16\x00\x16\x00\x0f\x01\x01\x16\x00\x16\x00\x16\x00\x10\x08\x0f\x0f\x95\x80\x80\x80\x00\x00\x01\x01\x01\x00\x16\x00\x01\x00\x0f\x0a\x0f\x01\x01\x16\x00\x10\x09\x0f\x0f\x0f\xf9\x80\x80\x80\x00\x00\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x16\x00\x10\x96\x01\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x8a\x80\x80\x80\x00\x00\x01\x01\x16\x00\x10\x0d\x0f\x58\x0f\x91\x80\x80\x80\x00\x00\x01\x01\x16\x00\x10\x03\x0f\x01\x01\x16\x00\x10\x04\x0f\x42\x0f\x8a\x80\x80\x80\x00\x00\x01\x01\x16\x00\x10\x0d\x0f\x5a\x0f\x97\x80\x80\x80\x00\x00\x01\x03\x16\x00\x13\x00\x00\x40\x40\x0f\x01\x03\x16\x00\x13\x00\x00\x40\x40\x0f\x87\x0f\xa6\x80\x80\x80\x00\x00\x01\x00\x06\x00\x00\x0f\x01\x00\x10\x01\x07\x00\x00\x0f\x01\x00\x10\x00\x08\x00\x00\x00\x0f\x01\x00\x10\x01\x08\x02\x00\x00\x00\x00\x0f\x10\x13\x0f\x8b\x80\x80\x80\x00\x00\x01\x01\x10\x12\x06\x00\x10\x13\x0f\x0f\xb1\x80\x80\x80\x00\x00\x01\x01\x10\x12\x06\x00\x10\x13\x06\x00\x10\x14\x10\x00\x07\x00\x0b\x10\x14\x10\x01\x07\x00\x0b\x10\x15\x06\x00\x10\x16\x10\x04\x08\x00\x00\x10\x17\x10\x01\x08\x02\x00\x00\x00\x10\x15\x0f\x0f\xc5\x80\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x14\x00\x01\x01\x01\x01\x10\x01\x06\x01\x0f\x0f\x40\x15\x00\x14\x00\x01\x01\x01\x00\x06\x00\x0f\x10\x02\x0f\x40\x15\x00\x14\x00\x01\x01\x10\x04\x06\x00\x58\x0f\x40\x15\x00\x14\x00\x01\x01\x01\x01\x10\x08\x06\x01\x0f\x58\x0f\x40\x15\x00\x14\x00\x0f\xaf\x80\x80\x80\x00\x01\x01\x01\x01\x00\x10\x01\x15\x00\x14\x00\x10\x03\x42\x15\x00\x14\x00\x10\x05\x41\x15\x00\x14\x00\x10\x07\x42\x15\x00\x06\x00\x14\x00\x10\xe4\x00\x42\x15\x00\x0f\x14\x00\x10\x72\x4d\x0f");
assert_return(() => $$.exports["empty"]());
assert_return(() => $$.exports["singular"](), 7);
assert_return(() => $$.exports["multi"](), 8);
assert_return(() => $$.exports["nested"](), 9);
assert_return(() => $$.exports["deep"](), 150);
assert_return(() => $$.exports["as-unary-operand"](), 0);
assert_return(() => $$.exports["as-binary-operand"](), 12);
assert_return(() => $$.exports["as-test-operand"](), 0);
assert_return(() => $$.exports["as-compare-operand"](), 0);
assert_return(() => $$.exports["break-bare"](), 19);
assert_return(() => $$.exports["break-value"](), 18);
assert_return(() => $$.exports["break-repeated"](), 18);
assert_return(() => $$.exports["break-inner"](), 15);
assert_return(() => $$.exports["effects"](), 1);
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x01\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x02\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x01\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x03\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x01\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x04\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x01\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x00\x01\x00\x10\x01\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8c\x80\x80\x80\x00\x01\x86\x80\x80\x80\x00\x00\x01\x00\x0a\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x00\x01\x01\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8f\x80\x80\x80\x00\x01\x89\x80\x80\x80\x00\x00\x01\x01\x06\x00\x10\x01\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x01\x00\x0a\x06\x00\x10\x01\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x01\x00\x11\x01\x06\x00\x10\x01\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x00\x01\x00\x0a\x06\x00\x10\x01\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x93\x80\x80\x80\x00\x01\x8d\x80\x80\x80\x00\x00\x01\x00\x11\x01\x06\x00\x10\x01\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x01\x01\x01\x01\x10\x01\x06\x01\x0f\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x01\x00\x01\x00\x06\x01\x0f\x10\x01\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x95\x80\x80\x80\x00\x01\x8f\x80\x80\x80\x00\x00\x01\x00\x01\x00\x0a\x06\x01\x0f\x10\x01\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x96\x80\x80\x80\x00\x01\x90\x80\x80\x80\x00\x00\x01\x00\x01\x00\x11\x01\x06\x01\x0f\x10\x01\x06\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x00\x01\x00\x06\x00\x0f\x58\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8f\x80\x80\x80\x00\x01\x89\x80\x80\x80\x00\x00\x01\x00\x0a\x06\x00\x0f\x73\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x01\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x01\x00\x11\x09\x06\x00\x0f\x73\x0f");
