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

$$ = instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x60\x00\x01\x7f\x60\x00\x01\x7e\x03\xbd\x80\x80\x80\x00\x3c\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x07\x9d\x89\x80\x80\x00\x3c\x07\x66\x33\x32\x2e\x6e\x61\x6e\x00\x00\x10\x66\x33\x32\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x01\x10\x66\x33\x32\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x02\x0d\x66\x33\x32\x2e\x70\x6c\x61\x69\x6e\x5f\x6e\x61\x6e\x00\x03\x22\x66\x33\x32\x2e\x69\x6e\x66\x6f\x72\x6d\x61\x6c\x6c\x79\x5f\x6b\x6e\x6f\x77\x6e\x5f\x61\x73\x5f\x70\x6c\x61\x69\x6e\x5f\x73\x6e\x61\x6e\x00\x04\x10\x66\x33\x32\x2e\x61\x6c\x6c\x5f\x6f\x6e\x65\x73\x5f\x6e\x61\x6e\x00\x05\x0c\x66\x33\x32\x2e\x6d\x69\x73\x63\x5f\x6e\x61\x6e\x00\x06\x15\x66\x33\x32\x2e\x6d\x69\x73\x63\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x07\x15\x66\x33\x32\x2e\x6d\x69\x73\x63\x5f\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x08\x0c\x66\x33\x32\x2e\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x09\x15\x66\x33\x32\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x0a\x15\x66\x33\x32\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x0b\x08\x66\x33\x32\x2e\x7a\x65\x72\x6f\x00\x0c\x11\x66\x33\x32\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x0d\x11\x66\x33\x32\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x0e\x08\x66\x33\x32\x2e\x6d\x69\x73\x63\x00\x0f\x10\x66\x33\x32\x2e\x6d\x69\x6e\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x00\x10\x0e\x66\x33\x32\x2e\x6d\x69\x6e\x5f\x6e\x6f\x72\x6d\x61\x6c\x00\x11\x0e\x66\x33\x32\x2e\x6d\x61\x78\x5f\x66\x69\x6e\x69\x74\x65\x00\x12\x11\x66\x33\x32\x2e\x6d\x61\x78\x5f\x73\x75\x62\x6e\x6f\x72\x6d\x61\x6c\x00\x13\x10\x66\x33\x32\x2e\x74\x72\x61\x69\x6c\x69\x6e\x67\x5f\x64\x6f\x74\x00\x14\x0c\x66\x33\x32\x5f\x64\x65\x63\x2e\x7a\x65\x72\x6f\x00\x15\x15\x66\x33\x32\x5f\x64\x65\x63\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x16\x15\x66\x33\x32\x5f\x64\x65\x63\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x17\x0c\x66\x33\x32\x5f\x64\x65\x63\x2e\x6d\x69\x73\x63\x00\x18\x14\x66\x33\x32\x5f\x64\x65\x63\x2e\x6d\x69\x6e\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x00\x19\x12\x66\x33\x32\x5f\x64\x65\x63\x2e\x6d\x69\x6e\x5f\x6e\x6f\x72\x6d\x61\x6c\x00\x1a\x15\x66\x33\x32\x5f\x64\x65\x63\x2e\x6d\x61\x78\x5f\x73\x75\x62\x6e\x6f\x72\x6d\x61\x6c\x00\x1b\x12\x66\x33\x32\x5f\x64\x65\x63\x2e\x6d\x61\x78\x5f\x66\x69\x6e\x69\x74\x65\x00\x1c\x14\x66\x33\x32\x5f\x64\x65\x63\x2e\x74\x72\x61\x69\x6c\x69\x6e\x67\x5f\x64\x6f\x74\x00\x1d\x07\x66\x36\x34\x2e\x6e\x61\x6e\x00\x1e\x10\x66\x36\x34\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x1f\x10\x66\x36\x34\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x20\x0d\x66\x36\x34\x2e\x70\x6c\x61\x69\x6e\x5f\x6e\x61\x6e\x00\x21\x22\x66\x36\x34\x2e\x69\x6e\x66\x6f\x72\x6d\x61\x6c\x6c\x79\x5f\x6b\x6e\x6f\x77\x6e\x5f\x61\x73\x5f\x70\x6c\x61\x69\x6e\x5f\x73\x6e\x61\x6e\x00\x22\x10\x66\x36\x34\x2e\x61\x6c\x6c\x5f\x6f\x6e\x65\x73\x5f\x6e\x61\x6e\x00\x23\x0c\x66\x36\x34\x2e\x6d\x69\x73\x63\x5f\x6e\x61\x6e\x00\x24\x15\x66\x36\x34\x2e\x6d\x69\x73\x63\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x25\x15\x66\x36\x34\x2e\x6d\x69\x73\x63\x5f\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x26\x0c\x66\x36\x34\x2e\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x27\x15\x66\x36\x34\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x28\x15\x66\x36\x34\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x29\x08\x66\x36\x34\x2e\x7a\x65\x72\x6f\x00\x2a\x11\x66\x36\x34\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x2b\x11\x66\x36\x34\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x2c\x08\x66\x36\x34\x2e\x6d\x69\x73\x63\x00\x2d\x10\x66\x36\x34\x2e\x6d\x69\x6e\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x00\x2e\x0e\x66\x36\x34\x2e\x6d\x69\x6e\x5f\x6e\x6f\x72\x6d\x61\x6c\x00\x2f\x11\x66\x36\x34\x2e\x6d\x61\x78\x5f\x73\x75\x62\x6e\x6f\x72\x6d\x61\x6c\x00\x30\x0e\x66\x36\x34\x2e\x6d\x61\x78\x5f\x66\x69\x6e\x69\x74\x65\x00\x31\x10\x66\x36\x34\x2e\x74\x72\x61\x69\x6c\x69\x6e\x67\x5f\x64\x6f\x74\x00\x32\x0c\x66\x36\x34\x5f\x64\x65\x63\x2e\x7a\x65\x72\x6f\x00\x33\x15\x66\x36\x34\x5f\x64\x65\x63\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x34\x15\x66\x36\x34\x5f\x64\x65\x63\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x35\x0c\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x69\x73\x63\x00\x36\x14\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x69\x6e\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x00\x37\x12\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x69\x6e\x5f\x6e\x6f\x72\x6d\x61\x6c\x00\x38\x15\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x61\x78\x5f\x73\x75\x62\x6e\x6f\x72\x6d\x61\x6c\x00\x39\x12\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x61\x78\x5f\x66\x69\x6e\x69\x74\x65\x00\x3a\x14\x66\x36\x34\x5f\x64\x65\x63\x2e\x74\x72\x61\x69\x6c\x69\x6e\x67\x5f\x64\x6f\x74\x00\x3b\x0a\x85\x87\x80\x80\x00\x3c\x88\x80\x80\x80\x00\x00\x43\x00\x00\xc0\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\xc0\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\xc0\xff\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\xc0\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\xa0\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xff\xff\xff\xff\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x45\x23\x81\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x50\x40\xb0\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xde\xbc\xaa\xff\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x80\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x80\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x80\xff\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x00\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x00\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x00\x80\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xdb\x0f\xc9\x40\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x01\x00\x00\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x80\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xff\xff\x7f\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xff\xff\x7f\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x80\x44\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x00\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x00\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x00\x80\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xdb\x0f\xc9\x40\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x01\x00\x00\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\x00\x00\x80\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xff\xff\x7f\x00\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xff\xff\x7f\x7f\xbc\x0b\x88\x80\x80\x80\x00\x00\x43\xf9\x02\x15\x50\xbc\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf8\xff\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf8\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf4\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\xff\xff\xff\xff\xff\xff\xff\xff\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\xbc\x9a\x78\x56\x34\x12\xf0\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x09\x08\x07\x06\x05\x04\xf3\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x45\x23\x01\xef\xcd\xab\xf2\xff\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf0\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf0\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\xf0\xff\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x80\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x18\x2d\x44\x54\xfb\x21\x19\x40\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x01\x00\x00\x00\x00\x00\x00\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x10\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\xff\xff\xff\xff\xff\xff\x0f\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\xff\xff\xff\xff\xff\xff\xef\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x30\x46\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x80\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x18\x2d\x44\x54\xfb\x21\x19\x40\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x01\x00\x00\x00\x00\x00\x00\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x10\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\xff\xff\xff\xff\xff\xff\x0f\x00\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\xff\xff\xff\xff\xff\xff\xef\x7f\xbd\x0b\x8c\x80\x80\x80\x00\x00\x44\x7d\xc3\x94\x25\xad\x49\xb2\x54\xbd\x0b");
assert_return(() => $$.exports["f32.nan"](), 2143289344);
assert_return(() => $$.exports["f32.positive_nan"](), 2143289344);
assert_return(() => $$.exports["f32.negative_nan"](), -4194304);
assert_return(() => $$.exports["f32.plain_nan"](), 2143289344);
assert_return(() => $$.exports["f32.informally_known_as_plain_snan"](), 2141192192);
assert_return(() => $$.exports["f32.all_ones_nan"](), -1);
assert_return(() => $$.exports["f32.misc_nan"](), 2139169605);
assert_return(() => $$.exports["f32.misc_positive_nan"](), 2142257232);
assert_return(() => $$.exports["f32.misc_negative_nan"](), -5587746);
assert_return(() => $$.exports["f32.infinity"](), 2139095040);
assert_return(() => $$.exports["f32.positive_infinity"](), 2139095040);
assert_return(() => $$.exports["f32.negative_infinity"](), -8388608);
assert_return(() => $$.exports["f32.zero"](), 0);
assert_return(() => $$.exports["f32.positive_zero"](), 0);
assert_return(() => $$.exports["f32.negative_zero"](), -2147483648);
assert_return(() => $$.exports["f32.misc"](), 1086918619);
assert_return(() => $$.exports["f32.min_positive"](), 1);
assert_return(() => $$.exports["f32.min_normal"](), 8388608);
assert_return(() => $$.exports["f32.max_subnormal"](), 8388607);
assert_return(() => $$.exports["f32.max_finite"](), 2139095039);
assert_return(() => $$.exports["f32.trailing_dot"](), 1149239296);
assert_return(() => $$.exports["f32_dec.zero"](), 0);
assert_return(() => $$.exports["f32_dec.positive_zero"](), 0);
assert_return(() => $$.exports["f32_dec.negative_zero"](), -2147483648);
assert_return(() => $$.exports["f32_dec.misc"](), 1086918619);
assert_return(() => $$.exports["f32_dec.min_positive"](), 1);
assert_return(() => $$.exports["f32_dec.min_normal"](), 8388608);
assert_return(() => $$.exports["f32_dec.max_subnormal"](), 8388607);
assert_return(() => $$.exports["f32_dec.max_finite"](), 2139095039);
assert_return(() => $$.exports["f32_dec.trailing_dot"](), 1343554297);
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x8e\x80\x80\x80\x00\x01\x02\x24\x24\x07\x66\x36\x34\x2e\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\xfc\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.nan"](), int64("9221120237041090560"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x97\x80\x80\x80\x00\x01\x02\x24\x24\x10\x66\x36\x34\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\xfc\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.positive_nan"](), int64("9221120237041090560"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x97\x80\x80\x80\x00\x01\x02\x24\x24\x10\x66\x36\x34\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x7c\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.negative_nan"](), int64("-2251799813685248"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x94\x80\x80\x80\x00\x01\x02\x24\x24\x0d\x66\x36\x34\x2e\x70\x6c\x61\x69\x6e\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\xfc\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.plain_nan"](), int64("9221120237041090560"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\xa9\x80\x80\x80\x00\x01\x02\x24\x24\x22\x66\x36\x34\x2e\x69\x6e\x66\x6f\x72\x6d\x61\x6c\x6c\x79\x5f\x6b\x6e\x6f\x77\x6e\x5f\x61\x73\x5f\x70\x6c\x61\x69\x6e\x5f\x73\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\xfa\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.informally_known_as_plain_snan"](), int64("9219994337134247936"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x97\x80\x80\x80\x00\x01\x02\x24\x24\x10\x66\x36\x34\x2e\x61\x6c\x6c\x5f\x6f\x6e\x65\x73\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x7f\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.all_ones_nan"](), int64("-1"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x93\x80\x80\x80\x00\x01\x02\x24\x24\x0c\x66\x36\x34\x2e\x6d\x69\x73\x63\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xbc\xb5\xe2\xb3\xc5\xc6\x84\xf8\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.misc_nan"](), int64("9218888453225749180"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x2e\x6d\x69\x73\x63\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x89\x90\x9c\xb0\xd0\x80\xc1\xf9\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.misc_positive_nan"](), int64("9219717281780008969"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x2e\x6d\x69\x73\x63\x5f\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x6e\x61\x6e\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xc5\xc6\x84\xf8\xde\xf9\xaa\x79\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.misc_negative_nan"](), int64("-3751748707474619"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x93\x80\x80\x80\x00\x01\x02\x24\x24\x0c\x66\x36\x34\x2e\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\xf8\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.infinity"](), int64("9218868437227405312"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\xf8\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.positive_infinity"](), int64("9218868437227405312"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x69\x6e\x66\x69\x6e\x69\x74\x79\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x78\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.negative_infinity"](), int64("-4503599627370496"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x8f\x80\x80\x80\x00\x01\x02\x24\x24\x08\x66\x36\x34\x2e\x7a\x65\x72\x6f\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.zero"](), int64("0"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x98\x80\x80\x80\x00\x01\x02\x24\x24\x11\x66\x36\x34\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.positive_zero"](), int64("0"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x98\x80\x80\x80\x00\x01\x02\x24\x24\x11\x66\x36\x34\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x7f\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.negative_zero"](), int64("-9223372036854775808"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x8f\x80\x80\x80\x00\x01\x02\x24\x24\x08\x66\x36\x34\x2e\x6d\x69\x73\x63\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x98\xda\x90\xa2\xb5\xbf\xc8\x8c\xc0\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.misc"](), int64("4618760256179416344"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x97\x80\x80\x80\x00\x01\x02\x24\x24\x10\x66\x36\x34\x2e\x6d\x69\x6e\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x01\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.min_positive"](), int64("1"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x66\x36\x34\x2e\x6d\x69\x6e\x5f\x6e\x6f\x72\x6d\x61\x6c\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x08\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.min_normal"](), int64("4503599627370496"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x98\x80\x80\x80\x00\x01\x02\x24\x24\x11\x66\x36\x34\x2e\x6d\x61\x78\x5f\x73\x75\x62\x6e\x6f\x72\x6d\x61\x6c\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xff\xff\xff\xff\xff\xff\xff\x07\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.max_subnormal"](), int64("4503599627370495"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x95\x80\x80\x80\x00\x01\x02\x24\x24\x0e\x66\x36\x34\x2e\x6d\x61\x78\x5f\x66\x69\x6e\x69\x74\x65\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xff\xff\xff\xff\xff\xff\xff\xf7\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.max_finite"](), int64("9218868437227405311"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x97\x80\x80\x80\x00\x01\x02\x24\x24\x10\x66\x36\x34\x2e\x74\x72\x61\x69\x6c\x69\x6e\x67\x5f\x64\x6f\x74\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x98\xc6\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64.trailing_dot"](), int64("5057542381537067008"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x93\x80\x80\x80\x00\x01\x02\x24\x24\x0c\x66\x36\x34\x5f\x64\x65\x63\x2e\x7a\x65\x72\x6f\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.zero"](), int64("0"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x5f\x64\x65\x63\x2e\x70\x6f\x73\x69\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.positive_zero"](), int64("0"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x5f\x64\x65\x63\x2e\x6e\x65\x67\x61\x74\x69\x76\x65\x5f\x7a\x65\x72\x6f\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x80\x80\x7f\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.negative_zero"](), int64("-9223372036854775808"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x93\x80\x80\x80\x00\x01\x02\x24\x24\x0c\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x69\x73\x63\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x98\xda\x90\xa2\xb5\xbf\xc8\x8c\xc0\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.misc"](), int64("4618760256179416344"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9b\x80\x80\x80\x00\x01\x02\x24\x24\x14\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x69\x6e\x5f\x70\x6f\x73\x69\x74\x69\x76\x65\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x01\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.min_positive"](), int64("1"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x99\x80\x80\x80\x00\x01\x02\x24\x24\x12\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x69\x6e\x5f\x6e\x6f\x72\x6d\x61\x6c\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\x80\x80\x80\x80\x80\x80\x80\x08\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.min_normal"](), int64("4503599627370496"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9c\x80\x80\x80\x00\x01\x02\x24\x24\x15\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x61\x78\x5f\x73\x75\x62\x6e\x6f\x72\x6d\x61\x6c\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x9e\x80\x80\x80\x00\x01\x98\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xff\xff\xff\xff\xff\xff\xff\x07\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.max_subnormal"](), int64("4503599627370495"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x99\x80\x80\x80\x00\x01\x02\x24\x24\x12\x66\x36\x34\x5f\x64\x65\x63\x2e\x6d\x61\x78\x5f\x66\x69\x6e\x69\x74\x65\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xff\xff\xff\xff\xff\xff\xff\xf7\xff\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.max_finite"](), int64("9218868437227405311"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x00\x01\x7e\x02\x9b\x80\x80\x80\x00\x01\x02\x24\x24\x14\x66\x36\x34\x5f\x64\x65\x63\x2e\x74\x72\x61\x69\x6c\x69\x6e\x67\x5f\x64\x6f\x74\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa0\x80\x80\x80\x00\x01\x9a\x80\x80\x80\x00\x00\x02\x40\x10\x00\x01\x42\xfd\x86\xd3\xac\xd2\xb5\x92\xd9\xd4\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["f64_dec.trailing_dot"](), int64("6103021453049119613"))
