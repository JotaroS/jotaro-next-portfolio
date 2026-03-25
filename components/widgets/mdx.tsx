import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import type { WidgetSpec } from "@/components/widgets/types";

type MdxWidgetProps = {
  type: string;
  [key: string]: string | undefined;
};

export function Widget(props: MdxWidgetProps) {
  const { type, ...rest } = props;
  const widget: WidgetSpec = {
    id: "mdx-widget",
    type,
    props: Object.fromEntries(
      Object.entries(rest)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, value as string])
    ),
  };

  return <WidgetRenderer widget={widget} />;
}

export const mdxWidgetComponents = {
  widget: Widget,
  Widget,
};
