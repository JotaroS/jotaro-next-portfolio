import Image from "next/image"
import Link from "next/link"
import PublicationSection from "@/app/components/publication_item"
import TeachingSection from "@/app/components/lectures"
import { LectureItemProps } from "@/app/components/lectures"
import { PublicationItemList } from "@/app/components/publication_item"
import {promises as fs} from 'fs'

export default async function Portfolio() {

  let lectureItems: LectureItemProps = { lectures: [] };
  let publications: PublicationItemList = {publications: []};

  try {
    // const res = await fetch('http://localhost:3000/lectures.json');
    const res = await fs.readFile('public/lectures.json', 'utf-8');
    const data = JSON.parse(res);
    // if (!res.ok) throw new Error('Failed to fetch lectures');
    lectureItems = { lectures: await data };
  } catch (error) {
    console.error('Error fetching lectures:', error);
  }

  try {
    // const res = await fetch('http://localhost:3000/lectures.json');
    const res = await fs.readFile('public/publications_dev.json', 'utf-8');
    const data = JSON.parse(res);
    publications = { publications: await data };
  } catch (error) {
    console.error('Error fetching lectures:', error);
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <nav className="flex items-center space-x-4 lg:space-x-6 ml-20">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto mt-8 flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="lg:w-1/3 lg:pr-8 mb-8 lg:mb-0">
          <div className="sticky top-20 mt-20">
            <img
              src={"/jotaro.JPG"}
              alt="Photography credit goes to Shinsuke Yasui, a professional photographer, taken in BRLO at Gleisdreieck, Berlin."
              width={300}
              height={300}
              className="mb-4"
            />

            <h1 className="text-xl font-bold text-left mt-10 mb-5">Jotaro Shigeyama, Ph.D.</h1>
            <div className="text-left mb-10">
              <p className="text-sm text-muted-foreground">Researcher at Sony</p>
              <p className="text-sm text-muted-foreground">Human-Computer Interaction</p>
            </div>

            <div className="space-y-2 mb-10 text-sm ">
              <p className="text-dimmed-light dark:text-dimmed-dark text-muted-foreground">Yamaguchi / Berlin / Tokyo</p>
            </div>

            <div className="space-y-2 mb-8 text-sm">
              {/* smaller text */}
              <p className="text-dimmed-light dark:text-dimmed-dark text-muted-foreground text-sm ">2014-2017 <b>B.Eng.</b> The University of Tokyo</p>
              <p className="text-dimmed-light dark:text-dimmed-dark text-muted-foreground text-sm ">2017-2020 <b>M.S.</b>   The University of Tokyo</p>
              <p className="text-dimmed-light dark:text-dimmed-dark text-muted-foreground text-sm ">2018-2024 <b>Dr.rer.nat.</b>   Hasso Plattner Institut, Germany</p>
            </div>

          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:w-2/3">
          <section className="mb-12">
            <h3 className="text-xl font-bold mt-20 mb-4">Profile</h3>
            <p className=" text-muted-foreground text-justify">
              <b>Jotaro Shigeyama</b> is currently Human-Computer Interaction researcher at Sony.
              Previously, he obtained Ph.D at Hasso Plattner Institute with Prof. Patrick Baudisch.
              He earned Bachelor & Master degree in Cyber Interface Lab with Prof. Michitaka Hirose in the University of Tokyo.
              He was a scholar of Funai Fountation for Information Technology scholarship since 2019.
              His project was presented in various top-tier international conference including ACM SIGGRAPH / CHI / UIST.
              His work has been awarded in such venue such as CHI Best Paper Nomination or SIGGRAPH SRC Semi-Finalist.
            </p>
            <h3 className="text-xl font-bold mt-12 mb-4">Research</h3>
            <p className=" text-muted-foreground text-justify">
              My research focuses on Human-Computer Interaction, with an emphasis on Virtual Reality, Augmented Reality, and Haptics.

              I engineer <b>haptic and virtual experiences that is derived from human perception</b>.
              My projects include a <b>haptic device that optimally shapes responses based on human characteristics of visual stimuli</b>,
              a gaming device enabling real-time experiences for visually impaired users,
              and <b>a VR space design tool tailored for the smallest space usage</b>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold mb-12">Past Works</h2>
            {[1, 2, 3].map((i) => (
            <div key={i} className="mb-8 border-b border-gray-600">
              {/* left 30% goes for photo, 70 goes for title and abstract of the project, bottom aligned.*/}
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="col-start-1">
                  <Image
                    src={"/globe.svg"}
                    alt="Your Name"
                    width={200}
                    height={200}
                    className="mb-4"
                  />
                </div>
                <div className="col-span-2">
                  <div className="inset-x-0 bottom-0">
                    <h3 className="text-lg font-bold mb-4">Project Title</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-justify">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget sapien ac nisl tristique
                      fermentum. Nullam nec purus ac justo vestibulum fermentum. Nullam nec purus ac justo vestibulum
                      fermentum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget sapien ac nisl tristique
                      fermentum. Nullam nec purus ac justo vestibulum fermentum. Nullam nec purus ac justo vestibulum
                      fermentum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            ))}

          </section>

          {/* pass publications */}
          <PublicationSection {...publications}/>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">Awards / Honors</h2>
            <ul className="text-sm list-disc ml-5">
              <li>UIST2021 Best Demo Award Honorable Mention, 2021</li>
              <li>CHI2019 Best Paper Honorable Mention, 2019</li>
              <li>SIGGRAPH Student Research Competition (SRC) Semi-Finalist for Transcalibur, 2018</li>
              <li>HackU 2015 UTxTama-art Grand Prize for Dokimakura</li>
              <li>HATAKEYAMA Award (JSME Best student award ), Mar,2014</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">Academic Services</h2>
            <h3 className="text-md mb-2">Organizing Committee</h3>
            <ul className="text-sm list-disc ml-5 mb-6">
              <li>ACM UIST2022 Discord Chair</li>
              <li>ACM UIST2021 Digital Participation Sub-Chair</li>
              <li>ACM UIST2019 Registration Chair</li>
              <li>ACM UIST2018 Registration Co-Chair</li>
            </ul>

            <h3 className="text-md mb-2">Program Committee</h3>
            <ul className="text-sm list-disc ml-5 mb-6">
              <li>ACM CHI2022 LBW</li>
            </ul>

            <h3 className="text-md mb-2">Reviewer</h3>
            <ul className="text-sm list-disc ml-5 mb-6">
              <li>CHI 2025, <b className='award'>Special Recognition for Outstanding Review</b></li>
              <li>IEEE VR 2023</li>
              <li>UIST 2023</li>
              <li>CHI 2022</li>
              <li>UIST 2022</li>
              <li>VRST 2022</li>
              <li>ACM SIGGRAPH Asia 2021 E-tech</li>
              <li>情報処理学会</li>
              <li>MobileHCI 2021</li>
              <li>ACM CHI2021</li>
              <li>ACM UIST2020</li>
              <li>IEEE Transaction on Haptics 2020</li>
              <li>ACM CHI2020</li>
              <li>ACM SIGGRAPH Asia 2018 E-tech</li>
            </ul>


          </section>

          <TeachingSection {...lectureItems}/>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">Exibitions / Invited Exhibitions</h2>
            <ul className="text-sm list-disc ml-5">
              <li>Transcalibur, 東京大学バーチャルリアリティ教育研究センター設立記念式典-東京大学が挑戦するバーチャルリアリティの未来-</li>
              <li>bryophytes.io, iiiExhibition 2017, The University of Tokyo</li>
              <li>ゆらゆら立体灯，マジカリアル～ＶＲ・ＡＲが作り出す不思議体験～，SKIPシティ 彩の国ビジュアルプラザ　映像ミュージアム</li>
              <li>Cyber Interface Lab Exhibition “Cybernetic Minds”, the University of Tokyo, 2017</li>
              <li>Agricultural Revolution 3.0 “第三の農業革命 もう一つの未来に映る 希望的な世界”, Farmbot, 山形県鶴岡市, http://agri-revolution3.com/, collaborated project with http://eugene-kangawa.com/</li>
            </ul>
          </section>
        </main>
      </div>

 　      {/* copyright */}
      <footer className="mt-20 border-t border-gray-600 py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; 2024 Jotaro Shigeyama. All rights reserved. Webpage made by create-next-app@latest.
        </p>
        </footer>

    </div>
  )
}