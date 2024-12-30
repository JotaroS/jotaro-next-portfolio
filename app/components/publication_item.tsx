import Link from "next/link"
export function PublicationItem(props: any) {
    return (
        <div>
            <div className="border-b pb-4 border-gray-600">
                <h3 className="font-semibold">[{props.pub_idx}] {props.pub_item.title}</h3>
                <p className="text-muted-foreground text-dimmed-light dark:text-dimmed-dark">
                    {props.pub_item.authors.map((author: any, index: any) => (
                        <span key={index}>{author}{index === props.pub_item.authors.length - 1 ? "" : ", "}</span>
                    ))}
                </p>
                <p className="text-muted-foreground text-dimmed-light dark:text-dimmed-dark">
                    {props.pub_item.publisher}, {props.pub_item.year}
                </p>

                <Link href="#" className="text-primary hover:underline">
                    Read More
                </Link>
            </div>
        </div>)
}


export default function PublicationSection({props}: any) {
    // console.log(props)
    return (
        <section className="mb-10">
            <h2 className="text-lg font-bold mb-10">Publications</h2>
            <h3 className="text-base font-bold mb-4">Journals</h3>
            <ul className="text-sm space-y-4 mb-10">
                {props.filter(
                    (item: any) => item.type === "journal"
                ).map((item: any, index: any) => (
                    <PublicationItem key={index} pub_idx={index+1} pub_item={item} />
                    // <li key={index}>{item.title}</li>
                ))}

            </ul>
            <h3 className="text-base font-bold mb-4">Proceedings</h3>
            <ul className="text-sm space-y-4 mb-10">
            {props.filter(
                    (item: any) => item.type === "proceedings"
                ).map((item: any, index: any) => (
                    <PublicationItem key={index} pub_idx={index+1} pub_item={item} />
                    // <li key={index}>{item.title}</li>
                ))}
            </ul>
        </section>
    )
}