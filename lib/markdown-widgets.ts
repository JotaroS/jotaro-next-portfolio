export type WidgetDefinition = {
  id: string;
  type: string;
  props: Record<string, string>;
};

export type MarkdownWidgetExtraction = {
  content: string;
  widgets: WidgetDefinition[];
};

const WIDGET_TAG_REGEX = /<widget\b([^>]*)\/?>/gi;
const WIDGET_COMMENT_REGEX = /<!--WIDGET:([a-zA-Z0-9_-]+)-->/g;
// Matches ```mermaid ... ``` fences (3+ backticks)
const MERMAID_FENCE_REGEX = /^(`{3,})mermaid[ \t]*\r?\n([\s\S]*?)^\1[ \t]*(?:\r?\n|$)/gm;

function parseWidgetAttributes(rawAttributes: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attributeRegex = /([a-zA-Z_][\w.-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  let match: RegExpExecArray | null = attributeRegex.exec(rawAttributes);
  while (match) {
    const key = match[1];
    const value = match[3] ?? match[4] ?? match[5] ?? "";
    attributes[key] = value;
    match = attributeRegex.exec(rawAttributes);
  }

  return attributes;
}

export function extractWidgetsFromMarkdown(markdown: string): MarkdownWidgetExtraction {
  const widgets: WidgetDefinition[] = [];
  let widgetIndex = 0;

  // Extract mermaid fences first so they aren't processed by marked's code highlighter
  const afterMermaid = markdown.replace(MERMAID_FENCE_REGEX, (_, _fence: string, code: string) => {
    widgetIndex += 1;
    const id = `mermaid-${widgetIndex}`;
    widgets.push({ id, type: "mermaid", props: { code } });
    return `\n\n<!--WIDGET:${id}-->\n\n`;
  });

  const content = afterMermaid.replace(WIDGET_TAG_REGEX, (_, rawAttributes: string) => {
    widgetIndex += 1;
    const id = `widget-${widgetIndex}`;
    const attributes = parseWidgetAttributes(rawAttributes);
    const type = attributes.type ?? "dice-roll";
    delete attributes.type;

    widgets.push({
      id,
      type,
      props: attributes,
    });

    return `\n\n<!--WIDGET:${id}-->\n\n`;
  });

  return { content, widgets };
}

export type RenderSegment = {
  html: string;
  widgetId?: string;
};

export function splitHtmlByWidgets(html: string): RenderSegment[] {
  const segments: RenderSegment[] = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null = WIDGET_COMMENT_REGEX.exec(html);
  while (match) {
    const before = html.slice(lastIndex, match.index);
    if (before) {
      segments.push({ html: before });
    }

    segments.push({
      html: "",
      widgetId: match[1],
    });

    lastIndex = match.index + match[0].length;
    match = WIDGET_COMMENT_REGEX.exec(html);
  }

  const rest = html.slice(lastIndex);
  if (rest) {
    segments.push({ html: rest });
  }

  return segments;
}
