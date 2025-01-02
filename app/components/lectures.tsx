
type LectureItem = {
    lecture_idx: number
    title: string
}

// json object of array of lectureitem
export type LectureItemProps = {
    lectures: LectureItem[]
}

export default function TeachingsSection(props :LectureItemProps) {
    return (
        <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">Teachings</h2>
            <ul className="text-sm list-disc ml-5">
                {props.lectures.map((item: LectureItem, index: number) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </section>
    )
}

