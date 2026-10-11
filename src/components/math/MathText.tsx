import katex from "katex";
import { Fragment, useMemo } from "react";

interface MathTextProps {
  children: string;
  className?: string;
}

const SEGMENT_RE = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;

/**
 * Renderizza testo misto italiano + LaTeX: `$x^2$` -> formula inline,
 * `$$x^2$$` -> formula in blocco. Usato ovunque compaia matematica negli
 * esercizi, così non dipendiamo mai da caratteri unicode "fatti a mano".
 */
export function MathText({ children, className }: MathTextProps) {
  const segments = useMemo(() => children.split(SEGMENT_RE), [children]);

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        const key = `${i}-${segment.slice(0, 8)}`;
        if (segment.startsWith("$$") && segment.endsWith("$$")) {
          return (
            <Katex key={key} expr={segment.slice(2, -2)} displayMode block />
          );
        }
        if (segment.startsWith("$") && segment.endsWith("$")) {
          return <Katex key={key} expr={segment.slice(1, -1)} />;
        }
        return <Fragment key={key}>{segment}</Fragment>;
      })}
    </span>
  );
}

function Katex({
  expr,
  displayMode = false,
  block = false,
}: {
  expr: string;
  displayMode?: boolean;
  block?: boolean;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(expr, {
        throwOnError: false,
        displayMode,
      }),
    [expr, displayMode],
  );
  const Tag = block ? "div" : "span";
  return (
    // biome-ignore lint: KaTeX output is trusted, generated locally from course content
    <Tag
      className={block ? "my-2" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
