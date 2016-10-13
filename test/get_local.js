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

$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\xb6\x80\x80\x80\x00\x0a\x40\x00\x01\x01\x40\x00\x01\x02\x40\x00\x01\x03\x40\x00\x01\x04\x40\x01\x01\x01\x01\x40\x01\x02\x01\x02\x40\x01\x03\x01\x03\x40\x01\x04\x01\x04\x40\x05\x02\x03\x04\x01\x01\x00\x40\x05\x02\x03\x04\x01\x01\x01\x04\x03\x8b\x80\x80\x80\x00\x0a\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x07\x9d\x81\x80\x80\x00\x0a\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x69\x33\x32\x00\x00\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x69\x36\x34\x00\x01\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x66\x33\x32\x00\x02\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x66\x36\x34\x00\x03\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x69\x33\x32\x00\x04\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x69\x36\x34\x00\x05\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x33\x32\x00\x06\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x36\x34\x00\x07\x0a\x74\x79\x70\x65\x2d\x6d\x69\x78\x65\x64\x00\x08\x04\x72\x65\x61\x64\x00\x09\x0a\xc6\x81\x80\x80\x00\x0a\x86\x80\x80\x80\x00\x01\x01\x01\x14\x00\x0f\x86\x80\x80\x80\x00\x01\x01\x02\x14\x00\x0f\x86\x80\x80\x80\x00\x01\x01\x03\x14\x00\x0f\x86\x80\x80\x80\x00\x01\x01\x04\x14\x00\x0f\x84\x80\x80\x80\x00\x00\x14\x00\x0f\x84\x80\x80\x80\x00\x00\x14\x00\x0f\x84\x80\x80\x80\x00\x00\x14\x00\x0f\x84\x80\x80\x80\x00\x00\x14\x00\x0f\xac\x80\x80\x80\x00\x03\x01\x03\x02\x02\x01\x04\x14\x00\xba\x0b\x14\x01\x7c\x0b\x14\x02\x90\x0b\x14\x03\x5a\x0b\x14\x04\x5a\x0b\x14\x05\x7c\x0b\x14\x06\xba\x0b\x14\x07\xba\x0b\x14\x08\x90\x0b\x0f\xbf\x80\x80\x80\x00\x03\x01\x03\x02\x02\x01\x04\x13\x00\x00\xb0\x40\x15\x05\x11\x06\x15\x06\x12\x00\x00\x00\x00\x00\x00\x20\x40\x15\x08\x14\x00\xb1\x14\x01\xb2\x14\x02\x14\x03\xaf\x14\x04\xae\x14\x05\xb2\x14\x06\xb1\x14\x07\xb1\x14\x08\x89\x89\x89\x89\x89\x89\x89\x89\x0f");
assert_return(() => $$.exports["type-local-i32"](), 0);
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x00\x00\x40\x00\x01\x02\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x95\x80\x80\x80\x00\x01\x8f\x80\x80\x80\x00\x00\x01\x00\x16\x00\x11\x00\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-local-i64"](), int64("0"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x00\x00\x40\x00\x01\x03\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x98\x80\x80\x80\x00\x01\x92\x80\x80\x80\x00\x00\x01\x00\x16\x00\x13\x00\x00\x00\x00\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-local-f32"](), 0.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x40\x00\x00\x40\x00\x01\x04\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9c\x80\x80\x80\x00\x01\x96\x80\x80\x80\x00\x00\x01\x00\x16\x00\x12\x00\x00\x00\x00\x00\x00\x00\x00\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-local-f64"](), 0.)
assert_return(() => $$.exports["type-param-i32"](2), 2);
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x02\x01\x02\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x01\x00\x11\x03\x16\x00\x11\x03\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-param-i64"](int64("3")), int64("3"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x03\x01\x03\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9d\x80\x80\x80\x00\x01\x97\x80\x80\x80\x00\x00\x01\x00\x13\xcd\xcc\x8c\x40\x16\x00\x13\xcd\xcc\x8c\x40\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-param-f32"](4.40000009537), 4.40000009537)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x40\x00\x00\x40\x01\x04\x01\x04\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa5\x80\x80\x80\x00\x01\x9f\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\x16\x40\x16\x00\x12\x00\x00\x00\x00\x00\x00\x16\x40\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-param-f64"](5.5), 5.5)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8c\x80\x80\x80\x00\x02\x40\x00\x00\x40\x05\x02\x03\x04\x01\x01\x00\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x74\x79\x70\x65\x2d\x6d\x69\x78\x65\x64\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa3\x80\x80\x80\x00\x01\x9d\x80\x80\x80\x00\x00\x01\x00\x11\x01\x13\xcd\xcc\x0c\x40\x12\x66\x66\x66\x66\x66\x66\x0a\x40\x10\x04\x10\x05\x16\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["type-mixed"](int64("1"), 2.20000004768, 3.3, 4, 5))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8d\x80\x80\x80\x00\x02\x40\x00\x00\x40\x05\x02\x03\x04\x01\x01\x01\x04\x02\x8b\x80\x80\x80\x00\x01\x02\x24\x24\x04\x72\x65\x61\x64\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x11\x01\x13\x00\x00\x00\x40\x12\x66\x66\x66\x66\x66\x66\x0a\x40\x10\x04\x10\x05\x16\x00\x12\x66\x66\x66\x66\x66\x66\x41\x40\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["read"](int64("1"), 2., 3.3, 4, 5), 34.8)
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x00\x01\x02\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8c\x80\x80\x80\x00\x01\x86\x80\x80\x80\x00\x01\x01\x01\x14\x00\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x01\x01\x03\x14\x00\x5a\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8f\x80\x80\x80\x00\x01\x89\x80\x80\x80\x00\x02\x01\x04\x01\x02\x14\x01\x90\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x40\x01\x01\x01\x02\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8a\x80\x80\x80\x00\x01\x84\x80\x80\x80\x00\x00\x14\x00\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x01\x03\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x14\x00\x5a\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x40\x02\x04\x02\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x14\x01\x90\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x02\x01\x01\x01\x02\x14\x03\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x02\x01\x01\x01\x02\x14\xf7\xa4\xea\x06\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x40\x02\x01\x02\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8a\x80\x80\x80\x00\x01\x84\x80\x80\x80\x00\x00\x14\x02\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x02\x01\x01\x01\x02\x14\xf7\xf2\xce\xd4\x02\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x01\x01\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x02\x01\x01\x01\x02\x14\x03\x0f");
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x40\x01\x02\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x02\x01\x01\x01\x02\x14\xf7\xa8\x99\x66\x0f");
