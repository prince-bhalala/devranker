// import { NextRequest, NextResponse } from 'next/server'
// import pdfParse from 'pdf-parse'
// import OpenAI from 'openai'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// })

// export async function POST(req: NextRequest) {
//   try {
//     console.log("hello")
//     const formData = await req.formData()
//     const file = formData.get('resume') as File

//     if (!file || !(file instanceof File)) {
//       return NextResponse.json({ success: false, message: 'No resume uploaded' }, { status: 400 })
//     }

//     // Convert uploaded File to Buffer
//     const buffer = Buffer.from(await file.arrayBuffer())

//     // Parse text from PDF
//     const parsed = await pdfParse(buffer)
//     const resumeText = parsed.text

//     // Send to OpenAI for smart extraction
//     const prompt = `
// Extract the following information from the resume text below:
// - Full Name
// - Email
// - Skills (as an array)
// - Education (list)
// - Work Experience (list)
// - Projects (name + short description)
// - Achievements (if mentioned)

// Return only this JSON structure:

// {
//   "name": "",
//   "email": "",
//   "skills": [],
//   "education": [],
//   "experience": [],
//   "projects": [],
//   "achievements": []
// }

// Resume Text:
// """
// ${resumeText}
// """
//     `.trim()

//     const chatCompletion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       temperature: 0.3,
//     })

//     const content = chatCompletion.choices[0]?.message?.content

//     let extracted
//     try {
//       extracted = JSON.parse(content!)
//     } catch (err) {
//       return NextResponse.json({
//         success: false,
//         message: 'Failed to parse GPT JSON response',
//         raw: content,
//       }, { status: 500 })
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Resume parsed successfully',
//       data: extracted,
//     }, { status: 200 })
//   } catch (error) {
//     console.error('❌ Error in resume reader:', error)
//     return NextResponse.json({
//       success: false,
//       message: 'Server error while reading resume',
//     }, { status: 500 })
//   }
// }
import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import OpenAI from 'openai'
import {User} from 'next-auth'
import { getServerSession } from 'next-auth'
import {authOptions} from '../auth/[...nextauth]/options'
import UserModel from '@/model/User.model'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Make sure this is set in .env
})

export async function POST(req: NextRequest) {
  try {

    // connect db 
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if (!session || !session.user) {
        return NextResponse.json({
            success : false,
            message : "Not Autenticated"
        })
    }

    const data = await req.formData()
    const file = data.get('resume') as File

    if (!file) {
      return NextResponse.json({ success: false, message: 'No resume uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = await pdfParse(buffer)
    const text = parsed.text

    const prompt = `
Extract the following details from this resume text:

- Full name
- Email
- Skills (array)
- Education (list of degrees/institutions)
- Work Experience (list with company, role, duration)
- Projects (title, tech stack, description)
- Achievements

Return the output in JSON format:
{
  "name": "",
  "email": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "achievements": []
}

Resume:
"""${text}"""
`.trim()

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // ✅ FREE TIER MODEL
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    const content = chatCompletion.choices[0].message?.content

    let json
    try {
      json = JSON.parse(content!)
      const addDetails = await UserModel.findByIdAndUpdate(user._id,{
        resumedetails : {
            name: json.name,
            email: json.email,
            skills: json.skills,
            education: json.education,
            experience: json.experience,
            projects: json.projects,
            achievements: json.achievements
        }
      } , { new : true })

      return NextResponse.json({
      success: true,
      message: 'Resume processed successfully',
      data: addDetails,
    })
    
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: 'Failed to parse OpenAI response as JSON',
        raw: content,
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ Error in resume reader:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error.message,
    }, { status: 500 })
  }
}
