import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = process.argv[2];
if (!htmlPath) {
  console.error(
    "Usage: node scripts/extract-bundler.mjs <path-to-Facility19-standalone.html>",
  );
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");

function extractScript(type) {
  const esc = type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<script\\s+type="${esc}"[^>]*>([\\s\\S]*?)</script>`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

const manifestRaw = extractScript("__bundler/manifest");
const templateRaw = extractScript("__bundler/template");
const extRaw = extractScript("__bundler/ext_resources");

console.log("manifest len", manifestRaw?.length ?? 0);
console.log("template len", templateRaw?.length ?? 0);
console.log("ext len", extRaw?.length ?? 0);

if (!manifestRaw || !templateRaw) {
  console.error("Missing manifest or template");
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "extracted");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "manifest.json"), manifestRaw);
fs.writeFileSync(path.join(outDir, "template.json"), templateRaw);
if (extRaw) fs.writeFileSync(path.join(outDir, "ext_resources.json"), extRaw);
console.log("Wrote to", outDir);
