import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { Copy, Loader2, X } from "lucide-react";

const TypewriterMarkdown = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setDisplayedContent("");
    setCompleted(false);
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent((prev) => prev + content.charAt(index));
        index++;
      } else {
        setCompleted(true);
        clearInterval(intervalId);
      }
    }, 5); 

    return () => clearInterval(intervalId);
  }, [content]);

  return (
    <div className={`prose prose-sm md:prose-base dark:prose-invert max-w-none 
      prose-headings:font-bold prose-h3:text-lg prose-ul:list-disc prose-ul:pl-4
      ${completed ? "" : "after:content-['  '] after:animate-pulse after:ml-1 after:text-primary"}
  [&>*:first-child]:mt-0`}>
      <ReactMarkdown
      components={{
          h3: ({ node, ...props }) => (
            <h3 
              className="text-2xl md:text-3xl  mt-6 mb-3 text-primary border-b border-border/50 pb-1"
              style={{ fontFamily: "'Grenze Gotisch', serif", letterSpacing: '0.02em' }} 
              {...props} 
            />
          ),
          strong: ({ node, ...props }) => (
            <span className="text-primary" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 text-sm md:text-base leading-relaxed text-muted-foreground" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-3 flex flex-col gap-2 pl-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="flex items-start gap-2 text-sm md:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <span>{props.children}</span>
            </li>
          ),
        }}
      >{displayedContent}</ReactMarkdown>
    </div>
  );
};

const fileToBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

interface CritiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  critique: string;
}

export default function CritiqueModal({
  isOpen,
  onClose,
  critique,
}: CritiqueModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyImage = async () => {
    if (!contentRef.current) return;
    try {
      setIsCopying(true);
      const grenzeB64 = await fileToBase64(
        window.location.origin + "/fonts/GrenzeGotisch-Regular.ttf"
      ).catch(() => null); 
      const spaceMonoB64 = await fileToBase64(
        window.location.origin + "/fonts/SpaceMono-Regular.ttf"
      ).catch(() => null);

      const fontCss = `
            @font-face{
                font-family:'Grenze Gotisch';
                src:url('${grenzeB64}')format('truetype');
            }
            @font-face{
                font-family:'Space Mono';
                src: url('${spaceMonoB64}') format('truetype');
            }
            `;

      const blob = await toBlob(contentRef.current!, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "#161616"
          : "#ffffff",
        fontEmbedCSS: fontCss,
      });

      if (!blob) throw new Error("Failed to generate image");

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success("Critique copied to clipboard as image!");
    } catch (error) {
      console.error("Error copying critique image:", error);
      toast.error("Failed to copy critique image.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="bg-card p-0 overflow-hidden border-border scroll-smooth md:max-w-2xl max-w-96">
        <div className="bg-muted/50 flex items-center justify-center shrink-0 p-2 md:p-4 border-b">
          <h2
            className="text-2xl md:text-4xl"
            style={{ fontFamily: "'Grenze Gotisch',serif" }}
          >
            Critique*
          </h2>
        </div>
        <div
          className=" text-card-foreground p-6 flex flex-col gap-4 max-h-[60vh] md:max-h-96 overflow-y-auto"
          ref={contentRef}
        >
          <div style={{ fontFamily: "'Space Mono',monospace" }}>
            {isOpen && <TypewriterMarkdown content={critique} />}
          </div>
        </div>

        <div className="p-2 md:p-4 bg-muted/50 flex gap-2 justify-end border-t shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isCopying}>
            <X className="mr-2 h-2 w-2 md:h-4 md:w-4" />
            Close
          </Button>
          <Button onClick={handleCopyImage} disabled={isCopying}>
            {isCopying ? (
              <Loader2 className="mr-2 h-2 w-2 md:h-4 md:w-4 animate-spin" />
            ) : (
              <Copy className="mr-2 h-2 w-2 md:h-4 md:w-4" />
            )}
            Copy Critique
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}