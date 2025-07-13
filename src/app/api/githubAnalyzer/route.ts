import {User} from 'next-auth'
import { NextRequest ,NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getServerSession } from 'next-auth'
import UserModel from '@/model/User.model'
import { authOptions } from '../auth/[...nextauth]/options'


export async function GET(request : NextRequest){

    // db coonect 

    const session = await getServerSession(authOptions)
    const user : User = await session?.user as User
    const loginByGithub  = (session?.user as any)?.isGithub 
    const githubAccessToken  = (session?.user as any)?.githubAccessToken 
    
    if (!session || !user) {
        return NextResponse.json({
            success : false,
            message : "Not Autenticated"
        })
    }

    if (githubAccessToken && loginByGithub) {
        try {

            const response = await fetch("https://api.github.com/user", {
              headers: {
                Authorization: `Bearer ${githubAccessToken}`,
                Accept: "application/vnd.github+json",
              },
            });

            const data = await response.json();
            const username = data.login; 
            console.log("GitHub username:", username);

            const githubres = await fetch('https://api.github.com/user/repos',{
                headers: {
                    Authorization: `Bearer ${githubAccessToken}`
                }
            })
    
            const repos = await githubres.json()

            let totalCommits = 0;
            const languageMap = new Map<string, number>();
            const repoSummaries = [];

            // Step 2: Loop through repos to fetch commits and language data
            for (const repo of repos) {
              const { name, owner, languages_url , description } = repo;
            
              // Count commits
              const commitsRes = await fetch(`https://api.github.com/repos/${owner.login}/${name}/commits?author=${username}`, {
                headers: {
                  Authorization: `Bearer ${githubAccessToken}`,
                },
              });
              const commits = await commitsRes.json();
              if (Array.isArray(commits)) {
                totalCommits += commits.length;
              }
          
              // Count languages
              const langRes = await fetch(languages_url, {
                headers: {
                  Authorization: `Bearer ${githubAccessToken}`,
                },
              });
              const langData = await langRes.json();
              for (const [lang, bytes] of Object.entries(langData)) {
                languageMap.set(lang, (languageMap.get(lang) || 0) + Number(bytes));
              }

              const readmeRes = await fetch(`https://api.github.com/repos/${owner.login}/${repo.name}/readme`, {
                  headers: {
                    Authorization: `Bearer ${githubAccessToken}`,
                    Accept: 'application/vnd.github.v3.raw', // This will return raw markdown
                  }
                });
            const readmeText = await readmeRes.text();
            repoSummaries.push({
                name ,
                description :  description || 'No Description Provided',
                readme : readmeText || "Their Are no Readme File"

            })
            }
        
            const prompt = `
                Analyze the following GitHub projects based on their name, description, and README content.
                Select the top 2 most impressive ones and describe:

                - What is the project about?
                - What problem does it solve?
                - Why is it valuable?

                Data:
                ${JSON.stringify(repoSummaries, null, 2)}`;

            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const chat = await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0613",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.4,
            });
            const summary = chat.choices[0].message.content;


            
            // Convert languageMap to object and find top language
            const languagesUsed = Object.fromEntries(languageMap);
            const topLanguage = Object.entries(languagesUsed).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

            const promp = `Generate a 2-line professional summary for a developer who uses these languages:
             ${Object.keys(languagesUsed).join(', ')} with ${totalCommits} commits and top language is ${topLanguage}`;

            const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const chats = await openai.chat.completions.create({
                  model: "gpt-3.5-turbo-0613",
                  messages: [{ role: "user", content: prompt }],
                  temperature: 0.4,
                });

            const quotes = chats.choices[0].message.content;

            const updatedUserDetails = await UserModel.findByIdAndUpdate(user?._id , {
                githubanalysis : {
                    topProjectsSummary : summary ,
                    topLanguage : topLanguage,
                    developerQuote : quotes
                }
            },{ new : true })

            return NextResponse.json({
              success: true,
              mesaage : "Github all details Fetched successfully ",
              data : updatedUserDetails
            });
          } catch (error) {
            console.error('GitHub summary error:', error);
            return NextResponse.json({ success: false, message: 'Server error', error: String(error) }, { status: 500 });
          }
    }else{
        return NextResponse.json({
            success : false,
            message : "Please connect your github accound first "
        })
    }
}