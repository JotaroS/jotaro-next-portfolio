"use client";

import type { PublicationItemProps } from "@/app/components/publication-types";

type LinkTagDescriptor = {
  label: string;
  className: string;
  getUrl: (publication: PublicationItemProps) => string | undefined;
};

const LINK_TAGS: LinkTagDescriptor[] = [
  {
    label: "ACM",
    className: "bg-gradient-to-br from-sky-600 to-blue-500",
    getUrl: (publication) => publication.link_acm,
  },
  {
    label: "arXiv",
    className: "bg-gradient-to-br from-red-700 to-red-500",
    getUrl: (publication) => publication.link_arxiv,
  },
  {
    label: "IEEE",
    className: "bg-gradient-to-br from-cyan-800 to-teal-600",
    getUrl: (publication) => publication.link_ieee,
  },
  {
    label: "youtube",
    className: "bg-gradient-to-br from-red-700 to-red-500",
    getUrl: (publication) => publication.link_youtube,
  },
  {
    label: "project",
    className: "bg-gradient-to-br from-gray-700 to-gray-500",
    getUrl: (publication) => publication.link_project ?? publication.link_github,
  },
  {
    label: "pdf",
    className: "bg-gradient-to-br from-yellow-700 to-yellow-500",
    getUrl: (publication) => publication.link_pdf,
  },
  {
    label: "US Patent",
    className: "bg-gradient-to-br from-green-700 to-green-500",
    getUrl: (publication) => publication.link_us_patent,
  },
];

type PublicationLinkTagsProps = {
  publication: PublicationItemProps;
};

export function PublicationLinkTags({ publication }: PublicationLinkTagsProps) {
  const tags = LINK_TAGS.map((tag) => ({
    ...tag,
    url: tag.getUrl(publication),
  })).filter((tag) => Boolean(tag.url));

  return (
    <section className="mb-2">
      {tags.map((tag) => (
        <button
          key={tag.label}
          className={`relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group ${tag.className} group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white`}
          onClick={() => window.open(tag.url)}
        >
          <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
            {tag.label}
          </span>
        </button>
      ))}
    </section>
  );
}
