"use client";
export type PublicationItemList = {
    publications: PublicationItemProps[]
}

export type PublicationItemProps = {
    title: string
    authors: string[]
    conference: string
    type: string
    award: string
    
}

export function PublicationItem(props: PublicationItemProps) {
    return (
        <div>
            <div className="border-b pb-4 border-gray-600">
                <h3 className="font-semibold mb-1 text-base">{props.title}</h3>
                {props.award && (
                    <><div className='my-1'>
                        <b className='award'>
                            {props.award}
                        </b></div>
                    </>
                )}
                <p className="text-muted-foreground text-dimmed-light dark:text-dimmed-dark">
                    {props.authors.map((author: string, index: number) => (
                        <span key={index}>{author}{index === props.authors.length - 1 ? "" : ", "}</span>
                    ))}
                </p>
                <p className="text-muted-foreground text-dimmed-light dark:text-dimmed-dark">
                    {props.conference}
                </p>
                {/* <Link href="#" className="text-primary hover:underline">
                    Read More
                </Link> */}

                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-sky-600 to-blue-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                ACM
                </span>
                </button>

                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-700 to-red-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                arXiv
                </span>
                </button>

                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-800 to-teal-600 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                IEEE
                </span>
                </button>

                {/* youtube */}
                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-700 to-red-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                youtube
                </span>
                </button>

                {/* github */}
                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-gray-700 to-gray-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                project
                </span>
                </button>

                {/* pdf */}
                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-700 to-yellow-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
                onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                pdf
                </span>
                </button>

                {/* US Patent */}
                <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-700 to-green-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white"
                onClick={() => window.open("https://dl.acm.org/doi/10.1145/3447548.3467234")}>
                <span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
                US Patent
                </span>
                </button>

            </div>
        </div>)
}


export default function PublicationSection(props: PublicationItemList) {
    return (
        <section className="mb-10">
            <h2 className="text-lg font-bold mb-10">Publications</h2>
            <h3 className="text-base font-bold mb-4">Journals</h3>
            <ul className="text-sm space-y-4 mb-10 list-decimal">
                {props.publications.filter(
                    (item: PublicationItemProps) => item.type === "journal"
                ).map((item: PublicationItemProps, index: number) => (
                    <PublicationItem key={index} {...item} />
                ))}

            </ul>
            <h3 className="text-base font-bold mb-4">Proceedings</h3>
            <ul className="text-sm space-y-4 mb-10 list-decimal">
            {props.publications.filter(
                    (item: PublicationItemProps) => item.type === "proceedings"
                ).map((item: PublicationItemProps, index: number) => (
                    // assign index to item.idx
                    <PublicationItem key={index} {...item} />
                ))}
            </ul>
        </section>
    )
}