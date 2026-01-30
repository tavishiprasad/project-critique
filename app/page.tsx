"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectItem } from "@/components/ui/select";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import analyzeAnime from "./actions/anime";
import analyzeGithub from "./actions/github";
import analyzeLeetCode from "./actions/leetcode";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { motion, AnimatePresence, Variants } from "framer-motion";
import FireBackground from "@/components/roastBackground";
import EvaluateBackground from "@/components/evaluateBackground";
import GuideBackground from "@/components/guideBackground";
import CritiqueModal from "@/components/critiqueModal";
import analyzeResume from "./actions/resume";
import { resume } from "react-dom/server";
import analyzeCodeforces from "./actions/codeforces";

export enum Tone {
  summarise = "summarise",
  evaluate = "evaluate",
  guide = "guide",
  criticism = "construcutive_criticism",
  roast = "roast",
}

export enum Mode {
  // spotify="spotify",
  github = "github",
  anime = "anime",
  leetcode = "leetcode",
  codeforces="codeforces",
  resume="resume",
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  const [tone, setTone] = useState<null | Tone>(null);
  const [mode, setMode] = useState<Mode>(Mode.github);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [critiqueResult, setCritiqueResult]=useState("");
  const [showDialog, setShowDialog]=useState(false);
  const [resumeFile, setResumeFile]=useState<File|null>(null);
  const [resumeUrl,setResumeUrl]=useState("");

  useEffect(() => {
    setUsername("");
  }, [mode]);
  
  const handleSuccess=(text:string)=>{
    setCritiqueResult(text);
    setShowDialog(true);
    setIsLoading(false);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 h-screen w-full items-center justify-center font-mono dark:bg-[#161616] dark:text-white"
    >
      <motion.div variants={itemVariants} className="absolute top-8 right-8">
        <AnimatedThemeToggler
          className="bg-[#161616] text-white dark:text-black
        dark:bg-white rounded-full p-2 "
        />
      </motion.div>
      {/* roast */}
      <AnimatePresence>
        {tone === Tone.roast && (
          <motion.div
            key="fire-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <FireBackground />
          </motion.div>
        )}
      </AnimatePresence>
      {/* evaluate */}
      <AnimatePresence>
        {tone === Tone.evaluate && (
          <motion.div
            key="fire-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <EvaluateBackground />
          </motion.div>
        )}
      </AnimatePresence>
      {/* guide */}
      <AnimatePresence>
        {tone === Tone.guide && (
          <motion.div
            key="fire-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <GuideBackground />
          </motion.div>
        )}
      </AnimatePresence>

      <CritiqueModal
        isOpen={showDialog}
        onClose={()=>setShowDialog(false)}
        critique={critiqueResult}
      />

      <motion.h1
        variants={itemVariants}
        className="font-serif text-8xl md:text-9xl select-none"
      >
        Critique*
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-sm md:text-base text-neutral-500 mb-12 uppercase tracking-widest font-bold select-none"
      >
        Get judged based on your profiles
      </motion.p>

      <motion.div variants={itemVariants}>
        <ToggleGroup
          type="single"
          variant="outline"
          onValueChange={(value) => setMode(value as Mode)}
          defaultValue={Mode.github}
        >
          {Object.values(Mode).map((mode) => {
            return (
              <ToggleGroupItem key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Select onValueChange={(value) => setTone(value as Tone)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(Tone).map((tone) => {
                if (tone === "roast") {
                }
                return (
                  <SelectItem key={tone} value={tone}>
                    {tone.replace("_", " ").charAt(0).toUpperCase() +
                      tone.replace("_", " ").slice(1)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="flex flex-col w-full justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{
              opacity: 0,
              y: -10,
              filter: "blur(5px)",
              transition: { duration: 0.2 },
            }}
            className="flex flex-col gap-4 w-full justify-center items-center"
          >
            {mode === Mode.github ? (
              <>
                <Input
                  className="w-62.5"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Github Username"
                />
                <Button
                  disabled={!username || !tone || isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await analyzeGithub({
                        username,
                        tone: tone!,
                      });
                      handleSuccess(res);
                    } catch (_error) {
                      toast.error("Error generating response");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? "Critiquing..." : "Critique my Github"}
                </Button>
              </>
            ) : mode === Mode.anime ? (
              <>
                <Input
                  className="w-62.5"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your MyAnimeList username"
                />
                <Button
                  disabled={!username || !tone || isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await analyzeAnime({ username, tone: tone! });
                      handleSuccess(res);
                    } catch (_error) {
                      toast.error("Error generating response");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? "Critiquing..." : "Critique my Anime"}
                </Button>
              </>
            ) : mode === Mode.leetcode ? (
              <>
                <Input
                  className="w-62.5"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Leetcode username"
                />
                <Button
                  disabled={!username || !tone || isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await analyzeLeetCode({
                        username,
                        tone: tone!,
                      });
                      handleSuccess(res);
                    } catch (_error) {
                      toast.error("error generating resposnse");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? "Critiquing..." : "Critique my LeetCode"}
                </Button>
              </>
            ) : mode === Mode.codeforces ? (
              <>
                <Input
                  className="w-62.5"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Codeforces username"
                />
                <Button
                  disabled={!username || !tone || isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await analyzeCodeforces({
                        username,
                        tone: tone!,
                      });
                      handleSuccess(res);
                    } catch (_error) {
                      toast.error("error generating resposnse");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? "Critiquing..." : "Critique my Codeforces"}
                </Button>
              </>
              ) : mode===Mode.resume?(
              <>
                <Input 
                className="w-62.5"
                type="file" 
                accept="application/pdf" 
                onChange={(e)=>setResumeFile(e.target.files?.[0] ||null)} 
                placeholder="Select Resume File"
                />
                <Input 
                className="w-62.5"
                placeholder="Or paste resume Url"
                value={resumeUrl} 
                onChange={(e)=>setResumeUrl(e.target.value)}
                />
                <Button
                  disabled={(!resumeFile && !resumeUrl)|| !tone || isLoading }
                  onClick={async()=>{
                    setIsLoading(true);
                    try{
                      const res=await analyzeResume({
                        file:resumeFile || undefined,
                        url:resumeFile?undefined:resumeUrl,
                        tone:tone!,
                      });
                      handleSuccess(res);
                    }catch(_error){
                      toast.error("Failed to analyze resume");
                    }finally{
                      setIsLoading(false);
                    }
                  }}
                >
                  Analyze Resume
                </Button>
              </>
            ):null}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
