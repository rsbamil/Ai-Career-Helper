import React from 'react'
import AiToolCard from './AiToolCard'
const aiToolList=[{
    name:"AI Career Q&A Chat",
    desc:"Chat wit AI Agent",
    icon:'/chatbot.png',
    button:'Lets Chat',
    path:'/ai-chat'
}
,{
    name:"AI Resume Analyzer",
    desc:"Improve your resume",
    icon:'/resume.png',
    button:'Analyze Now',
    path:'/ai-resume-analyzer'
}
,
{
    name:"Career Roadmap Generator",
    desc:"Generate your career roadmap",
    icon:'/roadmap.png',
    button:'Lets Chat',
    path:'/career-roadmap-generator'},
{
    name:"Cover Letter Generator",
    desc:"Generate your cover letter",
    icon:'/cover.png',
    button:'Create Now',
    path:'/cover-letter-generator'

}
]
function AITools() {
  return (
    <div className='mt-7 p-5 bg-white border rounded-xl'>
        <h2 className='font-bold text-lg'>Available AI </h2>
        <p>Start Building and Shape Your Future with the Power of AI. Discover a world of possibilities, from data analysis to creative problem</p>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4' >
            {aiToolList.map((tool,index)=>{
                return <AiToolCard tool={tool} key={index}/>
            })}
        </div>
    </div>
  )
}

export default AITools