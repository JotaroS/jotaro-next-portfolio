import { Card, CardContent } from "@/components/ui/card"

import { getPostData, getSortedPostsData } from '../../lib/posts'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import Link from "next/link"

// import { Car } from "lucide-react"

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

interface BlogCardProps {
    title: string
    abstract: string
    date: string
    imageUrl?: string
  }

export function BlogCard({
    title,
    id,
    abstract,
    date,
    imageUrl = "/placeholder.svg?height=300&width=500",
  }: BlogCardProps){
    return (
      <Card className="w-full max-w-sm overflow-hidden rounded-lg border shadow-sm">
      {/* Image takes up 60% of the card height */}
      <div className="relative h-0 pb-[55%]">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* Text content takes up 40% of the card height */}
      <CardContent className="flex h-[45%] flex-col p-4">
        <p className="mt-2 text-sm text-muted-foreground">{date}</p>
        <Link href={`/posts/${id}`} className="no-underline">
        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-foreground">{title}</h3>
        </Link>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{abstract}</p>
      </CardContent>
    </Card>
    )
  }
  

export default async function Post() {
const allPostdata = getSortedPostsData()
  marked.use(markedKatex());
  return (
    
    <div className="max-w-6xl mx-auto px-4 py-8">
    {/* <div className="container mx-auto  flex flex-col lg:flex-row"> */}
        <h2 className="text-4xl font-bold py-10">Blog posts</h2>
        <div className="grid grid-cols-3 gap-6">
            {allPostdata.map(({id, title, abstract, thumbnail}) => (
                <BlogCard key={id} id={id} title={title} abstract={abstract} imageUrl={thumbnail}></BlogCard>
            ))}
        </div>
    </div>
  )
}
