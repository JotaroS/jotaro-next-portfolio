"use client";
import { PublicationLinkTags } from "@/app/components/publication_link_tags";
import type { PublicationItemList, PublicationItemProps } from "@/app/components/publication-types";

export function PublicationItem(props: PublicationItemProps) {
  return (
    <div>
      <div className="border-b pb-4 border-gray-600">
        <h3 className="font-semibold mb-1 text-base">{props.title}</h3>
        {props.award && (
          <div className="my-1">
            <b className="award">{props.award}</b>
          </div>
        )}
        <p className="text-muted-foreground text-dimmed-light dark:text-dimmed-dark">
          {props.authors.map((author: string, index: number) => (
            <span key={index}>
              {author}
              {index === props.authors.length - 1 ? "" : ", "}
            </span>
          ))}
        </p>
        <p className="text-muted-foreground text-dimmed-light dark:text-dimmed-dark">{props.conference}</p>
        <PublicationLinkTags publication={props} />
      </div>
    </div>
  );
}


export default function PublicationSection(props: PublicationItemList) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-10">Publications</h2>
      <h3 className="text-base font-bold mb-4">Journals</h3>
      <ul className="text-sm space-y-4 mb-10 list-decimal">
        {props.publications
          .filter((item: PublicationItemProps) => item.type === "journal")
          .map((item: PublicationItemProps, index: number) => (
            <PublicationItem key={index} {...item} />
          ))}
      </ul>
      <h3 className="text-base font-bold mb-4">Proceedings</h3>
      <ul className="text-sm space-y-4 mb-10 list-decimal">
        {props.publications
          .filter((item: PublicationItemProps) => item.type === "proceedings")
          .map((item: PublicationItemProps, index: number) => (
            <PublicationItem key={index} {...item} />
          ))}
      </ul>
    </section>
  );
}
