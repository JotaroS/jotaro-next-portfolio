import { getPostData, getSortedPostsData } from '../../../lib/posts'
import { marked } from 'marked'

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData('hello-world')
  const contentHtml = marked(postData.content)

  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* <div className="container mx-auto  flex flex-col lg:flex-row"> */}
        <article className="">
          <div className='font-serif'>Research</div>
          <h1 className="text-4xl font-light mb-2">{postData.title}</h1>
          <div className="text-gray-600 mb-12 text-sm">{postData.date}</div>
          <div className="myMarkdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />  
        </article>
      </div>
    // </div>
  )
}
