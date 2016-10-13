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

$$ = instance("\x00\x61\x73\x6d\x0c\x00\x00\x00\x01\xc0\x80\x80\x80\x00\x0d\x40\x02\x01\x01\x01\x01\x40\x02\x02\x02\x01\x01\x40\x02\x03\x03\x01\x01\x40\x02\x04\x04\x01\x01\x40\x00\x00\x40\x00\x01\x01\x40\x00\x01\x02\x40\x00\x01\x03\x40\x00\x01\x04\x40\x02\x01\x01\x00\x40\x02\x02\x02\x00\x40\x02\x03\x03\x00\x40\x02\x04\x04\x00\x03\x84\x81\x80\x80\x00\x82\x01\x00\x00\x01\x01\x02\x02\x03\x03\x04\x04\x05\x05\x05\x05\x05\x05\x06\x06\x06\x05\x05\x07\x07\x07\x05\x05\x08\x08\x08\x05\x05\x09\x0a\x0b\x0c\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x05\x04\x85\x80\x80\x80\x00\x01\x20\x01\x08\x08\x05\x83\x80\x80\x80\x00\x01\x00\x01\x07\xaa\x88\x80\x80\x00\x5f\x07\x69\x33\x32\x5f\x61\x64\x64\x00\x23\x07\x69\x33\x32\x5f\x73\x75\x62\x00\x24\x07\x69\x33\x32\x5f\x6d\x75\x6c\x00\x25\x09\x69\x33\x32\x5f\x64\x69\x76\x5f\x73\x00\x26\x09\x69\x33\x32\x5f\x64\x69\x76\x5f\x75\x00\x27\x09\x69\x33\x32\x5f\x72\x65\x6d\x5f\x73\x00\x28\x09\x69\x33\x32\x5f\x72\x65\x6d\x5f\x75\x00\x29\x07\x69\x33\x32\x5f\x61\x6e\x64\x00\x2a\x06\x69\x33\x32\x5f\x6f\x72\x00\x2b\x07\x69\x33\x32\x5f\x78\x6f\x72\x00\x2c\x07\x69\x33\x32\x5f\x73\x68\x6c\x00\x2d\x09\x69\x33\x32\x5f\x73\x68\x72\x5f\x75\x00\x2e\x09\x69\x33\x32\x5f\x73\x68\x72\x5f\x73\x00\x2f\x06\x69\x33\x32\x5f\x65\x71\x00\x30\x06\x69\x33\x32\x5f\x6e\x65\x00\x31\x08\x69\x33\x32\x5f\x6c\x74\x5f\x73\x00\x32\x08\x69\x33\x32\x5f\x6c\x65\x5f\x73\x00\x33\x08\x69\x33\x32\x5f\x6c\x74\x5f\x75\x00\x34\x08\x69\x33\x32\x5f\x6c\x65\x5f\x75\x00\x35\x08\x69\x33\x32\x5f\x67\x74\x5f\x73\x00\x36\x08\x69\x33\x32\x5f\x67\x65\x5f\x73\x00\x37\x08\x69\x33\x32\x5f\x67\x74\x5f\x75\x00\x38\x08\x69\x33\x32\x5f\x67\x65\x5f\x75\x00\x39\x09\x69\x33\x32\x5f\x73\x74\x6f\x72\x65\x00\x3a\x0a\x69\x33\x32\x5f\x73\x74\x6f\x72\x65\x38\x00\x3b\x0b\x69\x33\x32\x5f\x73\x74\x6f\x72\x65\x31\x36\x00\x3c\x08\x69\x33\x32\x5f\x63\x61\x6c\x6c\x00\x3d\x11\x69\x33\x32\x5f\x63\x61\x6c\x6c\x5f\x69\x6e\x64\x69\x72\x65\x63\x74\x00\x3e\x0a\x69\x33\x32\x5f\x73\x65\x6c\x65\x63\x74\x00\x3f\x07\x69\x36\x34\x5f\x61\x64\x64\x00\x40\x07\x69\x36\x34\x5f\x73\x75\x62\x00\x41\x07\x69\x36\x34\x5f\x6d\x75\x6c\x00\x42\x09\x69\x36\x34\x5f\x64\x69\x76\x5f\x73\x00\x43\x09\x69\x36\x34\x5f\x64\x69\x76\x5f\x75\x00\x44\x09\x69\x36\x34\x5f\x72\x65\x6d\x5f\x73\x00\x45\x09\x69\x36\x34\x5f\x72\x65\x6d\x5f\x75\x00\x46\x07\x69\x36\x34\x5f\x61\x6e\x64\x00\x47\x06\x69\x36\x34\x5f\x6f\x72\x00\x48\x07\x69\x36\x34\x5f\x78\x6f\x72\x00\x49\x07\x69\x36\x34\x5f\x73\x68\x6c\x00\x4a\x09\x69\x36\x34\x5f\x73\x68\x72\x5f\x75\x00\x4b\x09\x69\x36\x34\x5f\x73\x68\x72\x5f\x73\x00\x4c\x06\x69\x36\x34\x5f\x65\x71\x00\x4d\x06\x69\x36\x34\x5f\x6e\x65\x00\x4e\x08\x69\x36\x34\x5f\x6c\x74\x5f\x73\x00\x4f\x08\x69\x36\x34\x5f\x6c\x65\x5f\x73\x00\x50\x08\x69\x36\x34\x5f\x6c\x74\x5f\x75\x00\x51\x08\x69\x36\x34\x5f\x6c\x65\x5f\x75\x00\x52\x08\x69\x36\x34\x5f\x67\x74\x5f\x73\x00\x53\x08\x69\x36\x34\x5f\x67\x65\x5f\x73\x00\x54\x08\x69\x36\x34\x5f\x67\x74\x5f\x75\x00\x55\x08\x69\x36\x34\x5f\x67\x65\x5f\x75\x00\x56\x09\x69\x36\x34\x5f\x73\x74\x6f\x72\x65\x00\x57\x0a\x69\x36\x34\x5f\x73\x74\x6f\x72\x65\x38\x00\x58\x0b\x69\x36\x34\x5f\x73\x74\x6f\x72\x65\x31\x36\x00\x59\x0b\x69\x36\x34\x5f\x73\x74\x6f\x72\x65\x33\x32\x00\x5a\x08\x69\x36\x34\x5f\x63\x61\x6c\x6c\x00\x5b\x11\x69\x36\x34\x5f\x63\x61\x6c\x6c\x5f\x69\x6e\x64\x69\x72\x65\x63\x74\x00\x5c\x0a\x69\x36\x34\x5f\x73\x65\x6c\x65\x63\x74\x00\x5d\x07\x66\x33\x32\x5f\x61\x64\x64\x00\x5e\x07\x66\x33\x32\x5f\x73\x75\x62\x00\x5f\x07\x66\x33\x32\x5f\x6d\x75\x6c\x00\x60\x07\x66\x33\x32\x5f\x64\x69\x76\x00\x61\x0c\x66\x33\x32\x5f\x63\x6f\x70\x79\x73\x69\x67\x6e\x00\x62\x06\x66\x33\x32\x5f\x65\x71\x00\x63\x06\x66\x33\x32\x5f\x6e\x65\x00\x64\x06\x66\x33\x32\x5f\x6c\x74\x00\x65\x06\x66\x33\x32\x5f\x6c\x65\x00\x66\x06\x66\x33\x32\x5f\x67\x74\x00\x67\x06\x66\x33\x32\x5f\x67\x65\x00\x68\x07\x66\x33\x32\x5f\x6d\x69\x6e\x00\x69\x07\x66\x33\x32\x5f\x6d\x61\x78\x00\x6a\x09\x66\x33\x32\x5f\x73\x74\x6f\x72\x65\x00\x6b\x08\x66\x33\x32\x5f\x63\x61\x6c\x6c\x00\x6c\x11\x66\x33\x32\x5f\x63\x61\x6c\x6c\x5f\x69\x6e\x64\x69\x72\x65\x63\x74\x00\x6d\x0a\x66\x33\x32\x5f\x73\x65\x6c\x65\x63\x74\x00\x6e\x07\x66\x36\x34\x5f\x61\x64\x64\x00\x6f\x07\x66\x36\x34\x5f\x73\x75\x62\x00\x70\x07\x66\x36\x34\x5f\x6d\x75\x6c\x00\x71\x07\x66\x36\x34\x5f\x64\x69\x76\x00\x72\x0c\x66\x36\x34\x5f\x63\x6f\x70\x79\x73\x69\x67\x6e\x00\x73\x06\x66\x36\x34\x5f\x65\x71\x00\x74\x06\x66\x36\x34\x5f\x6e\x65\x00\x75\x06\x66\x36\x34\x5f\x6c\x74\x00\x76\x06\x66\x36\x34\x5f\x6c\x65\x00\x77\x06\x66\x36\x34\x5f\x67\x74\x00\x78\x06\x66\x36\x34\x5f\x67\x65\x00\x79\x07\x66\x36\x34\x5f\x6d\x69\x6e\x00\x7a\x07\x66\x36\x34\x5f\x6d\x61\x78\x00\x7b\x09\x66\x36\x34\x5f\x73\x74\x6f\x72\x65\x00\x7c\x08\x66\x36\x34\x5f\x63\x61\x6c\x6c\x00\x7d\x11\x66\x36\x34\x5f\x63\x61\x6c\x6c\x5f\x69\x6e\x64\x69\x72\x65\x63\x74\x00\x7e\x0a\x66\x36\x34\x5f\x73\x65\x6c\x65\x63\x74\x00\x7f\x05\x62\x72\x5f\x69\x66\x00\x80\x01\x08\x62\x72\x5f\x74\x61\x62\x6c\x65\x00\x81\x01\x09\x8e\x80\x80\x80\x00\x01\x00\x10\x00\x0f\x08\x00\x01\x02\x03\x04\x05\x06\x07\x0a\xae\x91\x80\x80\x00\x82\x01\x84\x80\x80\x80\x00\x00\x10\x7f\x0f\x84\x80\x80\x80\x00\x00\x10\x7e\x0f\x84\x80\x80\x80\x00\x00\x10\x7f\x0f\x84\x80\x80\x80\x00\x00\x10\x7e\x0f\x84\x80\x80\x80\x00\x00\x10\x7f\x0f\x84\x80\x80\x80\x00\x00\x10\x7e\x0f\x84\x80\x80\x80\x00\x00\x10\x7f\x0f\x84\x80\x80\x80\x00\x00\x10\x7e\x0f\x89\x80\x80\x80\x00\x00\x10\x08\x10\x00\x33\x02\x00\x0f\xa7\x80\x80\x80\x00\x00\x10\x0b\x10\x0a\x21\x00\x00\x2e\x00\x00\x10\x0a\x10\x09\x21\x00\x00\x2e\x00\x00\x10\x09\x10\x08\x21\x00\x00\x2e\x00\x00\x10\x08\x10\x7d\x2e\x00\x00\x0f\x87\x80\x80\x80\x00\x00\x10\x08\x2a\x02\x00\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x01\x2e\x00\x00\x10\x00\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x02\x2e\x00\x00\x10\x01\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x03\x2e\x00\x00\x10\x01\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x04\x2e\x00\x00\x10\x00\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x05\x2e\x00\x00\x10\x00\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x01\x2e\x00\x00\x11\x00\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x02\x2e\x00\x00\x11\x01\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x03\x2e\x00\x00\x11\x01\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x04\x2e\x00\x00\x10\x02\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x05\x2e\x00\x00\x10\x00\x0f\x90\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x01\x2e\x00\x00\x13\x00\x00\x00\x00\x0f\x90\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x02\x2e\x00\x00\x13\x00\x00\x80\x3f\x0f\x90\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x03\x2e\x00\x00\x13\x00\x00\x80\x3f\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x04\x2e\x00\x00\x10\x04\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x05\x2e\x00\x00\x10\x00\x0f\x94\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x01\x2e\x00\x00\x12\x00\x00\x00\x00\x00\x00\x00\x00\x0f\x94\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x02\x2e\x00\x00\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x0f\x94\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x03\x2e\x00\x00\x12\x00\x00\x00\x00\x00\x00\xf0\x3f\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x04\x2e\x00\x00\x10\x06\x0f\x8d\x80\x80\x80\x00\x00\x16\x09\x10\x08\x10\x05\x2e\x00\x00\x10\x00\x0f\x82\x80\x80\x80\x00\x00\x0f\x82\x80\x80\x80\x00\x00\x0f\x82\x80\x80\x80\x00\x00\x0f\x82\x80\x80\x80\x00\x00\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x40\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x41\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x42\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x43\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x44\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x45\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x46\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x47\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x48\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x49\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x4a\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x4b\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x4c\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x4d\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x4e\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x4f\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x50\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x51\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x52\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x53\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x54\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x55\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x56\x0b\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x33\x02\x00\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x2e\x00\x00\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x2f\x01\x00\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x16\x1f\x16\x0a\x0f\x8f\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x16\x0e\x17\x00\x0b\x16\x0a\x0f\x8e\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x0c\x16\x0f\x05\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x5b\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x5c\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x5d\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x5e\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x5f\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x60\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x61\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x62\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x63\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x64\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x65\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x66\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x67\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x68\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x69\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x6a\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x6b\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x6c\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x6d\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x6e\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x6f\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x70\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x71\x0b\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x11\x34\x03\x00\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x11\x30\x00\x00\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x11\x31\x01\x00\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x11\x32\x02\x00\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x16\x20\x16\x0a\x0f\x8f\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x16\x13\x17\x01\x0b\x16\x0a\x0f\x8e\x80\x80\x80\x00\x00\x16\x08\x16\x10\x16\x11\x16\x14\x05\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x75\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x76\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x77\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x78\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x7d\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x83\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x84\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x85\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x86\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x87\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x88\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x79\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x7a\x0b\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x16\x35\x02\x00\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x16\x21\x16\x0a\x0f\x8f\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x16\x18\x17\x02\x0b\x16\x0a\x0f\x8e\x80\x80\x80\x00\x00\x16\x08\x16\x15\x16\x16\x16\x19\x05\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x89\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x8a\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x8b\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x8c\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x91\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x97\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x98\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x99\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x9a\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x9b\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x9c\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x8d\x0b\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x8e\x0b\x16\x0a\x0f\x8d\x80\x80\x80\x00\x00\x16\x08\x16\x0b\x16\x1b\x36\x03\x00\x16\x0a\x0f\x8c\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x16\x22\x16\x0a\x0f\x8f\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x16\x1d\x17\x03\x0b\x16\x0a\x0f\x8e\x80\x80\x80\x00\x00\x16\x08\x16\x1a\x16\x1b\x16\x1e\x05\x0b\x16\x0a\x0f\x93\x80\x80\x80\x00\x00\x01\x01\x16\x08\x16\x0b\x16\x0c\x10\x00\x47\x07\x00\x0b\x16\x0a\x0f\x0f\x95\x80\x80\x80\x00\x00\x01\x01\x16\x08\x01\x01\x16\x0b\x16\x0c\x08\x01\x01\x00\x0f\x0b\x16\x0a\x0f\x0f");
assert_return(() => $$.exports["i32_add"](), 258);
assert_return(() => $$.exports["i64_add"](), 258);
assert_return(() => $$.exports["i32_sub"](), 258);
assert_return(() => $$.exports["i64_sub"](), 258);
assert_return(() => $$.exports["i32_mul"](), 258);
assert_return(() => $$.exports["i64_mul"](), 258);
assert_return(() => $$.exports["i32_div_s"](), 258);
assert_return(() => $$.exports["i64_div_s"](), 258);
assert_return(() => $$.exports["i32_div_u"](), 258);
assert_return(() => $$.exports["i64_div_u"](), 258);
assert_return(() => $$.exports["i32_rem_s"](), 258);
assert_return(() => $$.exports["i64_rem_s"](), 258);
assert_return(() => $$.exports["i32_rem_u"](), 258);
assert_return(() => $$.exports["i64_rem_u"](), 258);
assert_return(() => $$.exports["i32_and"](), 258);
assert_return(() => $$.exports["i64_and"](), 258);
assert_return(() => $$.exports["i32_or"](), 258);
assert_return(() => $$.exports["i64_or"](), 258);
assert_return(() => $$.exports["i32_xor"](), 258);
assert_return(() => $$.exports["i64_xor"](), 258);
assert_return(() => $$.exports["i32_shl"](), 258);
assert_return(() => $$.exports["i64_shl"](), 258);
assert_return(() => $$.exports["i32_shr_u"](), 258);
assert_return(() => $$.exports["i64_shr_u"](), 258);
assert_return(() => $$.exports["i32_shr_s"](), 258);
assert_return(() => $$.exports["i64_shr_s"](), 258);
assert_return(() => $$.exports["i32_eq"](), 258);
assert_return(() => $$.exports["i64_eq"](), 258);
assert_return(() => $$.exports["i32_ne"](), 258);
assert_return(() => $$.exports["i64_ne"](), 258);
assert_return(() => $$.exports["i32_lt_s"](), 258);
assert_return(() => $$.exports["i64_lt_s"](), 258);
assert_return(() => $$.exports["i32_le_s"](), 258);
assert_return(() => $$.exports["i64_le_s"](), 258);
assert_return(() => $$.exports["i32_lt_u"](), 258);
assert_return(() => $$.exports["i64_lt_u"](), 258);
assert_return(() => $$.exports["i32_le_u"](), 258);
assert_return(() => $$.exports["i64_le_u"](), 258);
assert_return(() => $$.exports["i32_gt_s"](), 258);
assert_return(() => $$.exports["i64_gt_s"](), 258);
assert_return(() => $$.exports["i32_ge_s"](), 258);
assert_return(() => $$.exports["i64_ge_s"](), 258);
assert_return(() => $$.exports["i32_gt_u"](), 258);
assert_return(() => $$.exports["i64_gt_u"](), 258);
assert_return(() => $$.exports["i32_ge_u"](), 258);
assert_return(() => $$.exports["i64_ge_u"](), 258);
assert_return(() => $$.exports["i32_store"](), 258);
assert_return(() => $$.exports["i64_store"](), 258);
assert_return(() => $$.exports["i32_store8"](), 258);
assert_return(() => $$.exports["i64_store8"](), 258);
assert_return(() => $$.exports["i32_store16"](), 258);
assert_return(() => $$.exports["i64_store16"](), 258);
assert_return(() => $$.exports["i64_store32"](), 258);
assert_return(() => $$.exports["i32_call"](), 258);
assert_return(() => $$.exports["i64_call"](), 258);
assert_return(() => $$.exports["i32_call_indirect"](), 66052);
assert_return(() => $$.exports["i64_call_indirect"](), 66052);
assert_return(() => $$.exports["i32_select"](), 66053);
assert_return(() => $$.exports["i64_select"](), 66053);
assert_return(() => $$.exports["f32_add"](), 258);
assert_return(() => $$.exports["f64_add"](), 258);
assert_return(() => $$.exports["f32_sub"](), 258);
assert_return(() => $$.exports["f64_sub"](), 258);
assert_return(() => $$.exports["f32_mul"](), 258);
assert_return(() => $$.exports["f64_mul"](), 258);
assert_return(() => $$.exports["f32_div"](), 258);
assert_return(() => $$.exports["f64_div"](), 258);
assert_return(() => $$.exports["f32_copysign"](), 258);
assert_return(() => $$.exports["f64_copysign"](), 258);
assert_return(() => $$.exports["f32_eq"](), 258);
assert_return(() => $$.exports["f64_eq"](), 258);
assert_return(() => $$.exports["f32_ne"](), 258);
assert_return(() => $$.exports["f64_ne"](), 258);
assert_return(() => $$.exports["f32_lt"](), 258);
assert_return(() => $$.exports["f64_lt"](), 258);
assert_return(() => $$.exports["f32_le"](), 258);
assert_return(() => $$.exports["f64_le"](), 258);
assert_return(() => $$.exports["f32_gt"](), 258);
assert_return(() => $$.exports["f64_gt"](), 258);
assert_return(() => $$.exports["f32_ge"](), 258);
assert_return(() => $$.exports["f64_ge"](), 258);
assert_return(() => $$.exports["f32_min"](), 258);
assert_return(() => $$.exports["f64_min"](), 258);
assert_return(() => $$.exports["f32_max"](), 258);
assert_return(() => $$.exports["f64_max"](), 258);
assert_return(() => $$.exports["f32_store"](), 258);
assert_return(() => $$.exports["f64_store"](), 258);
assert_return(() => $$.exports["f32_call"](), 258);
assert_return(() => $$.exports["f64_call"](), 258);
assert_return(() => $$.exports["f32_call_indirect"](), 66052);
assert_return(() => $$.exports["f64_call_indirect"](), 66052);
assert_return(() => $$.exports["f32_select"](), 66053);
assert_return(() => $$.exports["f64_select"](), 66053);
assert_return(() => $$.exports["br_if"](), 258);
assert_return(() => $$.exports["br_table"](), 258);
