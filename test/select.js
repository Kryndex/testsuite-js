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

$$ = instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\xa2\x80\x80\x80\x00\x05\x60\x03\x7f\x7f\x7f\x01\x7f\x60\x03\x7e\x7e\x7f\x01\x7e\x60\x03\x7d\x7d\x7f\x01\x7d\x60\x03\x7c\x7c\x7f\x01\x7c\x60\x01\x7f\x01\x7f\x03\x87\x80\x80\x80\x00\x06\x00\x01\x02\x03\x04\x04\x07\xd5\x80\x80\x80\x00\x06\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x33\x32\x00\x00\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x02\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x03\x0d\x73\x65\x6c\x65\x63\x74\x5f\x74\x72\x61\x70\x5f\x6c\x00\x04\x0d\x73\x65\x6c\x65\x63\x74\x5f\x74\x72\x61\x70\x5f\x72\x00\x05\x0a\xd3\x80\x80\x80\x00\x06\x89\x80\x80\x80\x00\x00\x20\x00\x20\x01\x20\x02\x1b\x0b\x89\x80\x80\x80\x00\x00\x20\x00\x20\x01\x20\x02\x1b\x0b\x89\x80\x80\x80\x00\x00\x20\x00\x20\x01\x20\x02\x1b\x0b\x89\x80\x80\x80\x00\x00\x20\x00\x20\x01\x20\x02\x1b\x0b\x88\x80\x80\x80\x00\x00\x00\x41\x00\x20\x00\x1b\x0b\x88\x80\x80\x80\x00\x00\x41\x00\x00\x20\x00\x1b\x0b");
assert_return(() => $$.exports["select_i32"](1, 2, 1), 1);
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7e\x7e\x7f\x01\x7e\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9d\x80\x80\x80\x00\x01\x97\x80\x80\x80\x00\x00\x02\x40\x42\x02\x42\x01\x41\x01\x10\x00\x01\x42\x02\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_i64"](int64("2"), int64("1"), 1), int64("2"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\x80\x3f\x43\x00\x00\x00\x40\x41\x01\x10\x00\xbc\x43\x00\x00\x80\x3f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](1., 2., 1), 1.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\x44\x00\x00\x00\x00\x00\x00\x00\x40\x41\x01\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](1., 2., 1), 1.)
assert_return(() => $$.exports["select_i32"](1, 2, 0), 2);
assert_return(() => $$.exports["select_i32"](2, 1, 0), 1);
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7e\x7e\x7f\x01\x7e\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9d\x80\x80\x80\x00\x01\x97\x80\x80\x80\x00\x00\x02\x40\x42\x02\x42\x01\x41\x7f\x10\x00\x01\x42\x02\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_i64"](int64("2"), int64("1"), -1), int64("2"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7e\x7e\x7f\x01\x7e\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa1\x80\x80\x80\x00\x01\x9b\x80\x80\x80\x00\x00\x02\x40\x42\x02\x42\x01\x41\xf0\xe1\xc3\x87\x7f\x10\x00\x01\x42\x02\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_i64"](int64("2"), int64("1"), -252645136), int64("2"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\xc0\x7f\x43\x00\x00\x80\x3f\x41\x01\x10\x00\xbc\x43\x00\x00\xc0\x7f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x04\x03\x82\x7f\x43\x00\x00\x80\x3f\x41\x01\x10\x00\xbc\x43\x04\x03\x82\x7f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\xc0\x7f\x43\x00\x00\x80\x3f\x41\x00\x10\x00\xbc\x43\x00\x00\x80\x3f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x04\x03\x82\x7f\x43\x00\x00\x80\x3f\x41\x00\x10\x00\xbc\x43\x00\x00\x80\x3f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\x00\x40\x43\x00\x00\xc0\x7f\x41\x01\x10\x00\xbc\x43\x00\x00\x00\x40\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\x00\x40\x43\x04\x03\x82\x7f\x41\x01\x10\x00\xbc\x43\x00\x00\x00\x40\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\x00\x40\x43\x00\x00\xc0\x7f\x41\x00\x10\x00\xbc\x43\x00\x00\xc0\x7f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 0), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7d\x7d\x7f\x01\x7d\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa6\x80\x80\x80\x00\x01\xa0\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\x00\x40\x43\x04\x03\x82\x7f\x41\x00\x10\x00\xbc\x43\x04\x03\x82\x7f\xbc\x46\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f32"](2., NaN, 0), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\x41\x01\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x04\x03\x02\x00\x00\x00\xf0\x7f\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\x41\x01\x10\x00\xbd\x44\x04\x03\x02\x00\x00\x00\xf0\x7f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 1), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\x41\x00\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x04\x03\x02\x00\x00\x00\xf0\x7f\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\x41\x00\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\xf0\x3f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](NaN, 1., 0), 1.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\x00\x40\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\x41\x01\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\x00\x40\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\x00\x40\x44\x04\x03\x02\x00\x00\x00\xf0\x7f\x41\x01\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\x00\x40\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 1), 2.)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\x00\x40\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\x41\x00\x10\x00\xbd\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 0), NaN)
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x8b\x80\x80\x80\x00\x02\x60\x00\x00\x60\x03\x7c\x7c\x7f\x01\x7c\x02\x91\x80\x80\x80\x00\x01\x02\x24\x24\x0a\x73\x65\x6c\x65\x63\x74\x5f\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xb2\x80\x80\x80\x00\x01\xac\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\x00\x40\x44\x04\x03\x02\x00\x00\x00\xf0\x7f\x41\x00\x10\x00\xbd\x44\x04\x03\x02\x00\x00\x00\xf0\x7f\xbd\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["select_f64"](2., NaN, 0), NaN)
assert_trap(() => $$.exports["select_trap_l"](1));
assert_trap(() => $$.exports["select_trap_l"](0));
assert_trap(() => $$.exports["select_trap_r"](1));
assert_trap(() => $$.exports["select_trap_r"](0));
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x00\x01\x01\x41\x01\x1b\x0b");
