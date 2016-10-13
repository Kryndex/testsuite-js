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

$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\xa2\x80\x80\x80\x00\x05\x40\x03\x01\x01\x01\x01\x01\x40\x03\x02\x02\x01\x01\x02\x40\x03\x03\x03\x01\x01\x03\x40\x03\x04\x04\x01\x01\x04\x40\x01\x01\x01\x01\x03\x87\x80\x80\x80\x00\x06\x00\x01\x02\x03\x04\x04\x07\xd5\x80\x80\x80\x00\x06\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x33\x32\x00\x00\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x02\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x03\x0d\x73\x65\x6c\x65\x63\x74\x5f\x74\x72\x61\x70\x5f\x6c\x00\x04\x0d\x73\x65\x6c\x65\x63\x74\x5f\x74\x72\x61\x70\x5f\x72\x00\x05\x0a\xd3\x80\x80\x80\x00\x06\x89\x80\x80\x80\x00\x00\x14\x00\x14\x01\x14\x02\x05\x0f\x89\x80\x80\x80\x00\x00\x14\x00\x14\x01\x14\x02\x05\x0f\x89\x80\x80\x80\x00\x00\x14\x00\x14\x01\x14\x02\x05\x0f\x89\x80\x80\x80\x00\x00\x14\x00\x14\x01\x14\x02\x05\x0f\x88\x80\x80\x80\x00\x00\x00\x10\x00\x14\x00\x05\x0f\x88\x80\x80\x80\x00\x00\x10\x00\x00\x14\x00\x05\x0f");
assert_return(() => $$.exports["select_i32"](1, 2, 1), 1);
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x02\x02\x01\x01\x02\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9b\x80\x80\x80\x00\x01\x95\x80\x80\x80\x00\x00\x01\x00\x11\x02\x11\x01\x10\x01\x16\x00\x11\x02\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_i64"](int64("2"), int64("1"), 1), int64("2"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x80\x3f\x13\x00\x00\x00\x40\x10\x01\x16\x00\x13\x00\x00\x80\x3f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](1., 2., 1), 1.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x12\x00\x00\x00\x00\x00\x00\x00\x40\x10\x01\x16\x00\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](1., 2., 1), 1.)
assert_return(() => $$.exports["select_i32"](1, 2, 0), 2);
assert_return(() => $$.exports["select_i32"](2, 1, 0), 1);
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x02\x02\x01\x01\x02\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9b\x80\x80\x80\x00\x01\x95\x80\x80\x80\x00\x00\x01\x00\x11\x02\x11\x01\x10\x7f\x16\x00\x11\x02\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_i64"](int64("2"), int64("1"), -1), int64("2"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x02\x02\x01\x01\x02\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9f\x80\x80\x80\x00\x01\x99\x80\x80\x80\x00\x00\x01\x00\x11\x02\x11\x01\x10\xf0\xe1\xc3\x87\x7f\x16\x00\x11\x02\x68\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_i64"](int64("2"), int64("1"), -252645136), int64("2"))
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\xc0\x7f\x13\x00\x00\x80\x3f\x10\x01\x16\x00\x13\x00\x00\xc0\x7f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x04\x03\x82\x7f\x13\x00\x00\x80\x3f\x10\x01\x16\x00\x13\x04\x03\x82\x7f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\xc0\x7f\x13\x00\x00\x80\x3f\x10\x00\x16\x00\x13\x00\x00\x80\x3f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x04\x03\x82\x7f\x13\x00\x00\x80\x3f\x10\x00\x16\x00\x13\x00\x00\x80\x3f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x40\x13\x00\x00\xc0\x7f\x10\x01\x16\x00\x13\x00\x00\x00\x40\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x40\x13\x04\x03\x82\x7f\x10\x01\x16\x00\x13\x00\x00\x00\x40\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x40\x13\x00\x00\xc0\x7f\x10\x00\x16\x00\x13\x00\x00\xc0\x7f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 0), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x03\x03\x01\x01\x03\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa4\x80\x80\x80\x00\x01\x9e\x80\x80\x80\x00\x00\x01\x00\x13\x00\x00\x00\x40\x13\x04\x03\x82\x7f\x10\x00\x16\x00\x13\x04\x03\x82\x7f\x83\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 0), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\xf8\x7f\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x10\x01\x16\x00\x12\x00\x00\x00\x00\x00\x00\xf8\x7f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x04\x03\x02\x00\x00\x00\xf0\x7f\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x10\x01\x16\x00\x12\x04\x03\x02\x00\x00\x00\xf0\x7f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\xf8\x7f\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x10\x00\x16\x00\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x04\x03\x02\x00\x00\x00\xf0\x7f\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x10\x00\x16\x00\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\x00\x40\x12\x00\x00\x00\x00\x00\x00\xf8\x7f\x10\x01\x16\x00\x12\x00\x00\x00\x00\x00\x00\x00\x40\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\x00\x40\x12\x04\x03\x02\x00\x00\x00\xf0\x7f\x10\x01\x16\x00\x12\x00\x00\x00\x00\x00\x00\x00\x40\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\x00\x40\x12\x00\x00\x00\x00\x00\x00\xf8\x7f\x10\x00\x16\x00\x12\x00\x00\x00\x00\x00\x00\xf8\x7f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 0), NaN)
instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x40\x00\x00\x40\x03\x04\x04\x01\x01\x04\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb0\x80\x80\x80\x00\x01\xaa\x80\x80\x80\x00\x00\x01\x00\x12\x00\x00\x00\x00\x00\x00\x00\x40\x12\x04\x03\x02\x00\x00\x00\xf0\x7f\x10\x00\x16\x00\x12\x04\x03\x02\x00\x00\x00\xf0\x7f\x97\x5a\x07\x00\x09\x0f\x00\x0f", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 0), NaN)
assert_trap(() => $$.exports["select_trap_l"](1));
assert_trap(() => $$.exports["select_trap_l"](0));
assert_trap(() => $$.exports["select_trap_r"](1));
assert_trap(() => $$.exports["select_trap_r"](0));
assert_invalid("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x40\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x00\x0a\x0a\x10\x01\x05\x0f");
