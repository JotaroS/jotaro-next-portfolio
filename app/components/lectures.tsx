export default function TeachingsSection({ lectureItems }:any) {
    return (
        <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">Teachings</h2>
            <ul className="text-sm list-disc ml-5">
                {lectureItems.map((item: any, index: any) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </section>
    )
}

