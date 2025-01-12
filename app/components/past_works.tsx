"use client";

export type PastWorkItem = {
    title: string,
    year: number,
    abstract: string,
    project_link: string,
    image_link: string,
}

export type PastWorkItemList = {
    past_works: PastWorkItem[]
}

export function PastWorkItem() {
    return (
        <div className="mb-8 border-b border-gray-600">
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="col-start-1">
                    <img
                        src={"/projects/pantograph.png"}
                        alt="Your Name"
                        width={345}
                        height={200}
                        className="mb-4 rounded-xl"
                    />
                </div>
                <div className="col-span-2">
                    <div className="inset-x-0 bottom-0">
                        <h3 className="text-lg font-bold mb-4">Trusscillator: a System for Fabricating Human-Scale Human-Powered Oscillating Devices</h3>
                        <p className="text-sm text-muted-foreground mb-4 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget sapien ac nisl tristique
                            fermentum. Nullam nec purus ac justo vestibulum fermentum. Nullam nec purus ac justo vestibulum
                            fermentum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget sapien ac nisl tristique
                            fermentum. Nullam nec purus ac justo vestibulum fermentum. Nullam nec purus ac justo vestibulum
                            fermentum.
                        </p>
                    </div>
                    <section>
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
                                project webpage
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
                    </section>
                </div>
            </div>
        </div>
    )
};

export function PastWorkSeciton(props: PastWorkItemList) {
    return(
        <section className="mb-12">
            <h2 className="text-xl font-bold mb-12">Past Works</h2>
                {props.past_works.map((item: PastWorkItem, index: number) => (
                    <PastWorkItem key={index} {...item} />
                ))}
        </section>
    )
}