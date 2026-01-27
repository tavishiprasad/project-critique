"use server";

import { getUserResumeInfo } from "@/lib/resume";
import { Tone } from "../page";
import generateResponse from "@/lib/llm";

export default async function analyzeResume({file,url,tone}:{file?:File, url?:string, tone:Tone}){
    if(!file && !url){
        throw new Error("Provide a resume file or url");
    }
    const parsed=await getUserResumeInfo(file?{file}:{url:url!});
    if(!parsed.text || parsed.text.length<200){
        throw new Error("Failed to extract resume");
    }
    const data=`
        Resume Analysis
        Pages:${parsed.pages}
        Resume Content:${parsed.text.slice(0,7000)}
    `;
    return generateResponse(data,tone);
} 