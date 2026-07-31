const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
// reveal
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll("[data-reveal]").forEach(el=>io.observe(el));
const sweep=()=>{document.querySelectorAll("[data-reveal]:not(.in)").forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.95)el.classList.add("in")})};
addEventListener("load",()=>{sweep();setTimeout(sweep,300)});
setTimeout(sweep,400);addEventListener("scroll",sweep,{passive:true});
// header + dock
const hdr=document.querySelector("header"),dock=document.querySelector(".dock"),hero=document.querySelector(".hero");
addEventListener("scroll",()=>{const y=scrollY;hdr.classList.toggle("stuck",y>12);dock.classList.toggle("on",y>(hero.offsetHeight*.75))},{passive:true});
// accordions
document.querySelectorAll(".acc-btn").forEach(btn=>{btn.addEventListener("click",()=>{const open=btn.getAttribute("aria-expanded")==="true";const grp=btn.closest(".acc");if(!open&&grp.dataset.single==="1"){grp.querySelectorAll('.acc-btn[aria-expanded="true"]').forEach(o=>{o.setAttribute("aria-expanded","false");o.nextElementSibling.dataset.open="false"})}btn.setAttribute("aria-expanded",String(!open));btn.nextElementSibling.dataset.open=String(!open)})});
// hero chat
const thread=document.getElementById("thread"),takeBtn=document.getElementById("takeover"),replayBtn=document.getElementById("replay"),note=document.getElementById("chat-note");
const script=[
 {who:"them",txt:"היי, יש לכם מקום פנוי השבוע?",t:"22:47",wait:700},
 {who:"bot",txt:"היי 🙂 יש לי פנוי ביום ג' ב-9:00 או ד' ב-16:30. מה נוח לך?",t:"22:47",typing:1400,wait:900},
 {who:"them",txt:"ג' ב-9:00 מעולה",t:"22:48",wait:700},
 {who:"bot",txt:"קבעתי לך ✅ נכנס ליומן, ואשלח תזכורת יום לפני.",t:"22:48",typing:1200,wait:600}
];
let timers=[],taken=false;
const clearAll=()=>{timers.forEach(clearTimeout);timers=[]};
const wait=ms=>new Promise(r=>timers.push(setTimeout(r,rm?60:ms)));
function bubble(who,txt,t,extra){const d=document.createElement("div");d.className="bub "+who;d.innerHTML=(extra?`<b>${extra}</b>`:"")+txt+`<time>${t}</time>`;thread.appendChild(d);return d}
function typing(){const d=document.createElement("div");d.className="typing";d.innerHTML="<i></i><i></i><i></i>";thread.appendChild(d);return d}
async function play(){
 clearAll();taken=false;thread.innerHTML="";takeBtn.disabled=false;replayBtn.hidden=true;
 note.textContent="זמן תגובה: 3 שניות · הלקוחה ישנה. התור נקבע.";
 for(const m of script){
  if(taken)return;
  if(m.typing){const t=typing();await wait(m.typing);if(taken){t.remove();return}t.remove()}
  bubble(m.who,m.txt,m.t);
  await wait(m.wait);
 }
 replayBtn.hidden=false;
}
takeBtn?.addEventListener("click",async()=>{
 if(taken)return;taken=true;clearAll();takeBtn.disabled=true;
 document.querySelectorAll(".typing").forEach(t=>t.remove());
 thread.querySelectorAll(".bub.bot").forEach(b=>b.classList.add("muted"));
 await wait(260);
 bubble("them","רגע, אפשר גם טיפול כפול באותו תור?","22:48");
 await wait(700);
 const t=typing();t.style.opacity=".35";await wait(500);t.remove();
 bubble("human","היי, זו רוני מהקליניקה — כן, אפשר. אני מוסיפה חצי שעה לתור שלך.","22:49","הבוט הושתק · אתם עונים");
 note.innerHTML='הבוט שותק ברגע שנכנסתם. הוא לא יחזור לשיחה עד שתחזירו לו אותה.';
 replayBtn.hidden=false;
});
replayBtn?.addEventListener("click",play);
let started=false;const start=()=>{if(started)return;started=true;play()};
if(thread){const once=new IntersectionObserver(es=>{if(es[0].isIntersecting){once.disconnect();start()}},{threshold:.3});once.observe(thread);setTimeout(()=>{if(thread.getBoundingClientRect().top<innerHeight)start()},600)}
