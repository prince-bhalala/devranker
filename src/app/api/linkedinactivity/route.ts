import { NextApiRequest , NextApiResponse } from "next";
import OpenAI from "openai";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import dbconnect from "@/app/lib/dbConnection";

export async function GET(request : NextApiRequest){

    await dbconnect();

    const session = await getServerSession(authOptions)
    const user : User = await session?.user as User
    const token = (session?.user as any )?.linkedinAccessToken
    const linkedinUserId  = (session?.user as any )?.linkedinUserId

    if (!session || !user) {
        return NextResponse.json({
            success : false,
            message : "Not Autenticated"
        })
    }

    if (!token || !linkedinUserId) {
        return NextResponse.json({
            success : false,
            message : "No LinkedIn access token or UserId"
        }, { status : 401})
    }
    try {
       const postRes = await fetch(
        `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:${linkedinUserId})`,
            {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Restli-Protocol-Version": "2.0.0",
            },
          }
        );


        const posts = await postRes.json()

        const openai = new OpenAI({apiKey : process.env.OPENAI_API_KEY})
        const prompt = `Summarize this user's LinkedIn activity. Focus on technical posts, frequency, and engagement:\n\n${JSON.stringify(posts)}`;

        const chat = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        const analysis = chat.choices[0].message?.content;

        const updatedUser = await UserModel.findByIdAndUpdate(user?._id,{
            linkedinanalysis :analysis
        } , { new : true })
        return NextResponse.json({
            success : true,
            message : "Data Fetched Successfully",
            data : updatedUser
        })

    } catch (error) {
        console.error("LinkedIn activity error:", error);
        return NextResponse.json({
            success: false, 
            message: "Server error", 
            error: String(error) 
        }), { status: 500 }
    }
}