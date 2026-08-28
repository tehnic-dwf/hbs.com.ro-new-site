import { priceRows, stepKeys, optionsFor, type Selection } from "../src/lib/pricing";
let issues=0;
function walk(sel: Selection, asked: string[]) {
  const partial: Selection = {...sel};
  for (const key of stepKeys) {
    if (partial[key]) continue;
    const opts = optionsFor(key, partial);
    if (opts.length===0) continue;
    if (opts.length===1) { partial[key]=opts[0]; continue; }
    for (const o of opts) walk({...partial,[key]:o}, [...asked,key]);
    return;
  }
  // leaf
}
walk({},[]);
// enumerate distinct leaves and check auto-skipped multi steps
const seen=new Set<string>();
function walk2(sel: Selection, auto: string[]) {
  const partial: Selection = {...sel};
  for (const key of stepKeys) {
    if (partial[key]) continue;
    const opts = optionsFor(key, partial);
    if (opts.length===0) continue;
    if (opts.length===1) { partial[key]=opts[0]; auto=[...auto,key]; continue; }
    for (const o of opts) walk2({...partial,[key]:o}, auto);
    return;
  }
  seen.add(JSON.stringify(partial)+" auto:"+auto.join(","));
}
walk2({},[]);
console.log([...seen].join("\n"));
console.log("leaves",seen.size,"rows",priceRows.length);
