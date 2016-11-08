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

$$ = instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x60\x01\x7e\x01\x7e\x03\x86\x80\x80\x80\x00\x05\x00\x00\x00\x00\x00\x07\xc4\x80\x80\x80\x00\x05\x08\x66\x61\x63\x2d\x65\x78\x70\x72\x00\x00\x09\x66\x61\x63\x2d\x73\x74\x61\x63\x6b\x00\x01\x0d\x66\x61\x63\x2d\x73\x74\x61\x63\x6b\x2d\x72\x61\x77\x00\x02\x09\x66\x61\x63\x2d\x6d\x69\x78\x65\x64\x00\x03\x0d\x66\x61\x63\x2d\x6d\x69\x78\x65\x64\x2d\x72\x61\x77\x00\x04\x0a\x88\x82\x80\x80\x00\x05\xb2\x80\x80\x80\x00\x01\x02\x7e\x20\x00\x21\x01\x42\x01\x21\x02\x02\x40\x03\x40\x20\x01\x42\x00\x51\x04\x40\x0c\x02\x05\x02\x40\x20\x01\x20\x02\x7e\x21\x02\x20\x01\x42\x01\x7d\x21\x01\x0b\x0b\x0c\x00\x0b\x0b\x20\x02\x0b\xaf\x80\x80\x80\x00\x01\x02\x7e\x20\x00\x21\x01\x42\x01\x21\x02\x02\x40\x03\x40\x20\x01\x42\x00\x51\x04\x40\x0c\x02\x05\x20\x01\x20\x02\x7e\x21\x02\x20\x01\x42\x01\x7d\x21\x01\x0b\x0c\x00\x0b\x0b\x20\x02\x0b\xaf\x80\x80\x80\x00\x01\x02\x7e\x20\x00\x21\x01\x42\x01\x21\x02\x02\x40\x03\x40\x20\x01\x42\x00\x51\x04\x40\x0c\x02\x05\x20\x01\x20\x02\x7e\x21\x02\x20\x01\x42\x01\x7d\x21\x01\x0b\x0c\x00\x0b\x0b\x20\x02\x0b\xaf\x80\x80\x80\x00\x01\x02\x7e\x20\x00\x21\x01\x42\x01\x21\x02\x02\x40\x03\x40\x20\x01\x42\x00\x51\x04\x40\x0c\x02\x05\x20\x01\x20\x02\x7e\x21\x02\x20\x01\x42\x01\x7d\x21\x01\x0b\x0c\x00\x0b\x0b\x20\x02\x0b\xaf\x80\x80\x80\x00\x01\x02\x7e\x20\x00\x21\x01\x42\x01\x21\x02\x02\x40\x03\x40\x20\x01\x42\x00\x51\x04\x40\x0c\x02\x05\x20\x01\x20\x02\x7e\x21\x02\x20\x01\x42\x01\x7d\x21\x01\x0b\x0c\x00\x0b\x0b\x20\x02\x0b");
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x60\x00\x00\x60\x01\x7e\x01\x7e\x02\x8f\x80\x80\x80\x00\x01\x02\x24\x24\x08\x66\x61\x63\x2d\x65\x78\x70\x72\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa2\x80\x80\x80\x00\x01\x9c\x80\x80\x80\x00\x00\x02\x40\x42\x19\x10\x00\x01\x42\x80\x80\x80\xde\x87\x92\xec\xcf\xe1\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["fac-expr"](int64("25")), int64("7034535277573963776"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x60\x00\x00\x60\x01\x7e\x01\x7e\x02\x90\x80\x80\x80\x00\x01\x02\x24\x24\x09\x66\x61\x63\x2d\x73\x74\x61\x63\x6b\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa2\x80\x80\x80\x00\x01\x9c\x80\x80\x80\x00\x00\x02\x40\x42\x19\x10\x00\x01\x42\x80\x80\x80\xde\x87\x92\xec\xcf\xe1\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["fac-stack"](int64("25")), int64("7034535277573963776"))
instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x89\x80\x80\x80\x00\x02\x60\x00\x00\x60\x01\x7e\x01\x7e\x02\x90\x80\x80\x80\x00\x01\x02\x24\x24\x09\x66\x61\x63\x2d\x6d\x69\x78\x65\x64\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa2\x80\x80\x80\x00\x01\x9c\x80\x80\x80\x00\x00\x02\x40\x42\x19\x10\x00\x01\x42\x80\x80\x80\xde\x87\x92\xec\xcf\xe1\x00\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", {$$: $$.exports}).exports.run();  // assert_return(() => $$.exports["fac-mixed"](int64("25")), int64("7034535277573963776"))
