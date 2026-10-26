/* a little world for bella ♡ — intentionally no analytics, trackers or backend */
(() => {
  'use strict';
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];
  const storage = {
    get(k, fallback) { try { const v=localStorage.getItem('bella2:'+k); return v===null?fallback:JSON.parse(v); } catch { return fallback; } },
    set(k,v) { try { localStorage.setItem('bella2:'+k,JSON.stringify(v)); } catch {} }
  };
  const prefersLess = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sound = false;
  let toastTimer;
  const toast = (text) => { const t=qs('#toast'); if(!t)return; t.textContent=text; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2900); };
  const chime = () => { if(!sound) return; try { const A=window.AudioContext||window.webkitAudioContext; if(!A) return; const ctx=new A(); const now=ctx.currentTime; [523,659,784].forEach((freq,i)=>{ const osc=ctx.createOscillator();const gain=ctx.createGain(); osc.type='sine';osc.frequency.value=freq;osc.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(.0001,now+i*.09);gain.gain.exponentialRampToValueAtTime(.07,now+i*.09+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.09+.28);osc.start(now+i*.09);osc.stop(now+i*.09+.3);});setTimeout(()=>ctx.close().catch(()=>{}),900); } catch{} };
  const sparks = (x,y,count=14) => { if(prefersLess)return; const layer=qs('#sparkle-layer'); if(!layer)return; const signs=['✿','♡','✧','✳','❀'];const colors=['#d39193','#b3bba1','#dbbd84','#bf9bc0'];for(let i=0;i<count;i++){const el=document.createElement('span');el.className='pop-spark';el.textContent=signs[i%signs.length];el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--dx',((Math.random()-.5)*250)+'px');el.style.setProperty('--dy',((Math.random()-.5)*230-55)+'px');el.style.setProperty('--spin',((Math.random()-.5)*320)+'deg');el.style.setProperty('--size',(14+Math.random()*19)+'px');el.style.setProperty('--color',colors[i%colors.length]);layer.appendChild(el);setTimeout(()=>el.remove(),1450);} };
  const burstAt = (el,n=15) => { const r=el.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,n);chime(); };
  const menuBtn=qs('.menu-toggle'), menu=qs('#site-menu');
  menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close chapter menu':'Open chapter menu');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && menu?.classList.contains('open')){menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.focus();}});
  const soundBtn=qs('.sound-toggle'); soundBtn?.addEventListener('click',()=>{sound=!sound;soundBtn.setAttribute('aria-pressed',String(sound));soundBtn.title=sound?'sound effects on':'sound effects off';if(sound)chime();toast(sound?'tiny chimes on ♡':'tiny chimes off');});
  if('IntersectionObserver' in window && !prefersLess){const ob=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');ob.unobserve(item.target);}}),{threshold:.08});qsa('.reveal').forEach(el=>ob.observe(el));}else qsa('.reveal').forEach(el=>el.classList.add('visible'));
  const page=qs('body')?.dataset.page||'index';
  const pages=['index','world','museum','garden','sky','pocket','letter','ending'];const visited=storage.get('visited',[]);if(!visited.includes(page)){visited.push(page);storage.set('visited',visited);}qsa('.chapter-dot').forEach((dot,i)=>{if(visited.includes(pages[i]))dot.style.boxShadow='0 0 0 3px rgba(225,167,151,.15)';});
  qs('[data-confetti]')?.addEventListener('click',e=>{burstAt(e.currentTarget,25);toast('okay, so i might be a LITTLE dramatic ♡');});
  const gift=qs('[data-gift]'); gift?.addEventListener('click',()=>{const opened=gift.classList.toggle('open');qs('#gift-pop')?.classList.toggle('visible',opened);gift.setAttribute('aria-label',opened?'Close the surprise box':'Open your surprise');burstAt(gift,28);});
  const exhibits={
    1:['☀','the light you bring','some people make ordinary moments feel a little softer just by being there. i think you have that gift. i hope you know it matters, even when nobody says it out loud.'],
    2:['♡','a really good heart','the fact that you care deeply is not something to be embarrassed about. being tender in a world that can be careless is its own kind of brave.'],
    3:['✿','growing, always','you do not have to be the same person you were yesterday. you are allowed to learn, change, grow, and become someone you are proud of.'],
    4:['☾','your quiet strength','not every kind of strength looks loud. sometimes it looks like getting through a difficult day, putting one foot in front of another, and trying again tomorrow.'],
    5:['♡','the one and only you','not a copy, not a replacement, not a version that has to earn a place in the world. just bella. and that is already something worth celebrating.'],
    6:['✳','the little things','i hope you notice the small good things about yourself, too. the tiny kindnesses and little moments that are easy to overlook but mean so much.']
  };
  const dialog=qs('#exhibit-dialog');
  qsa('[data-exhibit]').forEach(b=>b.addEventListener('click',()=>{const data=exhibits[b.dataset.exhibit];if(!data||!dialog)return;qs('#exhibit-symbol').textContent=data[0];qs('#exhibit-title').textContent=data[1];qs('#exhibit-text').textContent=data[2];dialog.showModal();chime();}));
  qsa('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>dialog?.close()));
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  const plantNames=['kindness','joy','peace','courage','softness','hope'];
  let grown=storage.get('garden',[]);if(!Array.isArray(grown))grown=[];grown=grown.filter(i=>Number.isInteger(i)&&i>=0&&i<6);
  const updateGarden=()=>{qsa('[data-plant]').forEach(b=>{const i=Number(b.dataset.plant);const yes=grown.includes(i);b.classList.toggle('grown',yes);b.setAttribute('aria-label',(yes?'Already grown: ':'Grow ')+plantNames[i]);});const c=qs('#grown-count');if(c)c.textContent=grown.length;};updateGarden();
  qsa('[data-plant]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.plant);if(grown.includes(i)){toast('this little '+plantNames[i]+' flower is already yours ♡');return;}grown.push(i);storage.set('garden',grown);updateGarden();burstAt(b,14);toast(grown.length===6?'look at you. you grew a whole garden ♡':'a little '+plantNames[i]+' is growing for you ✿');}));
  qs('#restart-garden')?.addEventListener('click',()=>{grown=[];storage.set('garden',grown);updateGarden();toast('a fresh start for your tiny garden ✿');});
  const starMessages=[
    ['you are enough.','not the someday version of you. not the one who has everything figured out. you, exactly where you are right now.'],
    ['you deserve gentleness.','you do not need to earn basic kindness or feel guilty for needing a little reassurance.'],
    ['your feelings count.','even the messy, complicated ones. you are allowed to feel them without having to explain them perfectly.'],
    ['there is more ahead.','there are sunsets you have not seen, songs you have not loved yet, and days that will surprise you in the nicest ways.'],
    ['being soft is brave.','having a kind heart does not make you weak. it means there is still so much good in you.'],
    ['it is okay to rest.','your worth has never been measured by how much you can do or how much you can carry.'],
    ['you can begin again.','not everything has to make sense today. some things get clearer with time and space.'],
    ['small joys matter.','a favorite snack, a silly joke, the perfect song at the perfect moment. you deserve to have a thousand more of those.'],
    ['the stars are lucky tonight.','they get to say something i hope you remember: being you is already a lovely thing.']
  ];
  let stars=storage.get('stars',[]);if(!Array.isArray(stars))stars=[];stars=stars.filter(i=>Number.isInteger(i)&&i>=0&&i<9);const refreshStars=()=>{qsa('[data-star]').forEach(s=>s.classList.toggle('seen',stars.includes(Number(s.dataset.star))));const c=qs('#star-count');if(c)c.textContent=stars.length+' / 9 stars discovered';};refreshStars();
  qsa('[data-star]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.star);if(!stars.includes(i)){stars.push(i);storage.set('stars',stars);}refreshStars();qs('#sky-title').textContent=starMessages[i][0];qs('#sky-message').textContent=starMessages[i][1];burstAt(b,9);if(stars.length===9)toast('you found every single star, bella ✧');}));
  qs('#shooting-star')?.addEventListener('click',e=>{const s=qs('#starfield');if(!s)return;const meteor=document.createElement('div');meteor.className='shooting';s.appendChild(meteor);setTimeout(()=>meteor.remove(),1500);chime();toast('a wish, just for you ✧');});
  const noteBank={
    soft:["you don't have to be okay all the time. you just have to be human, and you are doing that beautifully.","if today was hard, that doesn't mean you are doing life wrong.","be as gentle with yourself as you are with the people you care about.","you are allowed to take up space without apologizing for it.","some days, getting through is more than enough. i'm proud of you for trying.","you don't have to turn every feeling into a lesson. sometimes you just need a little rest."],
    brave:["you can do scary things while still being scared. that counts as courage.","you are allowed to say no, set a boundary, and choose what feels right for you.","one small step still moves you forward. nobody gets to decide your pace but you.","your voice matters, even when it shakes.","the next chapter of your life is yours to write. nobody else gets the pen.","you have made it through things you once thought you couldn't. don't forget that."],
    smile:["official announcement: bella has been declared 100% cooler than the average person. very scientific.","this note is legally required to tell you that your existence improves the vibe.","if i could mail you a tiny dancing flower, i would. unfortunately, this website will have to do. ✿","you deserve a little treat. no, i will not be taking questions at this time.","you opened a whole website because i can't be normal about giving gifts. that has to count for something.","tiny emergency reminder: you are a big deal. also drink some water, please."],
    seen:["you are more than how useful you are to other people. you deserve care just for being you.","i hope someone tells you how much the small things you do matter. i hope you believe them.","being sensitive is not a flaw that needs fixing. your heart is something worth caring for.","even when you feel hard to understand, you are not too much.","you deserve relationships where you feel secure, heard, and respected.","you are not invisible. your presence makes a difference, even in ordinary moments."]
  };
  let currentType='soft', noteIndex=-1;
  function dispense(type=currentType){currentType=type;const choices=noteBank[type]||noteBank.soft;let i=Math.floor(Math.random()*choices.length);if(choices.length>1&&i===noteIndex)i=(i+1)%choices.length;noteIndex=i;const card=qs('#machine-sticky');if(!card)return;card.classList.add('change');setTimeout(()=>{qs('#note-text').textContent=choices[i];qs('#note-count').textContent='a little note · #'+String(i+1).padStart(2,'0');card.classList.remove('change');chime();},prefersLess?0:260);qsa('[data-notetype]').forEach(b=>b.classList.toggle('active',b.dataset.notetype===currentType));}
  qsa('[data-notetype]').forEach(b=>b.addEventListener('click',()=>dispense(b.dataset.notetype)));
  qs('#another-note')?.addEventListener('click',()=>dispense());
  qs('#copy-note')?.addEventListener('click',async()=>{const text=qs('#note-text')?.textContent||'';if(!text||text.includes('pick a feeling')){toast('pick your first note ♡');return;}try{await navigator.clipboard.writeText(text);toast('saved to your clipboard ♡');}catch{toast('you can screenshot this little note ♡');}});
  const env=qs('#letter-envelope');env?.addEventListener('click',()=>{const open=env.getAttribute('aria-expanded')==='true';env.setAttribute('aria-expanded',String(!open));env.classList.toggle('open',!open);const paper=qs('#the-letter');if(paper)paper.hidden=open;qs('#letter-prompt').textContent=open?'tap the envelope to unfold the letter ↗':'a little piece of my heart, in words ♡';if(!open){burstAt(env,16);setTimeout(()=>paper?.scrollIntoView({behavior:prefersLess?'instant':'smooth',block:'start'}),prefersLess?0:450);}});
  qs('#keep-flower')?.addEventListener('click',e=>{const gift=qs('#flower-gift');if(!gift)return;gift.hidden=false;burstAt(e.currentTarget,30);e.currentTarget.textContent='your flower is right here ♡';toast('you can always come back for it ✿');});
})();