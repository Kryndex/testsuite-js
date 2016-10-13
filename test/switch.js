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

$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8f\x80\x80\x80\x00\x03\x40\x01\x01\x01\x01\x40\x01\x02\x01\x02\x40\x00\x01\x01\x03\x85\x80\x80\x80\x00\x04\x00\x01\x00\x02\x07\x9e\x80\x80\x80\x00\x04\x04\x73\x74\x6d\x74\x00\x00\x04\x65\x78\x70\x72\x00\x01\x03\x61\x72\x67\x00\x02\x06\x63\x6f\x72\x6e\x65\x72\x00\x03\x0a\xee\x81\x80\x80\x00\x04\xd7\x80\x80\x80\x00\x01\x01\x01\x10\xe4\x00\x15\x01\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x14\x00\x08\x08\x00\x01\x02\x03\x04\x05\x06\x08\x07\x0f\x14\x00\x09\x0f\x0a\x0f\x0f\x10\x00\x14\x00\x41\x15\x01\x06\x05\x0f\x06\x04\x0f\x10\xe5\x00\x15\x01\x06\x03\x0f\x10\xe5\x00\x15\x01\x0f\x10\xe6\x00\x15\x01\x0f\x0f\x14\x01\x09\x0f\xcc\x80\x80\x80\x00\x01\x01\x02\x11\xe4\x00\x15\x01\x01\x02\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x01\x00\x14\x00\xa1\x08\x08\x00\x01\x02\x03\x06\x05\x04\x08\x07\x0f\x14\x00\x09\x0f\x0a\x0f\x0f\x11\x00\x14\x00\x5c\x06\x05\x0f\x11\xe5\x00\x15\x01\x0f\x0f\x0f\x14\x01\x06\x01\x0f\x11\x7b\x0f\x09\x0f\xaa\x80\x80\x80\x00\x00\x01\x01\x10\x0a\x01\x01\x10\xe4\x00\x01\x01\x10\xe8\x07\x01\x01\x10\x02\x14\x00\x42\x10\x03\x14\x00\x47\x08\x03\x01\x02\x03\x00\x0f\x40\x0f\x40\x0f\x40\x0f\x09\x0f\x8c\x80\x80\x80\x00\x00\x01\x00\x10\x00\x08\x00\x00\x0f\x10\x01\x0f");
assert_return(() => $$.exports["stmt"](0), 0);
assert_return(() => $$.exports["stmt"](1), -1);
assert_return(() => $$.exports["stmt"](2), -2);
assert_return(() => $$.exports["stmt"](3), -3);
assert_return(() => $$.exports["stmt"](4), 100);
assert_return(() => $$.exports["stmt"](5), 101);
assert_return(() => $$.exports["stmt"](6), 102);
assert_return(() => $$.exports["stmt"](7), 100);
assert_return(() => $$.exports["stmt"](-10), 102);
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x01\x00\x11\x00\x16\x00\x11\x00\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("0")), int64("0"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x01\x00\x11\x01\x16\x00\x11\x7f\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("1")), int64("-1"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x01\x00\x11\x02\x16\x00\x11\x7e\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("2")), int64("-2"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x01\x00\x11\x03\x16\x00\x11\x7d\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("3")), int64("-3"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x98\x80\x80\x80\x00\x01\x92\x80\x80\x80\x00\x00\x01\x00\x11\x06\x16\x00\x11\xe5\x00\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("6")), int64("101"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x01\x00\x11\x07\x16\x00\x11\x7b\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("7")), int64("-5"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x98\x80\x80\x80\x00\x01\x92\x80\x80\x80\x00\x00\x01\x00\x11\x76\x16\x00\x11\xe4\x00\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["expr"](int64("-10")), int64("100"))
assert_return(() => $$.exports["arg"](0), 110);
assert_return(() => $$.exports["arg"](1), 12);
assert_return(() => $$.exports["arg"](2), 4);
assert_return(() => $$.exports["arg"](3), 1116);
assert_return(() => $$.exports["arg"](4), 118);
assert_return(() => $$.exports["arg"](5), 20);
assert_return(() => $$.exports["arg"](6), 12);
assert_return(() => $$.exports["arg"](7), 1124);
assert_return(() => $$.exports["arg"](8), 126);
assert_return(() => $$.exports["corner"](), 1);
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x00\x10\x00\x08\x00\x03\x0f");
