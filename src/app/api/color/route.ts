import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  let full: string;
  if (clean.length === 3) {
    full = clean.split("").map((c) => c + c).join("");
  } else if (clean.length === 6) {
    full = clean;
  } else {
    return null;
  }
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function parseColor(input: string): { r: number; g: number; b: number } | null {
  // Try hex
  if (/^#?[0-9a-fA-F]{3,6}$/.test(input)) {
    return hexToRgb(input);
  }
  // Try rgb(r, g, b)
  const rgbMatch = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
  }
  // Try hsl(h, s%, l%)
  const hslMatch = input.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/i);
  if (hslMatch) {
    return hslToRgb(+hslMatch[1], +hslMatch[2], +hslMatch[3]);
  }
  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

export const GET = createApiHandler("color", async (req) => {
  const color = req.nextUrl.searchParams.get("color");
  if (!color) {
    return NextResponse.json({ error: "Missing required parameter: color" }, { status: 400 });
  }

  const rgb = parseColor(color);
  if (!rgb) {
    return NextResponse.json(
      { error: "Invalid color format. Supported: hex (#ff0000 or ff0000), rgb(255,0,0), hsl(0,100%,50%)" },
      { status: 400 }
    );
  }

  const { r, g, b } = rgb;
  const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  const hsl = rgbToHsl(r, g, b);

  return NextResponse.json({
    hex,
    rgb: { r, g, b },
    rgbString: `rgb(${r}, ${g}, ${b})`,
    hsl: { h: hsl.h, s: hsl.s, l: hsl.l },
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    rgba: `rgba(${r}, ${g}, ${b}, 1)`,
    brightness: Math.round((r * 299 + g * 587 + b * 114) / 1000),
    isDark: (r * 299 + g * 587 + b * 114) / 1000 < 128,
  });
});
