import { notFound } from "next/navigation";
import { getAllPostIds, getPostData } from "@/lib/posts";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { WidgetRenderer } from "@/components/widgets";
import {
  extractWidgetsFromMarkdown,
  splitHtmlByWidgets,
} from "@/lib/markdown-widgets";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

const markdownParser = new Marked(
  markedKatex(),
  markedHighlight({
    langPrefix: "hljs language-",
    emptyLangClass: "hljs",
    highlight(code, language) {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }

      return hljs.highlightAuto(code).value;
    },
  })
);

export async function generateStaticParams() {
  return getAllPostIds().map((id) => ({
    id,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const safeId = decodeURIComponent(id);
  const validIds = new Set(getAllPostIds());

  if (!validIds.has(safeId)) {
    notFound();
  }

  const postData = getPostData(safeId);
  const extracted = extractWidgetsFromMarkdown(postData.content);
  const contentHtml = await markdownParser.parse(extracted.content);
  const segments = splitHtmlByWidgets(contentHtml);
  const widgetMap = new Map(extracted.widgets.map((widget) => [widget.id, widget]));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <article>
        {/* Article type badge */}
        {postData.type && (
          <div className="mb-4">
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-1">
              {postData.type}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-snug tracking-tight mb-4">
          {postData.title}
        </h1>

        {/* Date + tags */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
          <time dateTime={postData.date}>{postData.date}</time>
          {postData.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Abstract */}
        {postData.abstract && (
          <p className="text-sm text-muted-foreground leading-relaxed tracking-wide p-4 bg-muted/40 border border-border/60 rounded-xl mb-8">
            {postData.abstract}
          </p>
        )}

        <hr className="border-border mb-10" />

        <div className="myMarkdown">
          {segments.map((segment, index) => {
            if (segment.widgetId) {
              const widget = widgetMap.get(segment.widgetId);
              if (!widget) {
                return null;
              }
              return (
                <WidgetRenderer
                  key={`${segment.widgetId}-${index}`}
                  widget={widget}
                />
              );
            }

            return (
              <div
                key={`html-${index}`}
                dangerouslySetInnerHTML={{ __html: segment.html }}
              />
            );
          })}
        </div>
      </article>
    </div>
  );
}
