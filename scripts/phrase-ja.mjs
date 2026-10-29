/*
 * Japanese has no spaces, so browsers may wrap between any two characters
 * ("グラ／シア", "徒歩5／分"). This marks the phrase (文節) boundaries that
 * BudouX finds with zero-width spaces; with `word-break: keep-all`
 * (app/globals.css) those become the only places a Japanese line can wrap.
 *
 * Runs before `dev` and `build`: locales/ja.json → locales/ja.phrased.json.
 * Done at build time so BudouX never ships to the browser.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { Parser, jaModel } from "budoux";

const parser = new Parser(jaModel);
const ZWSP = "​";

// The model occasionally splits inside numbers ("201|9年") or after a lone
// kanji ("獺|祭", "日|時"); those are never good places to wrap.
const DIGIT_END = /\d$/;
const DIGIT_START = /^\d/;
const LONE_KANJI = /^\p{Script=Han}$/u;

function phrase(text) {
  const chunks = parser.parse(text);
  let out = chunks[0] ?? "";
  for (let i = 1; i < chunks.length; i++) {
    const prev = chunks[i - 1];
    const keep = (DIGIT_END.test(prev) && DIGIT_START.test(chunks[i])) || LONE_KANJI.test(prev);
    out += (keep ? "" : ZWSP) + chunks[i];
  }
  return out;
}

function phraseText(text) {
  // Leave {placeholders} for fmt() untouched.
  return text
    .split(/(\{\w+\})/)
    .map((part) => (part.startsWith("{") ? part : phrase(part)))
    .join("");
}

function walk(value) {
  if (typeof value === "string") return phraseText(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]));
  }
  return value;
}

const ja = JSON.parse(readFileSync(new URL("../locales/ja.json", import.meta.url), "utf8"));
// meta stays as written: it becomes document.title, where break marks are useless.
const phrased = { ...walk(ja), meta: ja.meta };
writeFileSync(new URL("../locales/ja.phrased.json", import.meta.url), JSON.stringify(phrased, null, 2) + "\n");
