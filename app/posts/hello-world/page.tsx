import { getPostData, getSortedPostsData } from '../../../lib/posts'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function Post() {
  marked.use(markedKatex());
  const postData = await getPostData('hello-world')
  const contentHtml = await marked(postData.content)

  
  return (
    
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* <div className="container mx-auto  flex flex-col lg:flex-row"> */}
        <article className="">
          <div className='font-serif'>{postData.type}</div>
          <h1 className="text-4xl font-light mb-2">{postData.title}</h1>
          <div className="text-gray-600 mb-12 text-sm">{postData.date}</div>
          <div className="myMarkdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />  
        </article>
      </div>
    // </div>
  )
}
