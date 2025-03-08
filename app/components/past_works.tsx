"use client";
import {PublicationItemList, PublicationItemProps } from "@/app/components/publication_item"

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
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="col-start-1">
                    {props.link_image && <img
                        src={props.link_image}
                        alt="Your Name"
                        width={345}
                        height={200}
                        className="mb-4 rounded-xl"
                    />}
                    {!props.link_image && <img
                        src={"/placeholder.jpg"}
                        alt="Your Name"
                        width={345}
                        height={200}
                        className="mb-4 rounded-xl"
                    />}
                </div>
                <div className="col-span-2">
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
                        <p className="text-sm text-muted-foreground text-justify">
                            {props.abstract}
                        </p>
                    </div>
                    <section className="mb-2">
                    {props.link_acm && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-sky-600 to-blue-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" onClick={() => window.open(props.link_acm)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    ACM
                    </span>
                    </button>
                    }

                    {props.link_arxiv && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-700 to-red-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                    onClick={() => window.open(props.link_arxiv)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    arXiv
                    </span>
                    </button>}

                    {props.link_ieee && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-800 to-teal-600 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                    onClick={() => window.open(props.link_ieee)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    IEEE
                    </span>
                    </button>}

                    {/* youtube */}
                    {props.link_youtube && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-700 to-red-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                    onClick={() => window.open(props.link_youtube)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    youtube
                    </span>
                    </button>}

                    {/* github */}
                    {props.link_github && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-gray-700 to-gray-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                    onClick={() => window.open(props.link_github)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    project
                    </span>
                    </button>}

                    {/* pdf */}
                    {props.link_pdf && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-700 to-yellow-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                    onClick={() => window.open(props.link_pdf)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    pdf
                    </span>
                    </button>}

                    {/* US Patent */}
                    {props.link_us_patent && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-700 to-green-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white"
                    onClick={() => window.open(props.link_us_patent)}>
                    <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                    US Patent
                    </span>
                    </button>}
                    </section>
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