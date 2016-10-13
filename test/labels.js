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

$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8a\x80\x80\x80\x00\x02\x40\x00\x01\x01\x40\x01\x01\x01\x01\x03\x92\x80\x80\x80\x00\x11\x00\x00\x00\x00\x01\x00\x00\x00\x01\x01\x00\x00\x00\x00\x00\x00\x00\x07\x92\x81\x80\x80\x00\x11\x05\x62\x6c\x6f\x63\x6b\x00\x00\x05\x6c\x6f\x6f\x70\x31\x00\x01\x05\x6c\x6f\x6f\x70\x32\x00\x02\x05\x6c\x6f\x6f\x70\x33\x00\x03\x05\x6c\x6f\x6f\x70\x34\x00\x04\x05\x6c\x6f\x6f\x70\x35\x00\x05\x02\x69\x66\x00\x06\x03\x69\x66\x32\x00\x07\x06\x73\x77\x69\x74\x63\x68\x00\x08\x06\x72\x65\x74\x75\x72\x6e\x00\x09\x06\x62\x72\x5f\x69\x66\x30\x00\x0a\x06\x62\x72\x5f\x69\x66\x31\x00\x0b\x06\x62\x72\x5f\x69\x66\x32\x00\x0c\x06\x62\x72\x5f\x69\x66\x33\x00\x0d\x02\x62\x72\x00\x0e\x09\x73\x68\x61\x64\x6f\x77\x69\x6e\x67\x00\x0f\x0c\x72\x65\x64\x65\x66\x69\x6e\x69\x74\x69\x6f\x6e\x00\x10\x0a\xb6\x86\x80\x80\x00\x11\x8b\x80\x80\x80\x00\x00\x01\x01\x10\x01\x06\x00\x10\x00\x0f\x0f\xa3\x80\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x01\x01\x02\x01\x14\x00\x10\x01\x40\x15\x00\x14\x00\x10\x05\x4d\x03\x00\x14\x00\x06\x02\x0f\x06\x00\x0f\x0f\x0f\xb4\x80\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x01\x01\x02\x01\x14\x00\x10\x01\x40\x15\x00\x14\x00\x10\x05\x4d\x03\x00\x06\x01\x0f\x14\x00\x10\x08\x4d\x03\x00\x14\x00\x06\x02\x0f\x14\x00\x10\x01\x40\x15\x00\x06\x00\x0f\x0f\x0f\xa3\x80\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x01\x01\x02\x01\x14\x00\x10\x01\x40\x15\x00\x14\x00\x10\x05\x4d\x03\x00\x14\x00\x06\x02\x0f\x14\x00\x0f\x0f\x0f\xa3\x80\x80\x80\x00\x01\x01\x01\x10\x01\x15\x01\x01\x01\x02\x01\x14\x01\x14\x01\x40\x15\x01\x14\x01\x14\x00\x55\x03\x00\x14\x01\x06\x02\x0f\x06\x00\x0f\x0f\x0f\x8a\x80\x80\x80\x00\x00\x02\x01\x10\x01\x0f\x10\x01\x40\x0f\x84\x81\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x01\x00\x10\x01\x03\x00\x06\x00\x10\x9a\x05\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x01\x03\x00\x06\x00\x10\x9a\x05\x15\x00\x04\x10\xf8\x06\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x01\x03\x00\x06\x00\x10\x9a\x05\x15\x00\x04\x10\xf8\x06\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x00\x03\x00\x10\xf8\x06\x15\x00\x04\x06\x00\x10\x9a\x05\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x00\x03\x00\x10\xf8\x06\x15\x00\x04\x06\x00\x10\x9a\x05\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x0f\x14\x00\x0f\x84\x81\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x01\x00\x10\x01\x03\x00\x06\x00\x10\x9a\x05\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x01\x03\x00\x06\x00\x10\x9a\x05\x15\x00\x04\x10\xf8\x06\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x01\x03\x00\x06\x00\x10\x9a\x05\x15\x00\x04\x10\xf8\x06\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x00\x03\x00\x10\xf8\x06\x15\x00\x04\x06\x00\x10\x9a\x05\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x10\x00\x03\x00\x10\xf8\x06\x15\x00\x04\x06\x00\x10\x9a\x05\x15\x00\x0f\x14\x00\x10\x01\x40\x15\x00\x0f\x14\x00\x0f\xad\x80\x80\x80\x00\x00\x01\x01\x10\x0a\x01\x01\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x14\x00\x08\x04\x04\x00\x01\x02\x03\x0f\x0f\x10\x02\x06\x03\x0f\x10\x03\x06\x03\x0f\x0f\x10\x05\x0f\x42\x0f\x0f\x98\x80\x80\x80\x00\x00\x01\x00\x01\x00\x01\x00\x14\x00\x08\x01\x00\x01\x06\x02\x0f\x10\x00\x09\x0f\x0f\x10\x02\x0f\xd6\x80\x80\x80\x00\x01\x01\x01\x10\x00\x15\x00\x01\x01\x01\x00\x10\x00\x07\x00\x14\x00\x10\x01\x48\x15\x00\x10\x01\x07\x00\x14\x00\x10\x02\x48\x15\x00\x0f\x01\x01\x14\x00\x10\x04\x48\x15\x00\x14\x00\x0f\x10\x00\x07\x00\x0b\x14\x00\x10\x08\x48\x15\x00\x01\x01\x14\x00\x10\x10\x48\x15\x00\x14\x00\x0f\x10\x01\x07\x00\x0b\x14\x00\x10\x20\x48\x15\x00\x14\x00\x0f\x0f\x93\x80\x80\x80\x00\x00\x01\x01\x01\x01\x10\x01\x06\x00\x0f\x10\x01\x07\x00\x0b\x10\x01\x0f\x0f\x95\x80\x80\x80\x00\x00\x01\x01\x10\x01\x03\x00\x01\x01\x10\x01\x06\x00\x0f\x06\x01\x0f\x10\x01\x0f\x0f\xa4\x80\x80\x80\x00\x01\x01\x01\x01\x01\x01\x01\x10\x01\x15\x00\x14\x00\x0f\x01\x01\x10\x02\x15\x00\x14\x00\x0f\x07\x00\x0b\x10\x00\x0f\x10\x00\x40\x0b\x14\x00\x0f\xa1\x80\x80\x80\x00\x00\x01\x01\x10\x01\x03\x00\x01\x01\x10\x01\x06\x00\x0f\x06\x01\x04\x01\x00\x01\x01\x10\x01\x06\x00\x0f\x0b\x0f\x0f\x10\x01\x0f\x0f\x8c\x80\x80\x80\x00\x00\x01\x01\x10\x01\x06\x00\x10\x02\x49\x0f\x0f\x92\x80\x80\x80\x00\x00\x01\x01\x01\x01\x10\x02\x0f\x01\x01\x10\x03\x06\x00\x0f\x40\x0f\x0f");
assert_return(() => $$.exports["block"](), 1);
assert_return(() => $$.exports["loop1"](), 5);
assert_return(() => $$.exports["loop2"](), 8);
assert_return(() => $$.exports["loop3"](), 1);
assert_return(() => $$.exports["loop4"](8), 16);
assert_return(() => $$.exports["loop5"](), 2);
assert_return(() => $$.exports["if"](), 5);
assert_return(() => $$.exports["if2"](), 5);
assert_return(() => $$.exports["switch"](0), 50);
assert_return(() => $$.exports["switch"](1), 20);
assert_return(() => $$.exports["switch"](2), 20);
assert_return(() => $$.exports["switch"](3), 3);
assert_return(() => $$.exports["switch"](4), 50);
assert_return(() => $$.exports["switch"](5), 50);
assert_return(() => $$.exports["return"](0), 0);
assert_return(() => $$.exports["return"](1), 2);
assert_return(() => $$.exports["return"](2), 2);
assert_return(() => $$.exports["br_if0"](), 29);
assert_return(() => $$.exports["br_if1"](), 1);
assert_return(() => $$.exports["br_if2"](), 1);
assert_return(() => $$.exports["br_if3"](), 2);
assert_return(() => $$.exports["br"](), 1);
assert_return(() => $$.exports["shadowing"](), 1);
assert_return(() => $$.exports["redefinition"](), 5);
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x01\x00\x10\x01\x07\x00\x7c\x0a\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x00\x10\x01\x07\x00\x0f\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x00\x10\x01\x07\x00\x0f\x0f");
