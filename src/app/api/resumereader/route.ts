import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import OpenAI from 'openai'


export async function POST(request :Request ) {
    // await dbconnect()
        
        const data = await request.formData()
        const file = data.get('resume') as File

        if (!file) {
            return Response.json({
                success : false,
                message : 'File is not found '
            }, {status : 404})
        }

        const buffer  = Buffer.from(await file.arrayBuffer())

        try {
            
            const parsed = await pdfParse(buffer)
            const text = parsed.text
            const propmt = `Extract the following information from this resume:
                - Full name
                - Email
                - Skills (as an array)
                - Education (list of entries)
                - Work Experience (list)
                - Projects (name + description)
                - Achievements

                Return the result as JSON with this structure:
                {
                  "name": "",
                  "email": "",
                  "skills": [],
                  "education": [],
                  "experience": [],
                  "projects": [],
                  "achievements": []
                }

                Resume Text:
                """ 
                ${text}
                """
                `
            const openai = new OpenAI({apiKey : process.env.OPENAI_API_KEY!})
            const chatComplition = await openai.chat.completions.create({
                model : 'gpt-4',
                messages : [{role : 'user', content : propmt}],
                temperature : 0.2
            })

            const content = chatComplition.choices[0].message.content

            let json
            try {
                json = JSON.parse(content!)
            } catch (error) {
                return Response.json({
                success : false,
                message : 'Failed to parse GPT response'
            } , {status : 500})
            }

            return Response.json({
                success : true,
                message : 'GPT response get successfully ',
                data : json
            } , {status : 200})
            

        } catch (error) {
            return Response.json({
                success : false,
                message : 'error during file extracking'
            } , {status : 500})
        }

}