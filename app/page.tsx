"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import testConnection from "./actions/test";
import { toast } from "sonner";
import { signIn, signOut, useSession } from "next-auth/react";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import analyzeSpotify from "./actions/spotify"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import analyzeAnime from "./actions/anime";
import analyzeGithub from "./actions/github";
import analyzeLeetCode from "./actions/leetcode";

export enum Tone{
  summarise="summarise",
  evaluate="evaluate",
  guide="guide",
  criticism="construcutive_criticism",
  roast="roast"
}

export enum Mode{
  // spotify="spotify",
  github="github",
  anime="anime",
  leetcode="leetcode"
}

export default function Home() {

  const [text,setText]=useState("");
  const [tone,setTone]=useState<null | Tone>(null);
  const [mode,setMode]=useState<Mode>(Mode.github);
  const [username, setUsername]=useState("");
  const {data : session}=useSession();


  return (
    <div className="flex flex-col gap-4 min-h-screen justify-center items-center font-sans">
      <h1 className="text-7xl">CRITIQUE</h1>
      <p className="text-gray-600 text-xl">Get judged based on your profiles</p>
      {/* <Textarea className="w-1/2" value={text} onChange={(e)=>setText(e.target.value)}></Textarea>

      <Button onClick={async ()=>{
        try{
          const response = await testConnection(text,"roast");
          toast.success(response as string);
        }catch (error){
          toast.error("Error genenrating response");
        }
      }}>
        Submit
      </Button> */}
      
      <ToggleGroup type="single" onValueChange={value => setMode(value as Mode)} defaultValue={Mode.github}>
        {/* <ToggleGroupItem value={Mode.github}>Github</ToggleGroupItem>
        <ToggleGroupItem value={Mode.anime}>Anime</ToggleGroupItem> */}
        {Object.values(Mode).map((mode)=>{
          return <ToggleGroupItem key={mode} value={mode}>
            {mode.charAt(0).toUpperCase()+ mode.slice(1)}  
          </ToggleGroupItem>
        })}
      </ToggleGroup>
                <Select onValueChange={(value) => setTone(value as Tone)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a tone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="summarise">Summarise</SelectItem>
            <SelectItem value="evaluate">Evaluate</SelectItem>
            <SelectItem value="guide">Guide</SelectItem>
            <SelectItem value="criticism">Criticism</SelectItem>
            <SelectItem value="roast">Roast</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {mode===Mode.github?(
        
          <div>
            <Input onChange={(e)=> setUsername(e.target.value)} placeholder="Enter your Github Username" />
              <Button 
                disabled={!username|| !tone}
                onClick={async () => {
                  try {
                      const res = await analyzeGithub({username, tone: tone! });
                      toast.success(res);
                  } catch (error) {
                      toast.error("Error generating response");
                  }
                }}
              >Critique my Github</Button>
            </div>
          
        ) : mode===Mode.anime ? (
        <div>
          <Input onChange={(e) => setUsername(e.target.value)} placeholder="Enter your MyAnimeList username" />
          <Button
            disabled={!username || !tone}
            onClick={async () => {
              try {
                const res = await analyzeAnime({ username, tone: tone! });
                toast.success(res);
              } catch(error) {
                toast.error("Error generating response");
              }
            }}
          >
            Critique my anime
          </Button>
        </div>
      ): mode===Mode.leetcode?(
        <div>
          <Input onChange={(e)=>setUsername(e.target.value)} placeholder="Enter your Leetcode username" />
          <Button disabled={!username || !tone}
          onClick={async ()=>{
            try{
              const res=await analyzeLeetCode({username,tone:tone!});
              toast.success(res);
            }catch(error){
              toast.error("error generating resposnse");
            }
          }}>
            Critique my Leetcode
          </Button>
        </div>
      ):null}
    </div>
  );
}
