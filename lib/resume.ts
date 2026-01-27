"use server";

import PDFParser from "pdf2json";

type ResumeInput =
  | { file: File; url?: never }
  | { url: string; file?: never };

function normalizePDFurl(url: string) {
  const match = url.match(/\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

export async function getUserResumeInfo(input: ResumeInput) {
  let buffer: Buffer;

  if (input.file) {
    const arrayBuffer = await input.file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else if (input.url) {
    const response = await fetch(normalizePDFurl(input.url));
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    throw new Error("Invalid input: Provide either a file or a URL");
  }

  return new Promise<{ text: string; pages: number; metadata: any }>((resolve, reject) => {
    const pdfParser = new PDFParser(null, true); 

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error(errData.parserError);
      reject(new Error("Failed to parse PDF data"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
     
      const rawText = pdfParser.getRawTextContent();
      
      const pages = pdfData.formImage?.Pages?.length || 1;
      
      resolve({
        text: rawText,
        pages: pages,
        metadata: pdfData.Meta,
      });
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (e) {
      reject(e);
    }
  });
}