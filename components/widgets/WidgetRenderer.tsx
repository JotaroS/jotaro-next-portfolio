import { DiceMatchWidget } from "@/components/widgets/widgets/DiceMatchWidget";
import { DiceRollWidget } from "@/components/widgets/widgets/DiceRollWidget";
import { HeightDistributionWidget } from "@/components/widgets/widgets/HeightDistributionWidget";
import { MermaidWidget } from "@/components/widgets/widgets/MermaidWidget";
import type { WidgetSpec } from "@/components/widgets/types";

function parseNumber(value: string | undefined, fallback: number) {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseNumberArray(value: string | undefined) {
  if (!value) {
    return undefined;
  }
  const parsed = value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));
  return parsed.length ? parsed : undefined;
}

export function WidgetRenderer({ widget }: { widget: WidgetSpec }) {
  if (widget.type === "dice-roll") {
    return (
      <DiceRollWidget
        title={widget.props.title}
        initialRolls={parseNumber(widget.props.rolls, 600)}
        probabilities={parseNumberArray(widget.props.probabilities)}
      />
    );
  }

  if (widget.type === "dice-match") {
    return (
      <DiceMatchWidget
        title={widget.props.title}
        initialRolls={parseNumber(widget.props.rolls, 600)}
        hiddenProbabilities={parseNumberArray(widget.props.hidden)}
      />
    );
  }

  if (widget.type === "height-fit") {
    return <HeightDistributionWidget />;
  }

  if (widget.type === "mermaid") {
    return <MermaidWidget code={widget.props.code ?? ""} />;
  }

  return (
    <div className="not-prose my-6 rounded border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:border-slate-600">
      Unknown widget type: <code>{widget.type}</code>
    </div>
  );
}
