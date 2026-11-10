'use strict';
// The instrumental is a separate audio source from both clips and full songs.
window.StoryMusic = (() => {
  const music=document.querySelector('#story-music'),song=document.querySelector('#audio');
  const preferenceKey='bubong-story-music-v1';
  let enabled=true,volume=.22,started=false,inStory=false,allow=false;
  let blocked=false,pending=false,ticket=0,fade=0,target=-1;
  try{
    const saved=JSON.parse(localStorage.getItem(preferenceKey)||'null');
    if(saved){enabled=saved.enabled!==false;if(Number.isFinite(saved.volume))volume=Math.max(0,Math.min(1,saved.volume))}
  }catch{}
  music.volume=0;
  const notify=()=>document.dispatchEvent(new Event('storymusicchange'));
  function save(){try{localStorage.setItem(preferenceKey,JSON.stringify({enabled,volume}))}catch{}}
  function ramp(){
    if(target===volume)return;
    cancelAnimationFrame(fade);target=volume;
    const from=music.volume,at=performance.now();
    const step=now=>{const t=Math.min(1,(now-at)/650);music.volume=from+(volume-from)*t;if(t<1)fade=requestAnimationFrame(step)};
    fade=requestAnimationFrame(step);
  }
  function reconcile(){
    const wanted=enabled&&started&&inStory&&allow&&!document.hidden&&song.paused&&!document.querySelector('dialog[open]');
    if(!wanted){
      ticket++;pending=false;cancelAnimationFrame(fade);target=-1;music.pause();music.volume=0;notify();return;
    }
    if(!music.paused){ramp();notify();return}
    if(pending||blocked)return;
    const attempt=++ticket;pending=true;music.volume=0;
    music.play().then(()=>{
      if(attempt!==ticket)return;
      pending=false;blocked=false;ramp();notify();
    }).catch(()=>{
      if(attempt!==ticket)return;
      pending=false;blocked=true;notify();
    });
  }
  function state(){
    const status=!enabled?'Music off':blocked?'Tap to start music':!started?'Starts with the story':!allow?'Paused for lyric clip':!music.paused?'Playing softly':'Ready';
    return {enabled,volume,started,blocked,playing:!music.paused,status};
  }
  for(const event of ['play','pause','ended'])song.addEventListener(event,reconcile);
  for(const event of ['playing','pause','error'])music.addEventListener(event,notify);
  document.addEventListener('visibilitychange',reconcile);
  return {
    state,
    sync(next){inStory=next.inStory;allow=next.allow;reconcile()},
    engage(){started=true;blocked=false;reconcile()},
    pause(){started=false;reconcile()},
    toggle(){if(blocked){blocked=false;enabled=true;started=true}else{enabled=!enabled;if(enabled)started=true}save();reconcile()},
    setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));save();reconcile()}
  };
})();
