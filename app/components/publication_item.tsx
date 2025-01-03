import Link from "next/link"

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
                <h3 className="font-semibold mb-1">{props.title}</h3>
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
                <Link href="#" className="text-primary hover:underline">
                    Read More
                </Link>
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