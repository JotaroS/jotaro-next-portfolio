
type ListItem = {
    lecture_idx: number
    title: string
}

// json object of array of lectureitem
export type ListItems = {
    sectionTitle: string
    lectures: ListItem[]
}

export default function TeachingsSection(props :ListItems) {
    return (
        <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">{props.sectionTitle}</h2>
            <ul className="text-sm list-disc ml-5">
                {props.lectures.map((item: ListItem, index: number) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </section>
    )
}

