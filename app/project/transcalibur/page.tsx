import { getPostData, getSortedPostsData } from '../../../lib/posts'
import { marked } from 'marked'

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData("hello-world")
  const contentHtml = marked(postData.content)

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
      <div className="text-gray-600 mb-4">{postData.date}</div>
      <div 
      dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  )
}

