/*
 * Builds standalone.html — a single self-contained file that opens straight
 * from the filesystem (file://), with the glyph code and specimen data inlined.
 *
 * kin-glyph.js stays the source of truth; this just inlines it so there is no
 * drift between the module and the demo page.
 *
 *   node make.mjs
 */
import fs from 'fs';

const glyph = fs.readFileSync('./kin-glyph.js', 'utf8')
  .replace(/^export /gm, '');                    // strip ESM exports for a classic <script>
const specimens = fs.readFileSync('./specimens.json', 'utf8');

const html = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kin Score — the K'in sun glyph</title>
<style>
  :root{
    --surface:#f8f9fa; --panel:#ffffff; --ink:#1a1a2e; --muted:#5b6270; --line:#e2e5ea;
    --exemplar:#002e7b; --strong:#005295; --developing:#1575ae;
    --thin:#3999c5; --emerging:#5ebcdc; --minimal:#c2c7cf;
  }
  html[data-theme="dark"]{
    --surface:#1a1a2e; --panel:#22243a; --ink:#f3f5f8; --muted:#9aa2b4; --line:#33364d;
    --exemplar:#87dfff; --strong:#65bbe6; --developing:#4897cd;
    --thin:#3173b4; --emerging:#234f99; --minimal:#4a5162;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--surface);color:var(--ink);
       font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;padding:28px}
  h1{font-size:22px;margin:0 0 4px}
  h2{font-size:16px;margin:34px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--line)}
  p{max-width:78ch;color:var(--muted);margin:6px 0}
  code{background:color-mix(in srgb,var(--ink) 8%,transparent);padding:1px 5px;border-radius:4px;font-size:.9em}
  .bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0 4px}
  button{font:inherit;padding:6px 12px;border:1px solid var(--line);border-radius:8px;
         background:var(--panel);color:var(--ink);cursor:pointer}
  button[aria-pressed="true"]{background:var(--developing);border-color:var(--developing);color:#fff}
  html[data-theme="dark"] button[aria-pressed="true"]{color:#10121f}
  .grid{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;text-align:center}
  .card .nm{font-weight:600;margin-top:6px}
  .sub{font-size:12px;color:var(--muted)}
  .legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin:10px 0}
  .legend span{display:inline-flex;align-items:center;gap:6px}
  .sw{width:13px;height:13px;border-radius:3px;display:inline-block}
  table{border-collapse:collapse;font-size:13px;margin-top:10px;width:100%;max-width:900px}
  th,td{border-bottom:1px solid var(--line);padding:6px 9px;text-align:right}
  th:first-child,td:first-child{text-align:left}
  th{color:var(--muted);font-weight:600}
  .row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--line);max-width:560px}
  .note{border-left:3px solid var(--developing);padding:8px 0 8px 13px;margin:14px 0;max-width:78ch}
  #tip{position:fixed;pointer-events:none;z-index:99;opacity:0;transition:opacity .09s;
       background:var(--ink);color:var(--surface);padding:6px 10px;border-radius:7px;
       font-size:12.5px;line-height:1.4;box-shadow:0 4px 14px rgba(0,0,0,.22);max-width:260px}
  #tip b{font-weight:650}
  #tip .v{opacity:.8}
  svg [data-kind]{cursor:crosshair}
</style>
</head>
<body data-palette="#5ebcdc,#3999c5,#1575ae,#005295,#002e7b">

<h1>The K'in sun — Kin Score glyph</h1>
<p>Concentric rings are the six composite facets, each filled to its score and coloured by the band that
score lands in. The twelve triangles are the agent-readiness dimensions — solid when satisfied. K'in is
the Mayan word for sun, and for day.</p>

<div class="bar">
  <button id="theme" aria-pressed="false">Toggle dark</button>
  <button class="impl" data-impl="svg" aria-pressed="true">Raw SVG</button>
  <button class="impl" data-impl="canvas" aria-pressed="false">Canvas</button>
  <button class="impl" data-impl="d3" aria-pressed="false">D3</button>
</div>
<div class="bar">
  <button class="pal" data-pal="facet" aria-pressed="true">Facet hues</button>
  <button class="pal" data-pal="ordinal" aria-pressed="false">Ordinal ramp</button>
  <button class="pal" data-pal="bright" aria-pressed="false">Bright hues</button>
  <span class="sub" id="palnote"></span>
</div>
<div class="bar"><span class="sub" id="implnote"></span></div>

<div class="legend" id="legend"></div>
<div id="tip" role="status" aria-live="polite"></div>

<h2>Specimens — real providers, real scores</h2>
<div class="grid" id="specimens"></div>

<h2>At listing size</h2>
<p>The same function at 34px, as it would appear in a provider list row. Below ~96px the centre number
is dropped for a band dot — the glyph degrades to a silhouette that still reads.</p>
<div id="rows"></div>

<h2>The accessible view — the same data as a table</h2>
<p>A radial mark is an identity glyph, not a measuring instrument: equal values read as different arc
lengths on different rings, because arc length grows with radius. The glyph is for recognition and
gist; this table is what you compare with.</p>
<div id="table"></div>

<div class="note">
  <strong>Palette note.</strong> The six bands are <em>ordinal</em> — an ordered ladder — so they take a
  ramp with monotone lightness, not arbitrary hues. This one traverses <strong>38° of hue</strong>
  (cyan → deep indigo) for real separation between adjacent bands; 40° is the ceiling before a ramp
  stops reading as ordered. Validated with the dataviz validator (<code>--ordinal</code>): all checks
  pass on both surfaces. <code>Minimal</code> sits off the ramp in neutral ink because it means
  <em>nothing here</em>. The band colours currently in production on providers.apievangelist.com are a
  rainbow applied to ordered data, which fails four of the checks — see NOTES.md.
  <br><br><strong>Bright hues</strong> is the alternative: five distinct categorical colours, far easier
  to tell apart and impossible to rank without the legend. It passes on the light surface with two
  documented reliefs (CVD in the 6–8 warn band; yellow and aqua below 3:1) — both satisfied here because
  arc length already encodes the same value and every mark has a hover label. It <em>fails</em> on dark:
  no five hues in that column are mutually separable (blue↔violet ΔE 1.9). Orange is absent from both
  because red↔orange measures 7.1 for normal vision, under the 15 floor.
  <br><br>Hover any ring or ray for its value. Unsatisfied rays carry a heavier, darker outline so the
  sun's silhouette survives greyscale and print.
</div>

<script>
/* ---- inlined from kin-glyph.js (source of truth; regenerate with: node make.mjs) ---- */
${glyph}

/* ---- inlined from specimens.json ---- */
const data = ${specimens};

const order = ['twilio','kpn','socotra','manulife','att'];
let impl = 'svg';
let pal = 'facet';
const mode = () => document.documentElement.dataset.theme;
const PALNOTE = {
  facet: 'each ring takes its facet hue — always colourful, arc length carries the score, rank moves to the band label',
  ordinal: 'one hue family, 38° traverse · rank readable from colour alone · survives greyscale · passes on both surfaces',
  bright: 'distinct hues · far easier to tell apart, impossible to rank without the legend · light passes with reliefs; DARK FAILS (blue↔violet ΔE 1.9)',
};
const NOTES = {
  svg: 'zero dependencies · build-time or runtime · a11y titles free',
  canvas: 'one bitmap, no DOM nodes · best for bulk PNG · no a11y',
  d3: 'd3.arc() + cornerRadius · best for transitions · needs the CDN (offline: unavailable)',
};

function canvasGlyph(p, size, m) {
  const C = PALETTES[pal][m], dpr = window.devicePixelRatio||1;
  const cv = document.createElement('canvas');
  cv.width = size*dpr; cv.height = size*dpr; cv.style.width=size+'px'; cv.style.height=size+'px';
  const x = cv.getContext('2d'); x.scale(dpr,dpr);
  const cx=size/2, cy=size/2, rayBand=size*0.115;
  const outerR=size/2-rayBand-size*0.02, coreR=size*0.145;
  const gap=Math.max(2,size*0.018), ringW=(outerR-coreR-gap*5)/6;
  FACETS.forEach((f,i)=>{
    const v=Math.max(0,Math.min(100,Number((p.facets||{})[f.id]||0)));
    const r=outerR-ringW/2-i*(ringW+gap);
    x.lineWidth=ringW; x.strokeStyle=C.track; x.lineCap='butt';
    x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.stroke();
    if(v>0){ x.strokeStyle=C[bandOf(v)]; x.lineCap='round';
      x.beginPath(); x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(v/100)*Math.PI*2); x.stroke(); }
  });
  const rayC=RAYS[m][p.agent_band||'human-only']||RAYS[m]['human-only'];
  const baseR=outerR+size*0.022, tipR=baseR+rayBand*0.72, halfW=(Math.PI*2*baseR)/12*0.30;
  DIMENSIONS.forEach((d,i)=>{
    const a=(i/12)*Math.PI*2-Math.PI/2, px=Math.cos(a), py=Math.sin(a), nx=-py, ny=px;
    x.beginPath();
    x.moveTo(cx+px*tipR, cy+py*tipR);
    x.lineTo(cx+px*baseR+nx*halfW, cy+py*baseR+ny*halfW);
    x.lineTo(cx+px*baseR-nx*halfW, cy+py*baseR-ny*halfW);
    x.closePath();
    const sw=Math.max(1.25,size*0.0125);
    if((p.agent_dims||{})[d.id]){ x.fillStyle=rayC; x.fill(); x.strokeStyle=rayC; x.lineWidth=sw*0.5; x.stroke(); }
    else { x.strokeStyle=C.rayOff; x.lineWidth=sw; x.stroke(); }
  });
  x.fillStyle=C.surface; x.beginPath(); x.arc(cx,cy,coreR+gap,0,Math.PI*2); x.fill();
  if(size>=96){ x.fillStyle=C.ink; x.textAlign='center'; x.textBaseline='middle';
    x.font='700 '+(size*0.155)+'px system-ui,-apple-system,sans-serif';
    x.fillText(Number(p.score).toFixed(1), cx, cy); }
  else { x.fillStyle=C[p.band||bandOf(p.score)]; x.beginPath(); x.arc(cx,cy,coreR*0.5,0,Math.PI*2); x.fill(); }
  return cv;
}

function d3Glyph(p, size, m) {
  if (typeof d3 === 'undefined') {
    const d = document.createElement('div');
    d.style.cssText = 'width:'+size+'px;height:'+size+'px;display:flex;align-items:center;'+
      'justify-content:center;text-align:center;font-size:12px;color:var(--muted);'+
      'border:1px dashed var(--line);border-radius:10px;padding:8px';
    d.textContent = 'D3 not loaded (offline / CDN blocked)';
    return d;
  }
  const C = PALETTES[pal][m];
  const svg = d3.create('svg').attr('viewBox','0 0 '+size+' '+size).attr('width',size).attr('height',size);
  const g = svg.append('g').attr('transform','translate('+size/2+','+size/2+')');
  const rayBand=size*0.115, outerR=size/2-rayBand-size*0.02, coreR=size*0.145;
  const gap=Math.max(2,size*0.018), ringW=(outerR-coreR-gap*5)/6;
  FACETS.forEach((f,i)=>{
    const v=Math.max(0,Math.min(100,Number((p.facets||{})[f.id]||0)));
    const rOut=outerR-i*(ringW+gap), rIn=rOut-ringW;
    const arc=d3.arc().innerRadius(rIn).outerRadius(rOut).cornerRadius(ringW/2);
    g.append('path').attr('d',arc({startAngle:0,endAngle:Math.PI*2})).attr('fill',C.track);
    if(v>0) g.append('path').attr('d',arc({startAngle:0,endAngle:(v/100)*Math.PI*2}))
      .attr('fill',C[bandOf(v)]);
  });
  const rayC=RAYS[m][p.agent_band||'human-only']||RAYS[m]['human-only'];
  const baseR=outerR+size*0.022, tipR=baseR+rayBand*0.72, halfW=(Math.PI*2*baseR)/12*0.30;
  DIMENSIONS.forEach((d,i)=>{
    const a=(i/12)*Math.PI*2-Math.PI/2, px=Math.cos(a), py=Math.sin(a), nx=-py, ny=px;
    const pts=[[px*tipR,py*tipR],[px*baseR+nx*halfW,py*baseR+ny*halfW],[px*baseR-nx*halfW,py*baseR-ny*halfW]];
    const on=!!(p.agent_dims||{})[d.id];
    const sw=Math.max(1.25,size*0.0125);
    g.append('polygon').attr('points',pts.map(q=>q.map(n=>n.toFixed(2)).join(',')).join(' '))
      .attr('fill',on?rayC:'none').attr('stroke',on?rayC:C.rayOff)
      .attr('stroke-width',on?sw*0.5:sw)
      .attr('data-kind','ray').attr('data-label',d.label).attr('data-on',String(on));
  });
  g.append('circle').attr('r',coreR+gap).attr('fill',C.surface);
  g.append('text').attr('text-anchor','middle').attr('dominant-baseline','central')
    .attr('font-weight',700).attr('font-size',size*0.155).attr('fill',C.ink)
    .text(Number(p.score).toFixed(1));
  return svg.node();
}

function render(p, size) {
  const m = mode();
  if (impl === 'canvas') return canvasGlyph(p, size, m);
  if (impl === 'd3') return d3Glyph(p, size, m);
  const d = document.createElement('div');
  d.innerHTML = kinGlyph(p, {size:size, mode:m, palette:pal, coreFill:'var(--panel)'});
  return d.firstChild;
}

function draw() {
  document.getElementById('implnote').textContent = NOTES[impl];
  document.getElementById('palnote').textContent = PALNOTE[pal];
  const PC = PALETTES[pal][mode()], m = mode();
  const items = (pal === 'facet')
    ? FACETS.map(f=>'<span><i class="sw" style="background:'+f[m]+'"></i>'+f.label+'</span>')
    : BANDS.map(b=>'<span><i class="sw" style="background:'+PC[b.id]+'"></i>'+b.label+'</span>');
  document.getElementById('legend').innerHTML = items.join('') +
    '<span style="margin-left:8px"><i class="sw" style="background:'+
      (RAYS[m][ (data.twilio&&data.twilio.agent_band) || 'agent-native'])+
      ';clip-path:polygon(50% 0,100% 100%,0 100%)"></i>rays = agent readiness (brighter gold = readier) · outline = not satisfied</span>';

  const spec=document.getElementById('specimens'); spec.innerHTML='';
  order.forEach(s=>{
    const p=data[s]; if(!p) return;
    const card=document.createElement('div'); card.className='card';
    card.appendChild(render(p,240));
    const n=document.createElement('div'); n.className='nm'; n.textContent=p.name; card.appendChild(n);
    const on=Object.values(p.agent_dims||{}).filter(Boolean).length;
    const sub=document.createElement('div'); sub.className='sub';
    sub.textContent=p.score+' '+p.band+' · agent '+Math.round(p.agent_score)+' ('+on+'/12)';
    card.appendChild(sub); spec.appendChild(card);
  });

  const rows=document.getElementById('rows'); rows.innerHTML='';
  order.forEach(s=>{
    const p=data[s]; if(!p) return;
    const r=document.createElement('div'); r.className='row';
    r.appendChild(render(p,34));
    const t=document.createElement('div');
    t.innerHTML='<strong>'+p.name+'</strong> <span class="sub">— '+p.score+' '+p.band+'</span>';
    r.appendChild(t); rows.appendChild(r);
  });

  const hdr=['Provider','Score','Band'].concat(FACETS.map(f=>f.label.split(' ')[0])).concat(['Agent','Dims']);
  const body=order.filter(s=>data[s]).map(s=>{
    const p=data[s], on=Object.values(p.agent_dims||{}).filter(Boolean).length;
    return '<tr><td>'+p.name+'</td><td>'+p.score+'</td><td>'+p.band+'</td>'+
      FACETS.map(f=>'<td>'+Number((p.facets||{})[f.id]||0).toFixed(1)+'</td>').join('')+
      '<td>'+Math.round(p.agent_score)+'</td><td>'+on+'/12</td></tr>';
  }).join('');
  document.getElementById('table').innerHTML =
    '<table><thead><tr>'+hdr.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table>';
}

document.getElementById('theme').onclick=function(e){
  const dark=document.documentElement.dataset.theme==='dark';
  document.documentElement.dataset.theme=dark?'light':'dark';
  e.target.setAttribute('aria-pressed',String(!dark));
  e.target.textContent=dark?'Toggle dark':'Toggle light';
  draw();
};
document.querySelectorAll('.pal').forEach(function(b){
  b.onclick=function(){
    pal=b.dataset.pal;
    document.querySelectorAll('.pal').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));
    draw();
  };
});
document.querySelectorAll('.impl').forEach(function(b){
  b.onclick=function(){
    impl=b.dataset.impl;
    document.querySelectorAll('.impl').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));
    draw();
  };
});
/* ---- hover layer: reads the data-* hooks the SVG/D3 marks carry ---- */
const tip = document.getElementById('tip');
function showTip(el, e){
  const kind = el.getAttribute('data-kind');
  const label = el.getAttribute('data-label') || '';
  if (kind === 'ring') {
    tip.innerHTML = '<b>'+label+'</b><br><span class="v">'+el.getAttribute('data-value')+
                    ' &middot; '+el.getAttribute('data-band')+'</span>';
  } else {
    const on = el.getAttribute('data-on') === 'true';
    tip.innerHTML = '<b>'+label+'</b><br><span class="v">'+(on?'satisfied':'not satisfied')+'</span>';
  }
  tip.style.opacity = '1';
  moveTip(e);
}
function moveTip(e){
  const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
  let x = e.clientX + pad, y = e.clientY + pad;
  if (x + w > innerWidth - 8) x = e.clientX - w - pad;
  if (y + h > innerHeight - 8) y = e.clientY - h - pad;
  tip.style.left = x+'px'; tip.style.top = y+'px';
}
document.addEventListener('mouseover', e => {
  const el = e.target.closest && e.target.closest('[data-kind]');
  if (el) showTip(el, e);
});
document.addEventListener('mousemove', e => { if (tip.style.opacity === '1') moveTip(e); });
document.addEventListener('mouseout', e => {
  if (e.target.closest && e.target.closest('[data-kind]')) tip.style.opacity = '0';
});

draw();
</script>
<script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js" onload="draw()"></script>
</body>
</html>
`;

/* Fail the build rather than emit a page whose script cannot parse. An escaped
   apostrophe that survived the template literal shipped a dead page once; a
   check here costs nothing and catches the whole class. */
const inline = html.split('<script>')[1].split('</script>')[0];
try {
  new Function(inline);
} catch (err) {
  console.error('\nBUILD FAILED — inline script does not parse:\n  ' + err.message);
  const line = (err.stack || '').match(/<anonymous>:(\d+)/);
  if (line) console.error('  near line ' + line[1] + ':\n  ' + inline.split('\n')[line[1] - 1]);
  process.exit(1);
}

fs.writeFileSync('./standalone.html', html);
console.log('wrote standalone.html —', (html.length / 1024).toFixed(1) + 'KB, opens from file:// (script parses)');
