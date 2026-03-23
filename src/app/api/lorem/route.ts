import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import crypto from "crypto";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "porta", "semper",
  "lacus", "cursus", "faucibus", "primis", "ultrices", "posuere", "cubilia",
  "curae", "viverra", "nibh", "cras", "pulvinar", "mattis", "nunc", "blandit",
  "auctor", "tortor", "pellentesque", "habitant", "morbi", "tristique", "senectus",
  "netus", "malesuada", "fames", "turpis", "egestas", "sapien", "feugiat",
  "vulputate", "odio", "facilisis", "mauris", "massa", "vitae", "gravida",
];

function randomWord(): string {
  return WORDS[crypto.randomInt(WORDS.length)];
}

function generateSentence(minWords: number, maxWords: number): string {
  const count = crypto.randomInt(minWords, maxWords + 1);
  const words = Array.from({ length: count }, () => randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(sentences: number): string {
  return Array.from({ length: sentences }, () => generateSentence(5, 15)).join(" ");
}

export const GET = createApiHandler("lorem", async (req) => {
  const paragraphs = Math.min(Math.max(Number(req.nextUrl.searchParams.get("paragraphs") || 3), 1), 20);
  const sentences = Math.min(Math.max(Number(req.nextUrl.searchParams.get("sentences") || 5), 1), 20);
  const format = req.nextUrl.searchParams.get("format") || "text";

  const paras = Array.from({ length: paragraphs }, () => generateParagraph(sentences));

  if (format === "html") {
    const html = paras.map((p) => `<p>${p}</p>`).join("\n");
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({ text: paras.join("\n\n"), paragraphs: paras });
});
