import assert from "node:assert/strict";
import test from "node:test";
import { buildHelpText, parseCommand } from "../src/commands.js";

void test("parseCommand parses add", () => {
  assert.deepEqual(parseCommand("add hello world"), { name: "add", value: "hello world" });
});

void test("parseCommand parses autopilot add", () => {
  assert.deepEqual(parseCommand("autopilot add continue with tests"), {
    name: "autopilot-add",
    value: "continue with tests",
  });
});

void test("parseCommand parses autopilot on", () => {
  assert.deepEqual(parseCommand("autopilot on"), { name: "autopilot-on" });
});

void test("parseCommand parses done", () => {
  assert.deepEqual(parseCommand("done"), { name: "done" });
});

void test("parseCommand returns help for unknown", () => {
  assert.deepEqual(parseCommand("wat"), { name: "help" });
});

void test("help includes key commands", () => {
  const help = buildHelpText();
  assert.match(help, /copilot-queue add/);
  assert.match(help, /copilot-queue clear/);
  assert.match(help, /copilot-queue done/);
  assert.match(help, /copilot-queue autopilot on/);
});
