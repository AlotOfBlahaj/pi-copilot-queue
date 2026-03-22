import { EXTENSION_COMMAND } from "./constants.js";

export type QueueCommand =
  | { name: "add"; value: string }
  | { name: "list" }
  | { name: "clear" }
  | { name: "fallback"; value: string }
  | { name: "done" }
  | { name: "stop" }
  | { name: "capture"; mode: string }
  | { name: "providers"; value: string }
  | { name: "settings" }
  | { name: "autopilot-on" }
  | { name: "autopilot-off" }
  | { name: "autopilot-add"; value: string }
  | { name: "autopilot-list" }
  | { name: "autopilot-clear" }
  | { name: "session-reset" }
  | { name: "session-status" }
  | { name: "session-threshold"; minutes: string; toolCalls: string }
  | { name: "wait-timeout"; seconds: string }
  | { name: "help" };

export function buildHelpText(): string {
  return [
    `/${EXTENSION_COMMAND} add <message>`,
    `/${EXTENSION_COMMAND} list`,
    `/${EXTENSION_COMMAND} clear`,
    `/${EXTENSION_COMMAND} fallback <message>`,
    `/${EXTENSION_COMMAND} done`,
    `/${EXTENSION_COMMAND} stop`,
    `/${EXTENSION_COMMAND} capture <on|off>`,
    `/${EXTENSION_COMMAND} providers [global|project] <name... | off>`,
    `/${EXTENSION_COMMAND} settings`,
    `/${EXTENSION_COMMAND} autopilot on`,
    `/${EXTENSION_COMMAND} autopilot off`,
    `/${EXTENSION_COMMAND} autopilot add <message>`,
    `/${EXTENSION_COMMAND} autopilot list`,
    `/${EXTENSION_COMMAND} autopilot clear`,
    `/${EXTENSION_COMMAND} session status`,
    `/${EXTENSION_COMMAND} session reset`,
    `/${EXTENSION_COMMAND} session threshold <minutes> <tool-calls>`,
    `/${EXTENSION_COMMAND} wait-timeout <seconds>`,
    `/${EXTENSION_COMMAND} help`,
  ].join("\n");
}

export function buildCommandArgumentCompletions(
  prefix: string
): { value: string; label: string }[] | null {
  const suggestions = getCommandSuggestions(prefix);
  if (suggestions.length === 0) {
    return null;
  }

  return suggestions.map((value) => ({ value, label: value }));
}

export function parseCommand(raw: string): QueueCommand {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { name: "help" };

  const firstSpace = trimmed.indexOf(" ");
  const command = (firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace)).toLowerCase();
  const rest = firstSpace === -1 ? "" : trimmed.slice(firstSpace + 1).trim();

  switch (command) {
    case "add":
      return { name: "add", value: rest };
    case "list":
      return { name: "list" };
    case "clear":
      return { name: "clear" };
    case "fallback":
      return { name: "fallback", value: rest };
    case "done":
      return { name: "done" };
    case "stop":
      return { name: "stop" };
    case "capture":
      return { name: "capture", mode: rest };
    case "providers":
      return { name: "providers", value: rest };
    case "settings":
      return { name: "settings" };
    case "autopilot":
      return parseAutopilot(rest);
    case "session":
      return parseSession(rest);
    case "wait-timeout":
      return { name: "wait-timeout", seconds: rest };
    default:
      return { name: "help" };
  }
}

function getCommandSuggestions(prefix: string): string[] {
  const trimmed = prefix.trimStart();
  if (!trimmed) {
    return [
      "add ",
      "list",
      "clear",
      "fallback ",
      "done",
      "stop",
      "capture ",
      "providers ",
      "settings",
      "autopilot ",
      "session ",
      "wait-timeout ",
      "help",
    ];
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0]?.toLowerCase() ?? "";

  if (parts.length === 1 && !prefix.endsWith(" ")) {
    return [
      "add ",
      "list",
      "clear",
      "fallback ",
      "done",
      "stop",
      "capture ",
      "providers ",
      "settings",
      "autopilot ",
      "session ",
      "wait-timeout ",
      "help",
    ].filter((item) => item.startsWith(trimmed));
  }

  switch (command) {
    case "capture":
      return matchNestedSuggestions(prefix, ["capture on", "capture off"]);
    case "providers":
      return getProviderSuggestions(prefix);
    case "autopilot":
      return matchNestedSuggestions(prefix, [
        "autopilot on",
        "autopilot off",
        "autopilot add ",
        "autopilot list",
        "autopilot clear",
      ]);
    case "session":
      return matchNestedSuggestions(prefix, [
        "session status",
        "session reset",
        "session threshold ",
      ]);
    case "wait-timeout":
      return matchNestedSuggestions(prefix, [
        "wait-timeout 0",
        "wait-timeout 30",
        "wait-timeout 60",
      ]);
    default:
      return [];
  }
}

function matchNestedSuggestions(prefix: string, suggestions: string[]): string[] {
  const trimmed = prefix.trimStart();
  return suggestions.filter((item) => item.startsWith(trimmed));
}

function getProviderSuggestions(prefix: string): string[] {
  return matchNestedSuggestions(prefix, [
    "providers global ",
    "providers project ",
    "providers show",
    "providers list",
    "providers status",
    "providers set ",
    "providers off",
    "providers clear",
    "providers global set ",
    "providers global off",
    "providers project set ",
    "providers project off",
  ]);
}

function parseAutopilot(raw: string): QueueCommand {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { name: "help" };

  const firstSpace = trimmed.indexOf(" ");
  const subcommand =
    firstSpace === -1 ? trimmed.toLowerCase() : trimmed.slice(0, firstSpace).toLowerCase();
  const rest = firstSpace === -1 ? "" : trimmed.slice(firstSpace + 1).trim();

  switch (subcommand) {
    case "on":
      return { name: "autopilot-on" };
    case "off":
      return { name: "autopilot-off" };
    case "add":
      return { name: "autopilot-add", value: rest };
    case "list":
      return { name: "autopilot-list" };
    case "clear":
      return { name: "autopilot-clear" };
    default:
      return { name: "help" };
  }
}

function parseSession(raw: string): QueueCommand {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { name: "help" };

  const parts = trimmed.split(/\s+/);
  const subcommand = parts[0]?.toLowerCase();

  switch (subcommand) {
    case "reset":
      return { name: "session-reset" };
    case "status":
      return { name: "session-status" };
    case "threshold": {
      const minutes = parts[1] ?? "";
      const toolCalls = parts[2] ?? "";
      return { name: "session-threshold", minutes, toolCalls };
    }
    default:
      return { name: "help" };
  }
}
