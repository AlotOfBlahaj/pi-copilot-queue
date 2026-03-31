export const EXTENSION_NAME = "Copilot Queue";
export const EXTENSION_COMMAND = "copilot-queue";
export const TOOL_NAME = "ask_user";
export const STATE_ENTRY_TYPE = "copilot-queue:state";

export const DEFAULT_FALLBACK_RESPONSE = "continue";

export const DEFAULT_WARNING_MINUTES = 120;
export const DEFAULT_WARNING_TOOL_CALLS = 50;
export const DEFAULT_WAIT_TIMEOUT_SECONDS = 0;

export const COPILOT_ASK_USER_REMINDER_MESSAGE = [
  "Call ask_user after each completed step instead of replying directly.",
  "Stop the ask_user loop only when the user explicitly replies with stop, end, terminate, or quit.",
].join("\n");
