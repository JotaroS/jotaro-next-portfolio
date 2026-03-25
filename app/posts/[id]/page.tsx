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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <div className="font-serif">{postData.type}</div>
        <h1 className="text-4xl font-light mb-2">{postData.title}</h1>
        <div className="text-gray-600 mb-12 text-sm">{postData.date}</div>
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
