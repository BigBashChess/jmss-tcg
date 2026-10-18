(() => {
  "use strict";
  const STOR_KEY = "jmss-tcg-collection-v1";
  const cards = [
    ["Flush Sac Anderson","flush-sac-anderson.webp"],["Algorithm Albrecht","algorithm-albrecht.webp"],
    ["Stephen Finchy","stephen-finchy.webp"],["Peter Thompson","peter-thompson.webp"],
    ["Vincenzo Piscioneri","vincenzo-piscioneri.webp"],["Romanian Gavrilescu","romanian-gavrilescu.webp"],
    ["Rimkevicius","rimkevicius.webp"],["Scott Chittleborough","scott-chittleborough.webp"],
    ["Kermond","kermond.webp"],["Rainy Xia","rainy-xia.webp"],
    ["Sunny Xia","sunny-xia.webp"],["Muppet Finchy","muppet-finchy.webp"],
    ["Dr Driscoll","dr-driscoll.webp"],["Danger Grainger","danger-grainger.webp"],
    ["Gen Z Clarke","gen-z-clarke.webp"],["Bonehead Kermond","bonehead-kermond.webp"]
  ];
  const $ = id => document.getElementById(id);
  const stage=$("pack-stage"),button=$("pack-button"),art=$("pack-art"),status=$("pack-status"),
        progress=$("pack-progress"),fill=$("pack-fill"),reset=$("pack-reset"),reveal=$("card-reveal"),
        skip=$("skip-reveal"),counter=$("reveal-counter"),summary=$("reveal-summary");
  if(!stage||!button||!reveal)return;
  const reduced=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const maxClicks=6;
  let clicks=0,angle=0,state="ready",selected=[],shown=0,timers=[];
  const schedule=(fn,ms)=>{const id=window.setTimeout(fn,ms);timers.push(id);};
  const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];};
  function chooseCards(){
    const shuffled=cards.slice();
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    return shuffled.slice(0,5);
  }
  function saveCards(items){
    let owned={};
    try{const result=JSON.parse(localStorage.getItem(STOR_KEY)||"{}");if(result&&typeof result==="object"&&!Array.isArray(result))owned=result;}catch(e){}
    for(const [,file] of items){const previous=Number(owned[file]);owned[file]=(Number.isSafeInteger(previous)&&previous>=0?previous:0)+1;}
    try{localStorage.setItem(STOR_KEY,JSON.stringify(owned));return true;}catch(e){return false;}
  }
  function updateCounter(){counter.textContent=shown+" / 5 revealed";}
  function finish(){
    if(state==="finished")return;
    clearTimers();state="finished";shown=5;updateCounter();
    skip.hidden=true;reset.style.display="block";summary.hidden=false;
    status.textContent=summary.dataset.saved==="true"?"All five cards added to your Collection.":"All five cards revealed. Browser storage is unavailable.";
  }
  function revealOne(i){
    if(state!=="revealing")return;
    const card=reveal.children[i];
    if(!card)return;
    card.classList.add("revealed");
    shown=i+1;updateCounter();
    status.textContent=shown===5?"Pack complete!":"Card "+shown+" of 5";
    if(shown===5)finish();
  }
  function startCards(){
    if(state!=="opening")return;
    state="revealing";stage.hidden=true;stage.classList.remove("opening");progress.hidden=true;
    selected=chooseCards();shown=0;const saved=saveCards(selected);
    summary.dataset.saved=String(saved);
    summary.hidden=true;reveal.replaceChildren();reveal.hidden=false;skip.hidden=false;reset.style.display="none";
    selected.forEach(([name,file],i)=>{
      const tile=document.createElement("div");tile.className="flip-card";tile.style.setProperty("--order",String(i));
      const inner=document.createElement("div");inner.className="flip-card-inner";
      const back=document.createElement("div");back.className="flip-card-back";back.textContent="JMSS TCG";
      const front=document.createElement("div");front.className="flip-card-front";
      const img=document.createElement("img");img.src="cards/"+file;img.alt=name;img.loading="eager";
      const caption=document.createElement("span");caption.className="flip-name";caption.textContent=name;
      img.addEventListener("error",()=>{img.hidden=true;caption.textContent=name+" (artwork unavailable)";});
      front.append(img,caption);inner.append(back,front);tile.append(inner);reveal.append(tile);
    });
    updateCounter();status.textContent="Revealing your cards…";
    if(reduced){selected.forEach((_,i)=>revealOne(i));}
    else selected.forEach((_,i)=>schedule(()=>revealOne(i),(i+1)*680));
  }
  function openPack(){
    state="opening";button.disabled=true;status.textContent="Opening your pack…";
    art.style.transform="";stage.classList.add("opening");
    schedule(startCards,reduced?30:2200);
  }
  button.addEventListener("click",()=>{
    if(state!=="ready")return;
    clicks++;angle+=360;
    art.style.transform="rotateY("+angle+"deg) scale(1.06)";
    schedule(()=>{if(state==="ready")art.style.transform="rotateY("+angle+"deg)";},360);
    progress.setAttribute("aria-valuenow",String(clicks));fill.style.width=(clicks/maxClicks*100)+"%";
    if(clicks>=maxClicks){openPack();return;}
    status.textContent="Keep clicking! The pack is starting to open…";
  });
  skip.addEventListener("click",()=>{
    if(state==="opening"){clearTimers();startCards();}
    if(state!=="revealing")return;
    clearTimers();for(let i=0;i<5;i++)reveal.children[i]?.classList.add("revealed");finish();
  });
  reset.addEventListener("click",()=>{
    clearTimers();state="ready";clicks=0;angle=0;selected=[];shown=0;
    stage.hidden=false;stage.classList.remove("opening","opened");art.src="index_images/cardpacks/common.png";
    art.style.transform="";button.disabled=false;progress.hidden=false;progress.setAttribute("aria-valuenow","0");fill.style.width="0";
    reveal.replaceChildren();reveal.hidden=true;skip.hidden=true;summary.hidden=true;
    counter.textContent="";status.textContent="Keep clicking the pack to open it!";reset.style.display="none";
  });
})();