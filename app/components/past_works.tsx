"use client";
import { PublicationLinkTags } from "@/app/components/publication_link_tags";
import { AbstractThumbnail } from "@/app/components/abstract_thumbnail";
import type { PublicationItemList, PublicationItemProps } from "@/app/components/publication-types";

export type PastWorkItem = {
    title: string,
    year: number,
    abstract: string,
    project_link: string,
    link_image: string,
    link_acm: string,
    link_arxiv: string,
    link_ieee: string,
    link_youtube: string,
    link_github: string,
    link_pdf: string,
    featured: boolean,
}

export type PastWorkItemList = {
    past_works: PastWorkItem[]
}

export function PastWorkItem(props: PublicationItemProps) {
    return (
        <div className="mb-8 border-b border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="col-start-1">
                    {props.link_image && <img
                        src={props.link_image}
                        alt={props.title}
                        width={345}
                        height={200}
                        className="mb-4 w-full rounded-xl"
                    />}
                    {!props.link_image && (
                        <AbstractThumbnail className="mb-4 rounded-xl" />
                    )}
                </div>
                <div className="sm:col-span-2">
                    <div className="inset-x-0 bottom-0">
                        <h3 className="text-lg font-bold mb-1">{props.title}</h3>
                        <div className = "text-sm inset-x-0 bottom-0 mb-1 font-bold">
                            {props.conference}
                        </div>
                        {props.award && (
                            <><div className = "mb">
                                <b className='award text-xs'>
                                    {props.award}
                                </b></div>
                            </>
                            )}
                        <p className="text-sm text-muted-foreground text-left sm:text-justify">
                            {props.abstract}
                        </p>
                    </div>
                    <PublicationLinkTags publication={props} />
                </div>
            </div>
        </div>
    )
};

export function PastWorkSeciton(props: PublicationItemList) {
    return(
        <section className="mb-12">
            <h2 className="text-xl font-bold mb-12">Past Works</h2>
                {
                props.publications.filter((item: PublicationItemProps) => item.featured)
                .map((item: PublicationItemProps, index: number) => (
                    <PastWorkItem key={index} {...item} />
                ))}
        </section>
    )
}
