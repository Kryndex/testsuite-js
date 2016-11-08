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

$$ = instance("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x92\x80\x80\x80\x00\x04\x60\x00\x00\x60\x01\x7f\x01\x7f\x60\x01\x7f\x00\x60\x02\x7f\x7f\x00\x03\x93\x80\x80\x80\x00\x12\x00\x01\x01\x02\x01\x01\x01\x01\x01\x02\x03\x03\x01\x01\x01\x01\x01\x01\x07\xc6\x82\x80\x80\x00\x11\x0e\x61\x73\x2d\x62\x6c\x6f\x63\x6b\x2d\x66\x69\x72\x73\x74\x00\x01\x0c\x61\x73\x2d\x62\x6c\x6f\x63\x6b\x2d\x6d\x69\x64\x00\x02\x0d\x61\x73\x2d\x62\x6c\x6f\x63\x6b\x2d\x6c\x61\x73\x74\x00\x03\x14\x61\x73\x2d\x62\x6c\x6f\x63\x6b\x2d\x66\x69\x72\x73\x74\x2d\x76\x61\x6c\x75\x65\x00\x04\x12\x61\x73\x2d\x62\x6c\x6f\x63\x6b\x2d\x6d\x69\x64\x2d\x76\x61\x6c\x75\x65\x00\x05\x13\x61\x73\x2d\x62\x6c\x6f\x63\x6b\x2d\x6c\x61\x73\x74\x2d\x76\x61\x6c\x75\x65\x00\x06\x0d\x61\x73\x2d\x6c\x6f\x6f\x70\x2d\x66\x69\x72\x73\x74\x00\x07\x0b\x61\x73\x2d\x6c\x6f\x6f\x70\x2d\x6d\x69\x64\x00\x08\x0c\x61\x73\x2d\x6c\x6f\x6f\x70\x2d\x6c\x61\x73\x74\x00\x09\x0a\x61\x73\x2d\x69\x66\x2d\x74\x68\x65\x6e\x00\x0a\x0a\x61\x73\x2d\x69\x66\x2d\x65\x6c\x73\x65\x00\x0b\x12\x6e\x65\x73\x74\x65\x64\x2d\x62\x6c\x6f\x63\x6b\x2d\x76\x61\x6c\x75\x65\x00\x0c\x0f\x6e\x65\x73\x74\x65\x64\x2d\x62\x72\x2d\x76\x61\x6c\x75\x65\x00\x0d\x12\x6e\x65\x73\x74\x65\x64\x2d\x62\x72\x5f\x69\x66\x2d\x76\x61\x6c\x75\x65\x00\x0e\x17\x6e\x65\x73\x74\x65\x64\x2d\x62\x72\x5f\x69\x66\x2d\x76\x61\x6c\x75\x65\x2d\x63\x6f\x6e\x64\x00\x0f\x15\x6e\x65\x73\x74\x65\x64\x2d\x62\x72\x5f\x74\x61\x62\x6c\x65\x2d\x76\x61\x6c\x75\x65\x00\x10\x1b\x6e\x65\x73\x74\x65\x64\x2d\x62\x72\x5f\x74\x61\x62\x6c\x65\x2d\x76\x61\x6c\x75\x65\x2d\x69\x6e\x64\x65\x78\x00\x11\x0a\xb5\x83\x80\x80\x00\x12\x82\x80\x80\x80\x00\x00\x0b\x8e\x80\x80\x80\x00\x00\x02\x40\x20\x00\x0d\x00\x41\x02\x0f\x0b\x41\x03\x0b\x90\x80\x80\x80\x00\x00\x02\x40\x10\x00\x20\x00\x0d\x00\x41\x02\x0f\x0b\x41\x03\x0b\x8d\x80\x80\x80\x00\x00\x02\x40\x10\x00\x10\x00\x20\x00\x0d\x00\x0b\x0b\x8f\x80\x80\x80\x00\x00\x02\x7f\x41\x0a\x20\x00\x0d\x00\x1a\x41\x0b\x0f\x0b\x0b\x91\x80\x80\x80\x00\x00\x02\x7f\x10\x00\x41\x14\x20\x00\x0d\x00\x1a\x41\x15\x0f\x0b\x0b\x8f\x80\x80\x80\x00\x00\x02\x7f\x10\x00\x10\x00\x41\x0b\x20\x00\x0d\x00\x0b\x0b\x91\x80\x80\x80\x00\x00\x02\x40\x03\x40\x20\x00\x0d\x01\x41\x02\x0f\x0b\x0b\x41\x03\x0b\x93\x80\x80\x80\x00\x00\x02\x40\x03\x40\x10\x00\x20\x00\x0d\x01\x41\x02\x0f\x0b\x0b\x41\x04\x0b\x8b\x80\x80\x80\x00\x00\x03\x40\x10\x00\x20\x00\x0d\x01\x0b\x0b\x91\x80\x80\x80\x00\x00\x02\x40\x20\x00\x04\x40\x20\x01\x0d\x01\x05\x10\x00\x0b\x0b\x0b\x91\x80\x80\x80\x00\x00\x02\x40\x20\x00\x04\x40\x10\x00\x05\x20\x01\x0d\x01\x0b\x0b\x0b\x9a\x80\x80\x80\x00\x00\x41\x01\x02\x7f\x41\x02\x1a\x41\x04\x02\x7f\x41\x08\x20\x00\x0d\x01\x1a\x41\x10\x0b\x6a\x0b\x6a\x0b\x9b\x80\x80\x80\x00\x00\x41\x01\x02\x7f\x41\x02\x1a\x02\x7f\x41\x08\x20\x00\x0d\x01\x1a\x41\x04\x0b\x0c\x00\x41\x10\x0b\x6a\x0b\x9e\x80\x80\x80\x00\x00\x41\x01\x02\x7f\x41\x02\x1a\x02\x7f\x41\x08\x20\x00\x0d\x01\x1a\x41\x04\x0b\x41\x01\x0d\x00\x1a\x41\x10\x0b\x6a\x0b\x9e\x80\x80\x80\x00\x00\x41\x01\x02\x7f\x41\x02\x1a\x41\x04\x02\x7f\x41\x08\x20\x00\x0d\x01\x1a\x41\x01\x0b\x0d\x00\x1a\x41\x10\x0b\x6a\x0b\x9e\x80\x80\x80\x00\x00\x41\x01\x02\x7f\x41\x02\x1a\x02\x7f\x41\x08\x20\x00\x0d\x01\x1a\x41\x04\x0b\x41\x01\x0e\x00\x00\x41\x10\x0b\x6a\x0b\x9e\x80\x80\x80\x00\x00\x41\x01\x02\x7f\x41\x02\x1a\x41\x04\x02\x7f\x41\x08\x20\x00\x0d\x01\x1a\x41\x01\x0b\x0e\x00\x00\x41\x10\x0b\x6a\x0b");
assert_return(() => $$.exports["as-block-first"](0), 2);
assert_return(() => $$.exports["as-block-first"](1), 3);
assert_return(() => $$.exports["as-block-mid"](0), 2);
assert_return(() => $$.exports["as-block-mid"](1), 3);
assert_return(() => $$.exports["as-block-last"](0));
assert_return(() => $$.exports["as-block-last"](1));
assert_return(() => $$.exports["as-block-last-value"](0), 11);
assert_return(() => $$.exports["as-block-last-value"](1), 11);
assert_return(() => $$.exports["as-loop-first"](0), 2);
assert_return(() => $$.exports["as-loop-first"](1), 3);
assert_return(() => $$.exports["as-loop-mid"](0), 2);
assert_return(() => $$.exports["as-loop-mid"](1), 4);
assert_return(() => $$.exports["as-loop-last"](0));
assert_return(() => $$.exports["as-loop-last"](1));
assert_return(() => $$.exports["as-if-then"](0, 0));
assert_return(() => $$.exports["as-if-then"](4, 0));
assert_return(() => $$.exports["as-if-then"](0, 1));
assert_return(() => $$.exports["as-if-then"](4, 1));
assert_return(() => $$.exports["as-if-else"](0, 0));
assert_return(() => $$.exports["as-if-else"](3, 0));
assert_return(() => $$.exports["as-if-else"](0, 1));
assert_return(() => $$.exports["as-if-else"](3, 1));
assert_return(() => $$.exports["nested-block-value"](0), 21);
assert_return(() => $$.exports["nested-block-value"](1), 9);
assert_return(() => $$.exports["nested-br-value"](0), 5);
assert_return(() => $$.exports["nested-br-value"](1), 9);
assert_return(() => $$.exports["nested-br_if-value"](0), 5);
assert_return(() => $$.exports["nested-br_if-value"](1), 9);
assert_return(() => $$.exports["nested-br_if-value-cond"](0), 5);
assert_return(() => $$.exports["nested-br_if-value-cond"](1), 9);
assert_return(() => $$.exports["nested-br_table-value"](0), 5);
assert_return(() => $$.exports["nested-br_table-value"](1), 9);
assert_return(() => $$.exports["nested-br_table-value-index"](0), 5);
assert_return(() => $$.exports["nested-br_table-value-index"](1), 9);
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x41\x00\x0d\x00\x68\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x41\x00\x0d\x00\x7a\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x41\x00\x0d\x00\x8c\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x41\x00\x0d\x00\x9a\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x41\x01\x0d\x00\x68\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x42\x01\x0d\x00\x7a\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x93\x80\x80\x80\x00\x01\x8d\x80\x80\x80\x00\x00\x02\x40\x43\x00\x00\x80\x3f\x0d\x00\x8c\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x02\x40\x42\x01\x0d\x00\x9a\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x02\x7f\x41\x00\x0d\x00\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x02\x7f\x41\x01\x0d\x00\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x02\x40\x41\x00\x41\x00\x0d\x00\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x02\x40\x41\x00\x41\x01\x0d\x00\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x00\x02\x7f\x01\x41\x00\x0d\x00\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x00\x02\x7f\x01\x41\x01\x0d\x00\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x02\x7f\x42\x01\x41\x00\x0d\x00\x1a\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x02\x7f\x42\x01\x41\x00\x0d\x00\x1a\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x00\x02\x40\x01\x0d\x00\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8f\x80\x80\x80\x00\x01\x89\x80\x80\x80\x00\x00\x02\x40\x42\x00\x0d\x00\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x00\x02\x7f\x41\x00\x01\x0d\x00\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7f\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x93\x80\x80\x80\x00\x01\x8d\x80\x80\x80\x00\x00\x02\x7f\x41\x00\x42\x00\x0d\x00\x41\x01\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8c\x80\x80\x80\x00\x01\x86\x80\x80\x80\x00\x00\x41\x01\x0d\x01\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x00\x02\x40\x02\x40\x41\x01\x0d\x05\x0b\x0b\x0b");
assert_invalid("\x00\x61\x73\x6d\x0d\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x00\x41\x01\x0d\x81\x80\x80\x80\x01\x0b");
