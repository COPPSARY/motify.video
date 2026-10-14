/** Template blanks are `[LABEL]`, `[LABEL: hint]` or `[LABEL, default value]`, and may nest. */
export interface PromptField {
  readonly key: string;
  readonly token: string;
  readonly tokens: readonly string[];
  readonly label: string;
  readonly hint: string;
}

export function extractPromptFields(prompt: string): readonly PromptField[] {
  const tokens: string[] = [];
  let depth = 0;
  let start = -1;

  for (let index = 0; index < prompt.length; index += 1) {
    if (prompt[index] === '[') {
      if (depth === 0) start = index;
      depth += 1;
    } else if (prompt[index] === ']' && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        const token = prompt.slice(start, index + 1);
        if (!tokens.includes(token)) tokens.push(token);
        start = -1;
      }
    }
  }

  const fields: Array<{
    key: string;
    token: string;
    tokens: string[];
    label: string;
    hint: string;
  }> = [];

  for (const token of tokens) {
    const content = token.slice(1, -1);
    const colon = content.indexOf(':');
    const defaultMarker = ', default ';
    const defaultSeparator = content.indexOf(defaultMarker);
    const label = (
      colon >= 0
        ? content.slice(0, colon)
        : defaultSeparator >= 0
          ? content.slice(0, defaultSeparator)
          : content
    ).trim();
    const hint =
      colon >= 0
        ? content.slice(colon + 1).trim()
        : defaultSeparator >= 0
          ? `default ${content.slice(defaultSeparator + defaultMarker.length).trim()}`
          : `Enter ${label.toLowerCase()}`;
    const existing = fields.find((field) => field.key === label);
    if (existing) {
      existing.tokens.push(token);
    } else {
      fields.push({ key: label, token, tokens: [token], label, hint });
    }
  }

  return fields;
}

export function populatePrompt(
  prompt: string,
  fields: readonly PromptField[],
  values: Readonly<Record<string, string>>,
): string {
  return fields.reduce((result, field) => {
    const value = values[field.key]?.trim();
    return value
      ? field.tokens.reduce((populated, token) => populated.split(token).join(value), result)
      : result;
  }, prompt);
}
