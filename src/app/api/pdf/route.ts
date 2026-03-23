import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

// Simple HTML-to-PDF text endpoint
export const POST = createApiHandler("pdf", async (req) => {
  const { html, title } = await req.json();

  if (!html) {
    return NextResponse.json(
      { error: "Missing 'html' in request body" },
      { status: 400 }
    );
  }

  // Minimal PDF generation (no external deps needed)
  const pdfContent = generateSimplePdf(title || "Document", html);

  return new NextResponse(new Uint8Array(pdfContent), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${(title || "document").replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
    },
  });
});

function generateSimplePdf(title: string, content: string): Buffer {
  // Strip HTML tags for plain text PDF
  const text = content.replace(/<[^>]*>/g, "").trim();
  const lines = wrapText(text, 80);

  const objects: string[] = [];
  let offset = 0;
  const offsets: number[] = [];

  const addObj = (content: string) => {
    offsets.push(offset);
    const obj = `${objects.length + 1} 0 obj\n${content}\nendobj\n`;
    objects.push(obj);
    offset += obj.length;
  };

  // Catalog
  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  // Pages
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  // Page
  addObj(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>`
  );

  // Content stream
  let stream = "BT\n/F1 16 Tf\n50 740 Td\n";
  stream += `(${escapePdf(title)}) Tj\n`;
  stream += "/F1 11 Tf\n0 -30 Td\n";

  for (const line of lines) {
    stream += `(${escapePdf(line)}) Tj\n0 -15 Td\n`;
  }
  stream += "ET";

  addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  // Font
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const pdfHeaderLen = pdf.length;
  const xrefOffsets = offsets.map((o) => o + pdfHeaderLen);

  pdf += objects.join("");

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const off of xrefOffsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "ascii");
}

function escapePdf(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 45); // Fit on one page
}
