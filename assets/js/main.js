/* Horizon Boat Tours Barbados · site script */
(function(){
'use strict';
const ROOT=(document.currentScript&&document.currentScript.src.replace(/assets\/js\/main\.js.*$/,''))||'/';
const WA='12462576527', TZ='America/Barbados', LAT=13.1856, LNG=-59.6406;
const PRICE={adult:60,kid:45,priv2h:600,privHour:250,privPerson:50,privIncluded:10,privMax:40,sharedMax:20};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600)}
document.body.classList.add('ready');

/* nav + mobile menu */
const nav=$('#nav'), hero=$('.hero,.phero');
function navState(){const lim=hero?hero.offsetHeight-80:40;nav.classList.toggle('solid',scrollY>lim)}
addEventListener('scroll',navState,{passive:true});navState();
const burger=$('.burger');
if(burger){burger.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)});
  $$('.mmenu a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')))}

/* WhatsApp links */
$$('[data-wa]').forEach(a=>{a.href=wa(a.dataset.wa||"Hi Horizon! I'd like to ask about your boat tours.");a.target='_blank';a.rel='noopener'});

/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to,d=+(el.dataset.dec||0),t0=performance.now();
  (function f(n){const p=Math.min(1,(n-t0)/1400),v=to*(1-Math.pow(1-p,3));el.textContent=v.toFixed(d);if(p<1)requestAnimationFrame(f)})(t0);co.unobserve(el)}),{threshold:.5});
$$('.cnt').forEach(el=>co.observe(el));

/* glass-bottom lens (home hero) */
(function(){
  const h=$('.hero'), ring=$('#ring'); if(!h||!ring)return;
  let r=innerWidth<680?105:150, tx=0,ty=0,cx=0,cy=0,last=0,t0=performance.now();
  for(let i=0;i<8;i++){const b=document.createElement('i');const a=i/8*Math.PI*2;b.style.transform=`translate(-50%,-50%) rotate(${a}rad) translateY(calc(var(--r) * -1 - 4.5px))`;ring.appendChild(b)}
  function size(){r=innerWidth<680?105:150;h.style.setProperty('--r',r+'px')}
  size();addEventListener('resize',size);
  const W=()=>h.clientWidth,H=()=>h.clientHeight;
  cx=tx=W()*.7;cy=ty=H()*.52;
  function move(e){const b=h.getBoundingClientRect();tx=e.clientX-b.left;ty=e.clientY-b.top;last=performance.now()}
  h.addEventListener('pointermove',move);h.addEventListener('pointerdown',move);
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loop(now){
    if(now-last>2500&&!still){const k=(now-t0)/1000, mob=W()<680;
      tx=mob? W()*.5+Math.sin(k*.45)*W()*.28 : W()*.7+Math.sin(k*.35)*W()*.14;
      ty=mob? H()*.7+Math.cos(k*.6)*H()*.07 : H()*.5+Math.sin(k*.5)*H()*.14;}
    cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    h.style.setProperty('--lx',cx+'px');h.style.setProperty('--ly',cy+'px');
    requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
})();

/* Barbados time + sunset */
function bbNow(){const p=new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'long'}).formatToParts(new Date());const o={};p.forEach(x=>o[x.type]=x.value);return{h:+o.hour%24,m:+o.minute,s:+o.second,wd:o.weekday,y:+o.year,mo:+o.month,d:+o.day}}
const fmt=(h,m)=>{const ap=h>=12?'PM':'AM';return `${(h%12)||12}:${String(m).padStart(2,'0')} ${ap}`};
function sunsetMin(){
  const n=bbNow(), date=Date.UTC(n.y,n.mo-1,n.d,12);const JD=date/86400000+2440587.5;
  const N=Math.round(JD-2451545+.0008), Js=N-LNG/360, rad=Math.PI/180;
  const M=(357.5291+.98560028*Js)%360, C=1.9148*Math.sin(M*rad)+.02*Math.sin(2*M*rad)+.0003*Math.sin(3*M*rad);
  const L=(M+C+180+102.9372)%360, Jt=2451545+Js+.0053*Math.sin(M*rad)-.0069*Math.sin(2*L*rad);
  const dec=Math.asin(Math.sin(L*rad)*Math.sin(23.4397*rad));
  const w=Math.acos((Math.sin(-.833*rad)-Math.sin(LAT*rad)*Math.sin(dec))/(Math.cos(LAT*rad)*Math.cos(dec)))/rad;
  const d=new Date((Jt+w/360-2440587.5)*86400000);
  return ((d.getUTCHours()-4+24)%24)*60+d.getUTCMinutes();
}
const SS=sunsetMin();
$$('[data-sunset]').forEach(el=>el.textContent=fmt(Math.floor(SS/60),SS%60));

/* tour schedule (shared tours) */
const SLOTS=[
  {k:'Morning Tour',t:600,e:720,lab:'10:00 AM – 12:00 PM',s:'Turtles, shipwreck & reef. Often the calmest water of the day.'},
  {k:'Midday Tour',t:750,e:870,lab:'12:30 – 2:30 PM',s:'Bright sun, great light through the glass bottom.'},
  {k:'Afternoon Tour',t:900,e:1020,lab:'3:00 – 5:00 PM',s:'Warm water and a relaxed afternoon on the sun deck.',alt:'Runs instead of the Sunset Tour'},
  {k:'Sunset Tour',t:960,e:1080,lab:'4:00 – 6:00 PM',s:'Snorkel stops, then golden hour on the way back.',alt:'Runs instead of the 3 PM tour'}
];
const rows=$('#rows');
function renderRows(){
  if(!rows)return;
  const n=bbNow(), now=n.h*60+n.m; const nextI=SLOTS.findIndex(d=>d.t>now);
  rows.innerHTML=SLOTS.map((d,i)=>`<div class="row ${i===nextI?'next':''}">
    <span class="t">${fmt(Math.floor(d.t/60),d.t%60).replace(' ','<small style="font-size:11px;margin-left:4px">')+'</small>'}</span>
    <div><h3 style="font-family:var(--serif);font-weight:350;font-size:24px">${d.k}${i===nextI?'<span class="pill">NEXT</span>':''}</h3><small>${d.s}</small>${d.alt?`<span class="alt">${d.alt}</span>`:''}</div>
    <span class="du">2 HRS · MAX 20</span>
    <span class="pr">$60 <small>/ adult</small></span>
    <a href="${ROOT}book/?tour=shared&slot=${i}" class="bk">Book →</a></div>`).join('');
}
function tick(){
  const n=bbNow(), now=n.h*60+n.m+n.s/60;
  $$('[data-bbtime]').forEach(el=>el.textContent=fmt(n.h,n.m));
  $$('[data-bbday]').forEach(el=>el.textContent=n.wd);
  const starts=[600,750,900];
  let nx=starts.find(t=>t>now), diff=nx? nx-now : starts[0]+1440-now;
  const h=Math.floor(diff/60), m=Math.floor(diff%60);
  $$('[data-nextin]').forEach(el=>el.textContent=(h?h+'h ':'')+m+'m');
}
renderRows();tick();setInterval(tick,1000);setInterval(renderRows,60000);

/* route on scroll */
(function(){
  const path=$('#rp'), mask=$('#rpMask'), boat=$('#boat'), sec=$('#trip'); if(!path||!sec)return;
  const L=path.getTotalLength(), steps=$$('#steps li');
  mask.style.strokeDasharray=L;
  function upd(){
    const b=sec.getBoundingClientRect(), vh=innerHeight;
    let p=(vh*.75-b.top)/(b.height*.85); p=Math.max(0,Math.min(1,p));
    mask.style.strokeDashoffset=-L*p;
    const pt=path.getPointAtLength(L*p), pt2=path.getPointAtLength(Math.min(L,L*p+1));
    boat.setAttribute('transform',`translate(${pt.x} ${pt.y}) rotate(${Math.atan2(pt2.y-pt.y,pt2.x-pt.x)*180/Math.PI})`);
    const th=[0,.12,.3,.55,.78];steps.forEach((s,i)=>s.classList.toggle('on',p>=th[i]));
  }
  addEventListener('scroll',upd,{passive:true});upd();
})();

/* private charter price */
function privTotal(h,g){return PRICE.priv2h+Math.max(0,h-2)*PRICE.privHour+Math.max(0,g-PRICE.privIncluded)*PRICE.privPerson}
(function(){ // mini calculator on charter page
  const hs=$('#cHrs'), gs=$('#cGrp'); if(!hs)return;
  function u(){const h=+hs.value,g=+gs.value;$('#cHv').textContent=h;$('#cGv').textContent=g;$('#cTot').textContent='$'+privTotal(h,g).toLocaleString();
    $('#cBook').href=`${ROOT}book/?tour=private&h=${h}&g=${g}`}
  hs.addEventListener('input',u);gs.addEventListener('input',u);u();
})();

/* booking form */
(function(){
  const form=$('#booking'); if(!form)return;
  const q=new URLSearchParams(location.search);
  const st={mode:q.get('tour')==='private'?'private':'shared',slot:Math.min(3,Math.max(0,+(q.get('slot')||0))),a:2,k:0,i:0};
  const hrs=$('#hrs'),grp=$('#grp');
  if(q.get('h'))hrs.value=Math.min(6,Math.max(2,+q.get('h')));
  if(q.get('g'))grp.value=Math.min(40,Math.max(1,+q.get('g')));
  function ymd(off){const n=bbNow();return new Date(Date.UTC(n.y,n.mo-1,n.d+off)).toISOString().slice(0,10)}
  ['#date','#pdate'].forEach(s=>{$(s).min=ymd(0);$(s).value=ymd(1)});
  function chips(){
    $('#depChips').innerHTML=SLOTS.map((d,i)=>`<button type="button" class="chip ${i===st.slot?'on':''}" data-i="${i}">${d.k.replace(' Tour','')}<small>${d.lab}</small></button>`).join('');
    $$('#depChips .chip').forEach(c=>c.onclick=()=>{st.slot=+c.dataset.i;chips();upd()});
  }
  function mode(m){st.mode=m;$$('#seg button').forEach(b=>{const on=b.dataset.m===m;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
    $('#sharedF').hidden=m!=='shared';$('#privateF').hidden=m!=='private';upd()}
  $$('#seg button').forEach(b=>b.onclick=()=>mode(b.dataset.m));
  $$('[data-s]').forEach(b=>b.onclick=()=>{const s=b.dataset.s, before={...st};
    if(s==='a+')st.a++; if(s==='a-')st.a=Math.max(1,st.a-1);
    if(s==='k+')st.k++; if(s==='k-')st.k=Math.max(0,st.k-1);
    if(s==='i+')st.i++; if(s==='i-')st.i=Math.max(0,st.i-1);
    if(st.a+st.k+st.i>PRICE.sharedMax){Object.assign(st,before);toast('Shared tours take up to 20 guests. For bigger groups, choose a private charter.')}
    upd()});
  ['#hrs','#grp','#occ','#ptime','#date','#pdate','#gname'].forEach(s=>$(s).addEventListener('input',upd));
  const nice=v=>{if(!v)return'—';const [y,m,d]=v.split('-').map(Number);return new Date(Date.UTC(y,m-1,d)).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})};
  function upd(){
    $('#ad').textContent=st.a;$('#kd').textContent=st.k;$('#id').textContent=st.i;
    const h=+hrs.value,g=+grp.value;$('#hv').textContent=h;$('#gv').textContent=g;
    const name=($('#gname').value||'').trim();
    let title,list,total,msg;
    if(st.mode==='shared'){const d=SLOTS[st.slot],date=nice($('#date').value);
      title=d.k;total=st.a*PRICE.adult+st.k*PRICE.kid;
      const who=[`${st.a} adult${st.a>1?'s':''}`];if(st.k)who.push(`${st.k} child${st.k>1?'ren':''} (3–12)`);if(st.i)who.push(`${st.i} under 3`);
      list=[['Date',date],['Time',d.lab],['Guests',who.join(', ')],['Duration','2 hours']];
      msg=`Hi Horizon! I'd like to book the ${d.k} (${d.lab}) on ${date} for ${who.join(', ')}. Estimated total: US$${total}.`;
    }else{const date=nice($('#pdate').value),occ=$('#occ').value,pt=$('#ptime').value;
      title='Private Charter';total=privTotal(h,g);
      list=[['Date',date],['Start time',pt],['Hours',h+' h'],['Guests',g],['Occasion',occ]];
      msg=`Hi Horizon! I'd like a private charter on ${date} (${pt}) for ${g} guests, ${h} hours. Occasion: ${occ}. Estimated total: US$${total.toLocaleString()}.`;
    }
    msg+=name?` My name is ${name}.`:' My name is: ';
    $('#sTitle').textContent=title;
    $('#sList').innerHTML=list.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
    $('#sTotal').textContent='$'+total.toLocaleString();
    $('#waBtn').href=wa(msg);
    $('#mailBtn').href=`mailto:info@horizonboattoursbarbados.com?subject=${encodeURIComponent('Booking request: '+title)}&body=${encodeURIComponent(msg)}`;
  }
  chips();mode(st.mode);
  $('#waBtn').addEventListener('click',()=>toast('Opening WhatsApp with your booking…'));
})();

/* faq accordion */
$$('.qa button').forEach(b=>{b.setAttribute('aria-expanded','false');b.onclick=()=>{const q=b.parentElement,o=q.classList.contains('open');
  $$('.qa').forEach(x=>{x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded','false')});
  if(!o){q.classList.add('open');b.setAttribute('aria-expanded','true')}}});
const firstQa=$('.qa');if(firstQa){firstQa.classList.add('open');firstQa.querySelector('button').setAttribute('aria-expanded','true')}
})();

/* gallery lightbox */
(function(){
  const lb=document.getElementById('lb'); if(!lb)return;
  const items=[...document.querySelectorAll('[data-lb]')], img=document.getElementById('lbImg'), cap=document.getElementById('lbCap');
  let i=0;
  function show(n){i=(n+items.length)%items.length;const a=items[i];img.src=a.getAttribute('href');img.alt=a.dataset.alt;cap.textContent=a.dataset.alt}
  function open(n){show(n);lb.hidden=false;document.body.style.overflow='hidden'}
  function close(){lb.hidden=true;document.body.style.overflow=''}
  items.forEach((a,n)=>a.addEventListener('click',e=>{e.preventDefault();open(n)}));
  lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=()=>show(i-1);lb.querySelector('.lb-n').onclick=()=>show(i+1);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
})();
