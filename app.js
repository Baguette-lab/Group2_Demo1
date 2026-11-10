'use strict';
(() => {
 const C=window.HOME_CATALOG,P=window.PRESENTATION,tracks=C.tracks,main=document.querySelector('#main'),audio=document.querySelector('#audio');
 const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=s=>{s=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
 const stamp=s=>{s=Math.max(0,Number(s)||0);return `${Math.floor(s/60)}:${(s%60).toFixed(2).padStart(5,'0')}`};
 const num=i=>String(i+1).padStart(2,'0'),total=tracks.reduce((s,t)=>s+t.duration,0);
 let route='intro',selected=0,scene=0,line=0,storyRunning=false,storyPhase='dialogue',sceneCut=0,cutFinished=false,storyTimer,storyNext=0,storyRemaining=8500,storyFinished=false;
 let sourceId='',sourceKey='',playingCut=false,mode='song',stopAt=null,passageStart=0,clipSegments=[],segmentIndex=0,playToken=0,query='',dataView='change',conceptIndex=0,year=2020,houseChoice='independent',toastTimer,boundaryTimer;
 // Corrected cuts have their own audio files; old browser timing trims do not apply.
 let volume=.7;audio.volume=volume;
 const cutDuration=q=>q?.clipDuration??(q?(q.segments?q.segments.reduce((n,s)=>n+s[1]-s[0],0):q.end-q.start):0);
 const track=()=>tracks[selected],cue=t=>P.cues[t.id],offset=()=>0;
 function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
 const button=(text,action,cls='button',extra='')=>`<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
 const next=(n,title,dest)=>`<a class="next-chapter" href="#${dest}"><span><small>NEXT CHAPTER / ${n}</small><strong>${title}</strong></span><span aria-hidden="true">↗</span></a>`;
 const canvas=(mode='outside',index=0,cls='')=>`<canvas data-world="${mode}" data-scene="${index}" class="scene-canvas ${cls}" role="img" aria-label="${mode==='outside'?'A 2D illustration of Mika and Eli in their small Metro Manila rental':'Illustrated scene '+(index+1)+': '+esc(P.scenes[index].title)}"></canvas>`;
 const dialogueDelay=()=>Math.min(14000,Math.max(6500,1800+P.scenes[scene].dialogue[line].text.split(/\s+/).length*230));
 const link=(s)=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`;
 function intro(){
 return `<section class="intro page"><div class="intro-top"><span class="eyebrow"><i></i> DEMO 1 · A DEMOGRAPHIC MIXTAPE</span><span class="small-note">PRESENTED ${esc(C.presentationDate)}</span></div><div class="hero"><div class="hero-copy"><span class="chapter-kicker">01 / OUR TOPIC</span><h1>Sa Iisang<br><em>Bubong.</em><span class="title-flower" aria-hidden="true">✳</span></h1><p class="hero-sub">A shared roof.<br>A changing life.</p><p class="hero-description">Coming together, living together, and finding the freedom to begin again. Why two people choose one address, what everyday partnership asks of them, and why their futures eventually part.</p><a href="#story" class="button dark">Step into our story <span aria-hidden="true">↗</span></a><div class="hero-byline">A playlist by ${C.contributors.map(esc).join(', ')}</div></div><div class="hero-art"><div class="art-overline"><span>A SMALL RENTAL. A BIG DECISION.</span><span>☀ 01</span></div><div class="pixel-frame">${canvas()}</div><div class="art-caption"><span class="pixel-tag">ONE SHARED HOME</span><span>More than four walls.<br>More than one possible future.</span><span class="little-cross" aria-hidden="true">✦</span></div></div></div><div class="intro-bottom"><span>OUR QUESTION</span><p>When a relationship changes,<br>what happens to the life built around it?</p><a href="#why">Why we chose this ↓</a></div><section id="why" class="why-section"><div class="section-heading"><span class="chapter-kicker">THE PEOPLE BEHIND THE NUMBERS</span><h2>Why this topic<br><em>stays with us.</em></h2></div><div class="why-reasons"><article><span>01</span><div><h3>Because living together shapes everyday life.</h3><p>Partnerships organize a home, shared routines, care, and plans for the future. Their beginnings and endings belong in demography because they change who lives with whom.</p></div></article><article><span>02</span><div><h3>Because an ending has a human side.</h3><p>Music gives us a way to discuss hope, conflict, grief, and rebuilding. We use the songs as interpretations of experience, then turn to population data to understand patterns.</p></div></article><article><span>03</span><div><h3>Because people deserve meaningful choices.</h3><p>Our group supports divorce as an option for couples whose marriages can no longer be sustained. Our discussion centers dignity, support, and responsibilities after separation; this is our position, rather than a conclusion proved by a song.</p></div></article></div></section><div class="journey-strip"><span class="pixel-spark">✦</span><p><b>How we’ll tell it</b><span>Meet the topic → Follow the story and its song cuts → Explore the full playlist → Close with the population data</span></p><span class="pixel-spark">✦</span></div>${next('02','One key. Two possible futures.','story')}</section>`;
 }
 function sceneTracks(index=scene){
   const assigned=new Set(P.scenes.flatMap(s=>s.tracks||[s.song]));
   return tracks.filter(t=>(P.scenes[index].tracks||[P.scenes[index].song]).includes(t.id)||
     (!assigned.has(t.id)&&Math.max(0,Math.min(P.scenes.length-1,Number(t.storyScene??((t.roomState||6)-1))))===index));
 }
 function sceneCuts(index=scene){return sceneTracks(index).filter(t=>t.lyrics&&cue(t)?.lines?.length)}
 function storyTrack(){return sceneCuts()[sceneCut]||sceneCuts()[0]}
 function isCutMode(){return mode==='story-cut'}
 function storyPrimaryLabel(){
   if(storyFinished)return '↻ Replay story';
   if(storyPhase==='dialogue')return storyRunning?'Ⅱ Pause story':(scene||line?'▶ Continue story':'▶ Start story');
   if(cutFinished)return sceneCut<sceneCuts().length-1?'Next song cut →':scene<P.scenes.length-1?'Next story chapter →':'Finish our story →';
   if(!audio.paused&&mode==='story-cut'&&sourceId===storyTrack()?.id)return 'Ⅱ Pause cut';
   return sourceId===storyTrack()?.id&&mode==='story-cut'&&audio.currentTime>passageStart?'▶ Resume cut':'▶ Play this cut';
 }
 function storyMusicControls(){
   const m=StoryMusic.state();
   return `<div class="story-audio-controls" aria-label="Story background music"><button class="music-toggle" data-action="story-music" aria-label="Toggle story background music" aria-pressed="${m.enabled}">${m.blocked?'▶ Start music':m.enabled?'♪ Music on':'♪ Music off'}</button><label class="music-volume"><span>Volume</span><input type="range" id="story-music-volume" aria-label="Story music volume" min="0" max="1" step=".01" value="${m.volume}"></label><span id="story-music-status" role="status">${m.status}</span></div>`;
 }
 function updateStoryMusicControls(){
   const m=StoryMusic.state(),button=$('[data-action="story-music"]'),status=$('#story-music-status');
   if(button){button.textContent=m.blocked?'▶ Start music':m.enabled?'♪ Music on':'♪ Music off';button.setAttribute('aria-pressed',String(m.enabled));button.dataset.playing=String(m.playing)}
   if(status&&status.textContent!==m.status)status.textContent=m.status;
 }
 function syncStoryMusic(){StoryMusic.sync({inStory:route==='story',allow:storyPhase==='dialogue'||cutFinished})}
 function story(){
   const chapter=P.scenes[scene],cuts=sceneCuts(),t=storyTrack(),q=t&&cue(t);
   const inCut=storyPhase==='cut',d=inCut?{who:'Narrator',text:cutFinished?chapter.result:chapter.musicIntro}:chapter.dialogue[line];
   const shot=chapter.shots[inCut?chapter.shots.length-1:line];
   const unselected=sceneTracks().filter(t=>!t.lyrics||!cue(t));
   const allCuts=P.scenes.flatMap((s,i)=>sceneCuts(i));
   const completed=P.scenes.slice(0,scene).reduce((n,s,i)=>n+sceneCuts(i).length,0)+(inCut?sceneCut+(cutFinished?1:0):0);
   return `<section class="story-page page"><div class="page-heading"><div><span class="chapter-kicker">02 / MIKA & ELI · AN ILLUSTRATED CASE</span><h1>One key.<br><em>Two possible futures.</em></h1></div><p>They move in for love, shared costs, and time together. Over a year, living under one roof reveals what they can share—and what they cannot promise.</p></div>
   <div class="cast-strip">${P.characters.map(c=>`<article><canvas data-world="cast" data-who="${esc(c.name)}" role="img" aria-label="2D portrait of ${esc(c.name)}"></canvas><div><h2>${esc(c.name)}, ${c.age}</h2><span>${esc(c.work)}</span><p>${esc(c.description)}</p></div></article>`).join('')}</div>
   <div class="story-overview"><span>TOGETHER FOR THREE YEARS <i>·</i> MOVING IN UNMARRIED</span><span>${P.scenes.length} CHAPTERS <i>·</i> ${allCuts.length} SONG CUTS</span></div>
   <div class="scene-steps" aria-label="Story scenes">${P.scenes.map((s,i)=>`<button data-action="scene" data-index="${i}" class="${scene===i?'active':''}" aria-current="${scene===i?'step':'false'}"><b>${num(i)}</b><span>${esc(s.word)}</span><small>${esc(s.title)}</small></button>`).join('')}</div>
   <div class="story-flow" aria-label="Chapter sequence"><span class="${!inCut?'current':''}"><b>1</b> Follow the story</span><i>→</i><span class="${inCut&&!cutFinished?'current':''}"><b>2</b> Hear its song cuts</span><i>→</i><span class="${cutFinished?'current':''}"><b>3</b> Make the connection</span></div>
   <div class="story-layout"><div class="story-stage"><div class="story-game"><div class="game-top"><span><i class="status-dot"></i> ${esc(chapter.season.toUpperCase())}</span><span>CHAPTER ${num(scene)} / ${String(P.scenes.length).padStart(2,'0')}</span></div>
   <div class="scene-picture">${canvas('inside',chapter.visual)}</div><p class="scene-caption">${esc(shot)}</p>
   <div class="dialogue-box"><div class="portrait" aria-hidden="true"><canvas id="portrait" data-world="portrait" width="160" height="180"></canvas></div><div class="dialogue-copy"><span class="speaker">${esc(d.who)}</span><p id="dialogue-text" aria-live="polite">${esc(d.text)}</p></div><button class="dialogue-next" data-action="next-line" aria-label="${inCut?'Continue story':'Next dialogue'}">→</button><span class="dialogue-progress">${inCut?'♫ CUT '+(sceneCut+1)+' / '+cuts.length:(line+1)+' / '+chapter.dialogue.length}</span></div>
   <div class="dialogue-beats" aria-label="Read a moment in this chapter">${chapter.dialogue.map((d,i)=>button(String(i+1),'dialogue-beat','beat-dot '+(!inCut&&line===i?'current':''),`data-index="${i}" aria-label="Read moment ${i+1}: ${esc(chapter.shots[i])}" aria-current="${!inCut&&line===i?'step':'false'}"`)).join('')}<span>${inCut?'The music carries the moment':'Move through the conversation'}</span></div>
   <div class="game-controls">${button(storyPrimaryLabel(),'story-toggle','button dark small','id="story-primary"')}<div class="scene-controls">${button('←','previous-line','square','aria-label="Previous dialogue" '+(!inCut&&line===0?'disabled':''))}${button('→','next-scene','square','aria-label="Next scene" '+(scene===P.scenes.length-1?'disabled':''))}</div></div>
   ${storyMusicControls()}<div class="animation-controls">${button(StoryWorld.isPaused()?'▶ Resume movement':'Ⅱ Pause movement','motion-toggle','motion-control','aria-pressed="'+StoryWorld.isPaused()+'"')}${button('↻ Replay movement','replay-scene','motion-control','aria-label="Replay character animation"')}</div><div class="story-progress"><i style="width:${storyFinished?100:completed/Math.max(1,allCuts.length)*100}%"></i></div></div>
   <div class="chapter-meaning"><span class="eyebrow">${num(scene)} / ${esc(chapter.title.toUpperCase())}</span><p>${esc(chapter.narration)}</p><div class="scene-causal"><div><span>WHAT BRINGS THEM HERE</span><p>${esc(chapter.reason)}</p></div><div><span>WHAT THEY CHOOSE</span><p>${esc(chapter.result)}</p></div></div><div class="concept-note"><span>DEMOGRAPHIC LENS</span><p>${esc(chapter.concept)}</p></div></div>
   <details class="chapter-script"><summary>Read the whole conversation <span>+</span></summary>${chapter.dialogue.map(d=>`<p><b>${esc(d.who)}</b>${esc(d.text)}</p>`).join('')}</details></div>
   <aside class="story-cut-column" aria-label="This chapter’s song cuts"><div class="cut-rail-label"><span class="eyebrow">THE MUSIC IN THIS MOMENT</span><span>${cuts.length} ${cuts.length===1?'CUT':'CUTS'}</span></div>
   <div class="story-cut-tabs" aria-label="Choose a song cut">${cuts.map((c,i)=>button(`<span>${String(i+1).padStart(2,'0')}</span>${esc(c.title)}`,'story-select-cut','story-cut-tab '+(sceneCut===i?'active':''),`data-index="${i}" aria-pressed="${sceneCut===i}"`)).join('')}</div>
   ${t?`<section class="story-cut-card ${cutFinished?'complete':''}"><div class="panel-label"><span id="cut-state">${cutFinished?'PASSAGE COMPLETE':inCut?'READY TO LISTEN':'AFTER THE STORY'}</span><span>${stamp(q.start)} — ${stamp(q.end)}</span></div><h2>${esc(t.title)}</h2><p class="cut-artist">${esc(t.artist)} <span>·</span> ${t.year}</p>
   <div class="passage-lines story-lyric-lines" aria-label="Selected lyrics">${t.lyrics.split('\n').map((l,i)=>`<button data-action="story-lyric" data-index="${i}" class="lyric-line" aria-label="Play line ${i+1}: ${esc(l)}"><span class="line-number">${String(i+1).padStart(2,'0')}</span><span>${esc(l)}</span></button>`).join('')}</div>
   <div class="cut-playback"><button data-action="story-cut-play" class="button dark" id="story-cut-play">${cutFinished?'↻ Replay this cut':'▶ Play this cut'}</button><span><output id="story-cut-elapsed">0:00</output> / ${fmt(cutDuration(q))}</span></div><progress class="story-cut-progress" id="story-cut-progress" value="0" max="${cutDuration(q)}" aria-label="Selected passage progress"></progress>
   <p class="cue-caption">${q.segments?'Three selected moments, joined into one cut':'A prepared cut from our recording'} · tap a line to start there</p>
   <details class="cut-analysis" ${cutFinished?'open':''}><summary>Why these lines? <span>+</span></summary><h3>${esc(t.issue)}</h3><p>${esc(t.interpretation)}</p></details>
   <a href="#songs" data-select="${esc(t.id)}" class="text-link">Open the full song in our playlist ↗</a></section>`:'<div class="cut-waiting"><p>This chapter has no selected passage yet.</p><a href="#songs" class="text-link">Hear the recordings in our playlist ↗</a></div>'}
   ${unselected.length?`<details class="chapter-more"><summary>Also in this chapter <span>+</span></summary>${unselected.map(t=>`<a href="#songs" data-select="${esc(t.id)}"><strong>${esc(t.title)}</strong><small>${esc(t.artist)} · full recording ↗</small></a>`).join('')}<p>A lyric passage has not been chosen for these songs yet.</p></details>`:''}
   <p class="case-note">Mika and Eli are fictional adults. Their choices illustrate one possible path; the population evidence and research are in our closing chapter.</p></aside></div>
   ${storyFinished?`<div class="story-end"><span>✿</span><p>They moved in to build a life together.<br><b>They left after recognizing different futures.</b></p><a class="button dark" href="#demography">Connect their story to the data ↗</a></div>`:''}
   <div class="story-exit"><a href="#songs" class="text-link">Explore the complete playlist ↗</a><a href="#demography" class="text-link">Continue to our closing data & reflection ↗</a></div></section>`;
 }
 function fullSongLabel(t=track()){
   if(sourceKey!=='full:'+t.id)return '▶ Play full song';
   return audio.paused?(audio.currentTime>0&&!audio.ended?'▶ Resume full song':'▶ Play full song'):'Ⅱ Pause full song';
 }
 function songRows(){
   const q=query.toLowerCase();
   const rows=tracks.map((t,i)=>({t,i})).filter(({t})=>(t.title+' '+t.artist+' '+t.tagalog+' '+t.addedBy).toLowerCase().includes(q));
   return rows.map(({t,i})=>`<button class="track-row ${selected===i?'active':''}" data-action="choose-song" data-index="${i}" aria-pressed="${selected===i}" aria-label="Play full song: ${esc(t.title)} — ${esc(t.artist)}"><span class="track-number">${num(i)}</span><span><strong>${esc(t.title)}</strong><small>${esc(t.artist)}</small></span><span class="track-glyph" aria-hidden="true">${sourceKey==='full:'+t.id&&!audio.paused?'Ⅱ':'▶'}</span></button>`).join('')||'<p class="empty-search">No matching songs. Try another title or artist.</p>';
 }
 function selectedSong(){
   const t=track(),q=cue(t),current=sourceKey==='full:'+t.id,at=current?audio.currentTime:0;
   return `<div class="song-detail"><div class="song-detail-top"><span class="chapter-kicker">TRACK ${num(selected)} / ${String(tracks.length).padStart(2,'0')} · ${esc(t.tagalog.toUpperCase())}</span><span class="track-credit">CHOSEN BY ${esc(t.addedBy.toUpperCase())}</span></div>
   <div class="song-title-block"><span class="track-symbol" style="--song-color:${t.color}" aria-hidden="true">${['⌂','✿','✦','╱','☾','↗'][t.objectIndex%6]}</span><div><h2>${esc(t.title)}</h2><p>${esc(t.artist)} <span>·</span> ${t.year} <span>·</span> ${fmt(t.duration)}</p></div></div>
   <div class="song-main"><section class="full-record-panel" aria-label="Full recording" style="--song-color:${t.color}">
   <div class="panel-label"><span>THE COMPLETE RECORDING</span><span>${fmt(t.duration)} · FULL SONG</span></div>
   <div class="full-record-art" aria-hidden="true"><span>BUBONG RECORDS / ${num(selected)}</span><svg viewBox="0 0 120 120"><path d="M40 8h40v8h16v8h8v16h8v40h-8v16h-8v8H80v8H40v-8H24v-8H16V80H8V40h8V24h8V16h16Z" fill="#514563"/><path d="M40 24h40v8h8v8h8v40h-8v8h-8v8H40v-8h-8v-8h-8V40h8v-8h8Z" fill="none" stroke="#a99cb7" stroke-width="2"/><path d="M48 40h24v8h8v24h-8v8H48v-8h-8V48h8Z" fill="var(--song-color)"/><path d="M56 56h8v8h-8Z" fill="#fcf8ec"/></svg><small>ONE SHARED STORY · THE FULL TAKE</small></div>
   <div class="full-record-times"><output id="full-elapsed">${fmt(at)}</output><span id="full-duration">${fmt(current&&audio.duration?audio.duration:t.duration)}</span></div><progress id="full-progress" value="${at}" max="${current&&audio.duration?audio.duration:t.duration}" aria-label="Full recording progress"></progress>
   <button class="button dark full-record-play" data-action="toggle-full" id="full-song-play">${fullSongLabel(t)}</button>
   <div class="full-record-secondary">${button('↺ Start from the beginning','play-full','text-link')}<span>Next song plays automatically.</span></div>
   </section><section class="meaning-panel"><span class="eyebrow">WHY THIS SONG BELONGS</span><h3>${esc(t.issue)}</h3><p>${esc(t.interpretation)}</p><div class="song-concept"><span>THE DEMOGRAPHIC CONNECTION</span><strong>${esc(t.concept)}</strong></div><details class="reflection-question"><summary>${esc(t.question)}<span>+</span></summary><p>${esc(t.answer)}</p></details>${t.groupNote?`<details class="group-note"><summary>From our group’s original notes <span>+</span></summary><p>${esc(t.groupNote)}</p></details>`:''}
   ${q?`<div class="story-cut-link"><span>THE SPLICED VERSION & SELECTED LYRICS</span><p>Follow this song’s chosen moment in Mika and Eli’s story.</p><a href="#story" data-story-cut="${esc(t.id)}" class="text-link">Go to the story’s lyric cut ↗</a></div>`:''}</section></div>
   <div class="song-bridge"><span>THE STORY CONTINUES →</span><p>${esc(t.bridge)}</p>${selected<tracks.length-1?button('Play next song ↗','next-selection','text-link'):'<a class="text-link" href="#demography">See the bigger picture ↗</a>'}</div><div class="song-source"><a href="${esc(t.link)}" target="_blank" rel="noopener">Recording & release reference ↗</a><span>${esc(t.citation)}</span></div></div>`;
 }
 function songs(){return `<section class="songs-page page"><div class="page-heading"><div><span class="chapter-kicker">03 / OUR FULL PLAYLIST</span><h1>Our songs.<br><em>From start to finish.</em></h1></div><p>The complete recordings, in our chosen order. Tap any song to listen in full. Spliced audio and selected lyrics have their own place in Story & song cuts.</p></div><div class="song-collection-label"><span><b>${tracks.length}</b> COMPLETE SONGS</span><span>${fmt(total)} OF FULL RECORDINGS</span>${button('▶ Play all','play-playlist','button dark small')}</div><div class="songs-layout"><aside class="track-rail"><label class="song-search"><span aria-hidden="true">⌕</span><input id="song-search" type="search" placeholder="Find a song or artist…" aria-label="Find a song or artist" value="${esc(query)}"></label><div class="track-list" id="track-list">${songRows()}</div><span class="rail-bottom">FULL SONGS · IN OUR STORY ORDER</span></aside><div id="selected-song">${selectedSong()}</div></div><details class="guide-note"><summary>A note on our presentation guide <span>+</span></summary><p>The guide recommends 6–8 songs and about 20–30 minutes. Our growing collection currently has ${tracks.length} songs and ${fmt(total)} of full recordings. The separate Story & song cuts chapter uses the chosen passages for the presentation; a full-song submission would exceed the recommended count and runtime. Each song’s demographic interpretation stays within 100 words.</p></details>${next('04','What changes beyond the home?','demography')}</section>`}
 function chart(){
 if(dataView==='who')return `<div class="chart-intro"><span class="eyebrow">2020 CENSUS · SAME CATEGORY, DIFFERENT DENOMINATORS</span><h3>Which groups are represented?</h3><p>Within each sex, 2.3% of women and 1.5% of men were recorded as divorced/separated/annulled.</p></div><div class="comparison-chart" role="img" aria-label="2020: divorced, separated or annulled, women 2.3 percent, men 1.5 percent. Axis 0 to 3 percent."><div class="axis-labels"><span>0%</span><span>1%</span><span>2%</span><span>3%</span></div>${[{l:'Women',v:2.3,c:'coral'},{l:'Men',v:1.5,c:'sage'}].map(d=>`<div class="comparison-row"><span>${d.l}</span><div class="comparison-track"><i class="${d.c}" style="width:${d.v/3*100}%"></i></div><b>${d.v}%</b></div>`).join('')}</div><div class="chart-reading"><strong>60.1%</strong><p>of everyone in the combined category were women. That is a composition figure; it does not mean 60.1% of all women were separated.</p></div><p class="data-limit">These figures identify representation, not which group experienced the most harm. The table cannot explain causes.</p>`;
 if(dataView==='snapshot'){const vals=year===2020?[39.7,39.2,14.7,4.5,1.9]:[43.8,41,9.2,4.5,1.5];const cats=['Never married','Married','Common-law / live-in','Widowed','Divorced / separated / annulled'];return `<div class="chart-intro"><span class="eyebrow">HOUSEHOLD POPULATION AGED 10+ · ${year}</span><h3>Different ways of living.</h3><p>A census records people’s reported marital status at one point in time.</p></div><div class="year-switch" aria-label="Census year">${[2015,2020].map(y=>button(String(y),'year','pill '+(year===y?'active':''),`data-year="${y}" aria-pressed="${year===y}"`)).join('')}</div><div class="snapshot-scale"><span>0%</span><span>50%</span><span>100%</span></div><div class="snapshot-bars">${cats.map((c,i)=>`<div><span><b>${c}</b><strong>${vals[i].toFixed(1)}%</strong></span><div><i class="snapshot-${i}" style="width:${vals[i]}%"></i></div></div>`).join('')}</div><p class="data-limit">Percent of people, rather than couples. Bars use a 0–100% scale. Published values are rounded. Source: PSA, Table 2.</p>`}
 return `<div class="chart-intro"><span class="eyebrow">2015 → 2020 · CENSUS COMPARISON</span><h3>Shared lives are changing.</h3><p>Two recorded marital-status shares increased between census snapshots.</p></div><div class="chart-legend"><span><i class="sage"></i>2015</span><span><i class="coral"></i>2020</span></div><div class="grouped-chart" role="img" aria-label="Common-law or live-in: 9.2 percent in 2015, 14.7 in 2020. Divorced, separated or annulled: 1.5 percent in 2015, 1.9 in 2020. All bars start at zero on a 0 to 20 percent scale."><div class="chart-y"><span>20%</span><span>15%</span><span>10%</span><span>5%</span><span>0%</span></div><div class="plot"><div class="gridlines"><i></i><i></i><i></i><i></i><i></i></div>${[{label:'Common-law / live-in',a:9.2,b:14.7},{label:'Divorced / separated / annulled',a:1.5,b:1.9}].map(d=>`<div class="bar-group"><div class="bar-pair"><div class="bar sage" style="height:${d.a/20*100}%"><b>${d.a}%</b></div><div class="bar coral" style="height:${d.b/20*100}%"><b>${d.b}%</b></div></div><span>${d.label}</span></div>`).join('')}</div></div><div class="chart-reading"><strong>+0.4<span>pp</span></strong><p>Increase in the combined divorced/separated/annulled share. A stock comparison cannot reveal an annual divorce rate or a single cause.</p></div>`;
 }
 function concept(){const c=window.HOME_CONCEPTS[conceptIndex];return `<span class="eyebrow">${esc(c.word.toUpperCase())} / CONCEPT ${num(conceptIndex)}</span><h3>${esc(c.title)}</h3><p class="concept-definition">${esc(c.definition)}</p><div class="concept-columns"><div><span class="mini-label">WHAT IT HELPS US ASK</span><p>${esc(c.mechanism)}</p></div><div><span class="mini-label">HEAR IT IN THE PLAYLIST</span><p>${esc(c.application)}</p><div class="song-links">${c.tracks.map(id=>{const t=tracks.find(t=>t.id===id);return t?`<a href="#songs" data-select="${id}">${esc(t.title)} ↗</a>`:''}).join('')}</div></div></div><details class="concept-prompt"><summary>${esc(c.prompt)}<span>+</span></summary><p>${esc(c.response)}</p></details><p class="concept-limit"><b>Read carefully.</b> ${esc(c.limit)}</p><div class="concept-sources">${c.sources.map(id=>C.sources.find(s=>s.id===id)).filter(Boolean).map(link).join(' · ')}</div>`}
 function houseDiagram(){const join=houseChoice==='family';const home=(x,y,people,label,col)=>`<g transform="translate(${x} ${y})"><path d="M0 24 38 0 76 24v50H0Z" fill="${col}" stroke="#554d3f" stroke-width="2"/><path d="M-4 25 38-6 80 25" fill="none" stroke="#8a6251" stroke-width="6"/>${Array.from({length:people},(_,i)=>`<g transform="translate(${16+i*14} 43)"><circle r="4" fill="#8f654d"/><path d="M-4 7h8v14h-8Z" fill="${i%2?'#6d8b81':'#bf795e'}"/></g>`).join('')}<text x="38" y="96" text-anchor="middle">${label}</text></g>`;return `<svg viewBox="0 0 650 266" class="house-diagram" role="img" aria-label="Illustrative scenario. Before separation, six people live in three households. After separation, the same six people live in ${join?'two':'four'} households."><text x="20" y="22" class="diagram-label">BEFORE · 3 HOUSEHOLDS</text>${home(31,51,2,'Partners','#e3cda6')}${home(137,51,2,'Relatives A','#d8ddc0')}${home(243,51,2,'Relatives B','#d8ddc0')}<text x="365" y="107" class="diagram-arrow">→</text><text x="422" y="22" class="diagram-label">AFTER · ${join?'2':'4'} HOUSEHOLDS</text>${join?home(425,51,3,'Relatives A','#d8ddc0')+home(541,51,3,'Relatives B','#d8ddc0'):home(425,45,1,'Mika','#e3cda6')+home(541,45,1,'Eli','#e3cda6')+home(425,162,2,'Relatives A','#d8ddc0')+home(541,162,2,'Relatives B','#d8ddc0')}<text x="30" y="233" class="people-label">6 people before. 6 people after.</text></svg>`}
 function references(){const sources=[...C.sources,...P.dataSources];const unique=[...new Map(sources.map(s=>[s.id,s])).values()].sort((a,b)=>a.apa.localeCompare(b.apa));return `<details class="references"><summary>References & presentation notes <span>+</span></summary><div class="reference-list"><h3>Population, concepts & legal context</h3>${unique.map(s=>`<p>${esc(s.apa)} <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a></p>`).join('')}<h3>Our recordings</h3>${[...tracks].sort((a,b)=>a.citation.localeCompare(b.citation)).map(t=>`<p>${esc(t.citation)} <a href="${esc(t.link)}" target="_blank" rel="noopener">Recording source ↗</a></p>`).join('')}<h3>About the presentation</h3><p>Per-song interpretations are under 100 words. Our ${tracks.length}-song collection runs ${fmt(total)} in full; the guide’s target is 6–8 songs and approximately 20–30 minutes. Lyrics shown are the group’s selected passages. ${tracks.filter(t=>!t.lyrics).length} songs currently have no selected passage. Mika and Eli’s illustrated story is fictional. Their cohabitation ends without a marriage having taken place; the story is not a case of legal divorce.</p><p>Census data years are 2015 and 2020; figures are not presented as 2026 estimates. The group’s support for divorce as an option is a policy position. Song readings and hypothetical household scenarios are separate from population evidence.</p><p>Each selected passage is prepared from the group’s actual recording. The cut and its line timings are packaged with the website, including the separate moments in 2 MINUS 1. Only the group-supplied lines are included; playback needs no live lyrics service.</p></div></details>`}
 function laws(){const l=window.HOME_LEGAL;if(!l)return '';return `<details class="legal-appendix"><summary>Legal context: separation, divorce & rights <span>+</span></summary><p>${esc(l.note)}</p><p class="mini-label">DATED SOURCE NOTES · ${esc(l.checked)}</p>${l.scopes.map(s=>`<section><h3>${esc(s.label)}</h3><p>${esc(s.intro)}</p>${s.cards.map(c=>`<details><summary>${esc(c.title)} <small>${esc(c.status)}</small></summary><div><p><b>${esc(c.result)}</b></p><p>${esc(c.detail)}</p><p>${esc(c.lens)}</p><div class="legal-sources">${c.sources.map(id=>C.sources.find(x=>x.id===id)).filter(Boolean).map(link).join(' · ')}</div></div></details>`).join('')}</section>`).join('')}</details>`}
 function storyContext(){return `<section class="story-context"><div><span class="eyebrow">PUTTING THEIR CHOICES IN CONTEXT</span><h2>One couple’s reasons.<br><em>Many possible paths.</em></h2><p>Kuang’s (2025) analysis of 2016 focus groups in Quezon City and Bataan found participants discussed wedding costs, personal commitment, and testing a relationship when explaining cohabitation. These were qualitative accounts from 54 adults, rather than national prevalence estimates.</p><p>Mika and Eli’s commutes, division of chores, and job offer are fictional details. They help us explore how practical pressures and personal goals can interact; they are not findings about a whole generation.</p><a class="text-link" href="https://doi.org/10.1186/s41118-025-00263-2" target="_blank" rel="noopener">Read Kuang’s study ↗</a></div><aside><span class="eyebrow">2021 YAFS · FILIPINOS AGED 15–24</span><h3>Young people follow different paths.</h3><div class="youth-profile"><p><strong>85%</strong><span>had not entered a marital union</span></p><p><strong>12%</strong><span>were cohabiting</span></p><p><strong>3%</strong><span>were formally married</span></p></div><p class="data-limit">Shares of all youth in this age group in the 2021 study. These describe union status, not breakup rates or reasons for leaving.</p><a class="text-link" href="https://www.uppi.upd.edu.ph/sites/default/files/pdf/YAFS5_Key_Findings.pdf" target="_blank" rel="noopener">UPPI & DRDF key findings ↗</a></aside></section>`}
 function demography(){return `<section class="data-page page"><div class="page-heading"><div><span class="chapter-kicker">04 / THE CLOSING CHAPTER</span><h1>Two lives.<br><em>A bigger picture.</em></h1></div><p>After the story and its song cuts, we turn to the evidence: population patterns, demographic concepts, our reflection, and references.</p></div>${storyContext()}<div class="data-claim"><span class="pixel-spark">⌂</span><h2>Why is this a<br><em>population issue?</em></h2><p>People form and leave unions. Their living arrangements, household membership, and care networks can change with them. The issue is how lives are organized across a population, even when the number of people stays the same.</p></div><section class="data-lab"><div class="lab-heading"><span class="eyebrow">01 / THE EVIDENCE</span><p>Philippines · PSA census · Household population aged 10 and over</p></div><div class="chart-tabs" role="tablist" aria-label="Population data views">${[['change','What changed?'],['who','Who is represented?'],['snapshot','The full snapshot']].map(([id,label])=>button(label,'data-view','chart-tab '+(dataView===id?'active':''),`data-view="${id}" role="tab" aria-selected="${dataView===id}" aria-controls="data-chart"`)).join('')}</div><div class="chart-layout"><div id="data-chart" role="tabpanel">${chart()}</div><aside class="data-margin"><span class="source-stamp">PSA<br><b>CENSUS</b></span><h3>The denominator matters.</h3><p>These are people’s reported statuses. The combined category includes divorce, separation, and annulment; it cannot isolate divorce.</p><p>NCR recorded the highest regional combined share in 2020: <b>2.6%</b>. The national figure was <b>1.9%</b>.</p><a href="${esc(C.sources.find(s=>s.id==='psa').url)}" target="_blank" rel="noopener" class="text-link">Read the original PSA release ↗</a><details><summary>See the numbers as a table +</summary><table><caption>Shares (%) of household population aged 10+</caption><thead><tr><th>Category</th><th>2015</th><th>2020</th></tr></thead><tbody><tr><th>Common-law / live-in</th><td>9.2</td><td>14.7</td></tr><tr><th>Divorced / separated / annulled</th><td>1.5</td><td>1.9</td></tr></tbody></table></details></aside></div></section><section class="concept-lab"><div class="section-heading"><span class="eyebrow">02 / OUR DEMOGRAPHIC LENSES</span><h2>Give the story<br><em>a language.</em></h2></div><div class="concept-layout"><div class="concept-tabs" role="tablist" aria-orientation="vertical" aria-label="Demographic concepts">${window.HOME_CONCEPTS.map((c,i)=>button(`<b>${num(i)}</b><span>${esc(c.title)}</span>`,'concept','concept-tab '+(conceptIndex===i?'active':''),`data-index="${i}" role="tab" aria-selected="${conceptIndex===i}" aria-controls="concept-panel"`)).join('')}</div><article id="concept-panel" role="tabpanel">${concept()}</article></div></section><section class="household-lab"><div class="lab-heading"><div><span class="eyebrow">03 / TRY A LIVING-ARRANGEMENT SCENARIO</span><h2>Same people.<br><em>Different households.</em></h2></div><p>A hypothetical example, not a forecast or census estimate. Two partners and four relatives begin in three households.</p></div><div class="house-choices" aria-label="Hypothetical housing arrangement">${button('Each partner forms a separate home','house-choice','pill '+(houseChoice==='independent'?'active':''),'data-choice="independent" aria-pressed="'+(houseChoice==='independent')+'"')}${button('Both join their relatives’ homes','house-choice','pill '+(houseChoice==='family'?'active':''),'data-choice="family" aria-pressed="'+(houseChoice==='family')+'"')}</div><div id="house-diagram">${houseDiagram()}</div><p class="scenario-takeaway" id="scenario-takeaway">${houseChoice==='family'?'The former shared home is no longer occupied as a household. The partners join two existing homes: three households become two.':'The former partners now maintain two homes, while both relatives’ homes remain: three households become four.'} Population stays at six in both scenarios.</p></section><section class="closing-reflection"><span class="eyebrow">OUR OVERALL REFLECTION</span><h2>A shared roof can change.<br><em>Human dignity shouldn’t.</em></h2><p>Mika and Eli move in because affection, shared costs, and more time together make one home meaningful. Unequal care and unspoken expectations strain that arrangement. They try to repair it, then recognize different plans for location, marriage, and children. Their ending reorganizes housing, money, routines, and support networks; it does not erase the care they shared.</p><p>Because they are unmarried, their breakup is not a legal divorce. Our wider theme asks what options and support should be available when a married couple’s union becomes irretrievable. We support divorce as an option, alongside fair arrangements and care after separation. The story offers a human question; the research and census data help us discuss its wider context.</p><div class="closing-prompt"><span>TAKE THIS INTO OUR DISCUSSION</span><p>What would people need to begin again<br>with dignity, rather than simply leave?</p></div></section>${laws()}${references()}<a class="back-start" href="#intro">↑ Return to the beginning</a></section>`}
 function render(){main.innerHTML=({intro,story,songs,demography}[route]||intro)();document.body.dataset.page=route;document.querySelectorAll('[data-route]').forEach(a=>{a.classList.toggle('active',a.dataset.route===route);if(a.dataset.route===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});$('#footer-count').textContent=`${tracks.length} SONGS · ONE SHARED STORY`;StoryWorld.mount(main,route==='story'?{scene,beat:line,speaker:storyPhase==='cut'?'Narrator':P.scenes[scene].dialogue[line].who,phase:storyPhase}:{speaker:'Narrator'});if(route==='story')updateLyrics();updateAudioUI();syncStoryMusic();}
 function selectSong(i,rerender=true){selected=(i+tracks.length)%tracks.length;if(rerender&&route==='songs'){const top=window.scrollY;$('#selected-song').innerHTML=selectedSong();$('#track-list').innerHTML=songRows();updateAudioUI();window.scrollTo(0,top)}}
 function clearPlayback(){
   playToken++;audio.pause();clearTimeout(boundaryTimer);stopAt=null;clipSegments=[];segmentIndex=0;
   sourceId='';sourceKey='';playingCut=false;mode='song';passageStart=0;
   audio.removeAttribute('src');audio.load();$('#player').hidden=true;document.body.classList.remove('has-player');
 }
 function openStoryCut(id){
   const chapter=P.scenes.findIndex((s,i)=>sceneCuts(i).some(t=>t.id===id));if(chapter<0)return;
   stopStory();clearPlayback();scene=chapter;sceneCut=sceneCuts(chapter).findIndex(t=>t.id===id);
   line=P.scenes[scene].dialogue.length-1;storyPhase='cut';cutFinished=false;storyFinished=false;
   if(route==='story')render();else location.hash='story';
 }
 function showRoute(){
   if(location.hash==='#why'&&route==='intro'&&document.querySelector('#why'))return;
   const aliases={playlist:'songs',karaoke:'story',perspective:'demography'};let r=location.hash.slice(1).split('?')[0];r=aliases[r]||r;
   if(!['intro','story','songs','demography'].includes(r))r='intro';
   if(r!==route){playToken++;stopStory();audio.pause();stopAt=null;clearTimeout(boundaryTimer);if(mode==='story-cut'||r==='story')clearPlayback()}
   route=r;render();window.scrollTo(0,0);
 }
 function toggleFullSong(){
   if(sourceKey!=='full:'+track().id||mode!=='song'||audio.ended){play(track().id,0,null,'song');return}
   if(audio.paused)audio.play().catch(()=>toast('Press Play full song again.'));else audio.pause();
 }
 function sourceToCut(q,time){
   let elapsed=0;
   for(const [start,end] of q.segments||[[q.start,q.end]]){
     if(time<start)return elapsed;
     if(time<=end)return elapsed+time-start;
     elapsed+=end-start;
   }
   return q.clipDuration??elapsed;
 }
 function seekReady(target){
   if(Math.abs(audio.currentTime-target)<.001&&!audio.seeking)return Promise.resolve();
   return new Promise((resolve,reject)=>{
     const done=()=>{cleanup();resolve()},bad=()=>{cleanup();reject(new Error('seek'))};
     const timer=setTimeout(bad,10000);
     const cleanup=()=>{clearTimeout(timer);audio.removeEventListener('seeked',done);audio.removeEventListener('error',bad)};
     audio.addEventListener('seeked',done);audio.addEventListener('error',bad);audio.currentTime=target;
   });
 }
 async function play(id,start=0,end=null,kind='song'){
   const t=tracks.find(t=>t.id===id);if(!t)return;
   const token=++playToken,q=cue(t),prepared=kind==='story-cut'&&!!q?.clipFile;
   audio.pause();clearTimeout(boundaryTimer);
   mode=kind;playingCut=prepared;stopAt=prepared?q.clipDuration:end;
   passageStart=prepared?sourceToCut(q,start):start;
   clipSegments=!prepared&&kind==='story-cut'&&q?.segments?q.segments.map(s=>[...s]):[];
   segmentIndex=Math.max(0,clipSegments.findIndex(s=>start<s[1]));audio.volume=volume;
   const key=(prepared?'cut:':'full:')+id;
   if(sourceKey!==key){
     sourceId=id;sourceKey=key;
     audio.src=prepared?'cuts/'+encodeURIComponent(q.clipFile)+'?v='+encodeURIComponent(P.cueVersion||'2'):'mp3/'+encodeURIComponent(t.file);
     audio.load();
   }
   try{
     if(audio.readyState<1)await new Promise((resolve,reject)=>{
       const done=()=>{cleanup();resolve()},bad=()=>{cleanup();reject(new Error('recording'))},timer=setTimeout(bad,15000);
       const cleanup=()=>{clearTimeout(timer);audio.removeEventListener('loadedmetadata',done);audio.removeEventListener('error',bad)};
       audio.addEventListener('loadedmetadata',done);audio.addEventListener('error',bad);
     });
     if(token!==playToken)return;
     if(prepared)stopAt=audio.duration;
     await seekReady(Math.max(0,Math.min(passageStart,audio.duration||t.duration)));
     if(token!==playToken)return;
     await audio.play();
     if(token!==playToken){audio.pause();return}
     $('#player').hidden=false;document.body.classList.add('has-player');updateAudioUI();
   }catch{
     if(token===playToken){toast('The recording could not start. Try Play again.');if(kind==='story-cut'){stopStory();updateAudioUI()}}
   }
 }
 function updateAudioUI(){
   const t=tracks.find(t=>t.id===sourceId);
   if(t){
     $('#player-title').textContent=t.title;$('#player-artist').textContent=t.artist;
     $('#player-context').textContent=mode==='story-cut'?'STORY · SPLICED LYRIC CUT':'FULL PLAYLIST · COMPLETE SONG';
     $('#global-play').textContent=audio.paused?'▶':'Ⅱ';$('#global-play').setAttribute('aria-label',audio.paused?'Play':'Pause');
     $('#time-now').textContent=fmt(audio.currentTime);$('#time-total').textContent=fmt(audio.duration||t.duration);
     $('#audio-seek').value=audio.duration?audio.currentTime/audio.duration*1000:0;$('#audio-seek').setAttribute('aria-label',playingCut?'Seek in selected cut':'Seek in recording');
     $('#mute-button').setAttribute('aria-pressed',audio.muted);$('#mute-button').setAttribute('aria-label',audio.muted?'Unmute':'Mute');$('#mute-button').textContent=audio.muted?'×♪':'♪';
   }
   if(route==='songs'){
     const current=sourceKey==='full:'+track().id,progress=$('#full-progress'),control=$('#full-song-play');
     if(control)control.textContent=fullSongLabel();
     if(progress){progress.max=current&&audio.duration?audio.duration:track().duration;progress.value=current?audio.currentTime:0}
     const elapsed=$('#full-elapsed');if(elapsed)elapsed.textContent=fmt(current?audio.currentTime:0);
     const duration=$('#full-duration');if(duration)duration.textContent=fmt(current&&audio.duration?audio.duration:track().duration);
     document.querySelectorAll('.track-row').forEach(row=>{const t=tracks[+row.dataset.index],glyph=row.querySelector('.track-glyph');const active=sourceKey==='full:'+t.id&&!audio.paused;if(glyph)glyph.textContent=active?'Ⅱ':'▶';row.setAttribute('aria-label',(active?'Pause full song: ':'Play full song: ')+t.title+' — '+t.artist)});
   }
   if(route==='story'){
     const primary=$('#story-primary');if(primary)primary.textContent=storyPrimaryLabel();
     const st=storyTrack(),playing=st&&sourceId===st.id&&mode==='story-cut'&&!audio.paused;
     const control=$('#story-cut-play');if(control)control.textContent=playing?'Ⅱ Pause cut':cutFinished?'↻ Replay this cut':'▶ Play this cut';
     const label=$('#cut-state');if(label)label.textContent=cutFinished?'PASSAGE COMPLETE':playing?'NOW PLAYING THE SELECTED LINES':storyPhase==='dialogue'?'AFTER THE STORY':'READY TO LISTEN';
     if(st){
       const q=cue(st),at=sourceId===st.id?audio.currentTime-offset(st):q.start;
       const elapsed=sourceId===st.id&&playingCut?audio.currentTime:(q.segments||[[q.start,q.end]]).reduce((n,[a,b])=>n+Math.max(0,Math.min(at,b)-a),0);
       const meter=$('#story-cut-progress');if(meter)meter.value=elapsed;
       const output=$('#story-cut-elapsed');if(output)output.textContent=fmt(elapsed);
     }
   }
 }
 function updateLyrics(){
   if(route!=='story')return;
   const t=storyTrack(),q=t&&cue(t);if(!q)return;
   const at=audio.currentTime-offset(t),valid=sourceId===t.id&&mode==='story-cut';
   let active=-1;if(valid)(playingCut&&q.clipLines?q.clipLines:q.lines).forEach((l,i)=>{if(at>=l.time&&at<(l.end??q.end))active=i});
   document.querySelectorAll('.lyric-line').forEach((el,i)=>{el.classList.toggle('singing',active===i);el.setAttribute('aria-current',active===i?'true':'false')});
 }
 function stopStory(){
   if(storyRunning&&storyPhase==='dialogue')storyRemaining=Math.max(300,storyNext-performance.now());
   storyRunning=false;clearTimeout(storyTimer);
 }
 function scheduleStory(){
   clearTimeout(storyTimer);if(!storyRunning||storyPhase!=='dialogue')return;
   storyNext=performance.now()+storyRemaining;
   storyTimer=setTimeout(advanceDialogue,storyRemaining);
 }
 function setScene(index){
   playToken++;stopStory();audio.pause();stopAt=null;clearTimeout(boundaryTimer);
   scene=Math.max(0,Math.min(P.scenes.length-1,index));line=0;sceneCut=0;
   storyPhase='dialogue';cutFinished=false;storyRemaining=dialogueDelay();storyFinished=false;render();
 }
 function scrollStory(part){if(matchMedia('(max-width:900px)').matches)document.querySelector(part)?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}
 function jumpDialogue(index){playToken++;stopStory();audio.pause();stopAt=null;clearTimeout(boundaryTimer);line=Math.max(0,Math.min(P.scenes[scene].dialogue.length-1,index));storyPhase='dialogue';cutFinished=false;storyFinished=false;storyRemaining=dialogueDelay();render()}
 function revealCuts(){
   stopStory();audio.pause();storyPhase='cut';sceneCut=0;cutFinished=false;
   if(!sceneCuts().length){continueStory();return}render();scrollStory('.story-cut-column');
 }
 function advanceDialogue(){
   clearTimeout(storyTimer);
   if(storyFinished)return;
   if(storyPhase==='cut'){continueStory();return}
   if(line<P.scenes[scene].dialogue.length-1){line++;storyRemaining=dialogueDelay();render();if(storyRunning)scheduleStory()}
   else revealCuts();
 }
 function playStoryCut(index=sceneCut,lineIndex=null){
   StoryMusic.engage();stopStory();audio.pause();storyPhase='cut';sceneCut=Math.max(0,Math.min(sceneCuts().length-1,index));
   const t=storyTrack(),q=t&&cue(t);if(!q)return;
   cutFinished=false;storyFinished=false;storyRunning=true;render();scrollStory('.story-cut-column');
   const start=lineIndex===null?q.start:(q.lines[lineIndex]?.time??q.start);
   return play(t.id,start+offset(t),q.end+offset(t),'story-cut');
 }
 function continueStory(){
   playToken++;stopStory();audio.pause();clearTimeout(boundaryTimer);stopAt=null;
   if(storyPhase==='cut'&&sceneCut<sceneCuts().length-1){playStoryCut(sceneCut+1);return}
   if(scene<P.scenes.length-1){setScene(scene+1);storyRunning=true;render();scrollStory('.story-stage');scheduleStory()}
   else{storyFinished=true;cutFinished=true;render()}
 }
 function toggleStory(){
   if(storyFinished){StoryMusic.engage();setScene(0);storyRunning=true;render();scheduleStory();return}
   if(storyPhase==='dialogue'){
     if(storyRunning){stopStory();StoryMusic.pause()}else{storyRunning=true;StoryMusic.engage();scheduleStory()}
     updateAudioUI();syncStoryMusic();return;
   }
   if(cutFinished){continueStory();return}
   toggleStoryCut();
 }
 function toggleStoryCut(){
   const t=storyTrack();if(!t)return;
   if(!cutFinished&&sourceId===t.id&&mode==='story-cut'&&storyPhase==='cut'){
     if(!audio.paused){audio.pause();stopStory();updateAudioUI();return}
     if(audio.currentTime>=passageStart&&audio.currentTime<(stopAt??0)){
       storyRunning=true;audio.play().catch(()=>{stopStory();toast('Press Play this cut to resume.');updateAudioUI()});return;
     }
   }
   playStoryCut();
 }
 function navigateStoryCut(delta){
   const cuts=P.scenes.flatMap((s,i)=>sceneCuts(i).map((t,j)=>({scene:i,index:j,id:t.id})));
   const current=cuts.findIndex(c=>c.scene===scene&&c.index===sceneCut);
   const target=cuts[(current+delta+cuts.length)%cuts.length];if(!target)return;
   setScene(target.scene);playStoryCut(target.index);
 }
 // timeupdate is coarse. A media-clock timer also guards every cut boundary.
 function scheduleBoundary(){
   clearTimeout(boundaryTimer);
   if(audio.paused||playingCut||!isCutMode()||stopAt===null)return;
   const end=clipSegments.length?clipSegments[segmentIndex][1]:stopAt;
   boundaryTimer=setTimeout(checkCutBoundary,Math.max(5,(end-audio.currentTime)/Math.max(.1,audio.playbackRate||1)*1000));
 }
 function checkCutBoundary(){
   clearTimeout(boundaryTimer);
   if(audio.paused||playingCut||!isCutMode()||stopAt===null)return;
   const end=clipSegments.length?clipSegments[segmentIndex][1]:stopAt;
   if(audio.currentTime<end-.018){scheduleBoundary();return}
   if(clipSegments.length&&segmentIndex<clipSegments.length-1){
     segmentIndex++;audio.currentTime=clipSegments[segmentIndex][0];scheduleBoundary();return;
   }
   audio.pause();audio.currentTime=stopAt;
   if(mode==='story-cut'){cutFinished=true;stopStory();if(route==='story')render()}
   updateAudioUI();updateLyrics();
 }
 function dialog(title,html){playToken++;audio.pause();stopStory();$('#dialog-title').textContent=title;$('#dialog-content').innerHTML=html;$('#dialog').showModal();syncStoryMusic()}
 document.addEventListener('click',e=>{if(e.target.closest('.skip')){e.preventDefault();main.focus();main.scrollIntoView({block:'start'});return}const storyLink=e.target.closest('[data-story-cut]');if(storyLink){e.preventDefault();openStoryCut(storyLink.dataset.storyCut);return}const a=e.target.closest('[data-select]');if(a){const i=tracks.findIndex(t=>t.id===a.dataset.select);if(i>=0)selectSong(i,false);if(location.hash==='#songs'){audio.pause();render();window.scrollTo(0,0)}}const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const act=b.dataset.action;
 if(route==='story'&&['scene','previous-scene','next-scene','previous-line','dialogue-beat','next-line'].includes(act))StoryMusic.engage();
 switch(act){
 case 'present':document.body.classList.toggle('presenting');b.setAttribute('aria-pressed',document.body.classList.contains('presenting'));if(!document.body.classList.contains('presenting')&&document.fullscreenElement)document.exitFullscreen?.();else if(document.body.classList.contains('presenting'))document.documentElement.requestFullscreen?.().catch(()=>{});break;
 case 'motion-toggle':{const paused=StoryWorld.toggleMotion();b.textContent=paused?'▶ Resume movement':'Ⅱ Pause movement';b.setAttribute('aria-pressed',paused);break;}
 case 'replay-scene':StoryWorld.replay();{const toggle=$('[data-action="motion-toggle"]');if(toggle){toggle.textContent='Ⅱ Pause movement';toggle.setAttribute('aria-pressed','false')}}break;
 case 'scene':setScene(+b.dataset.index);break;case 'previous-scene':setScene(scene-1);break;case 'next-scene':setScene(scene+1);break;
 case 'previous-line':jumpDialogue(storyPhase==='cut'?P.scenes[scene].dialogue.length-1:line-1);break;
 case 'dialogue-beat':jumpDialogue(+b.dataset.index);break;
 case 'next-line':clearTimeout(storyTimer);advanceDialogue();break;
 case 'story-toggle':toggleStory();break;
 case 'story-music':StoryMusic.toggle();syncStoryMusic();break;
 case 'story-cut-play':toggleStoryCut();break;
 case 'story-select-cut':playToken++;stopStory();audio.pause();stopAt=null;clearTimeout(boundaryTimer);sceneCut=+b.dataset.index;storyPhase='cut';cutFinished=false;storyFinished=false;render();break;
 case 'story-lyric':playStoryCut(sceneCut,+b.dataset.index);break;
 case 'choose-song':selectSong(+b.dataset.index);toggleFullSong();$('[data-action="choose-song"][data-index="'+selected+'"]')?.focus({preventScroll:true});break;
 case 'next-selection':selectSong(selected+1);play(track().id,0,null,'song');break;
 case 'play-playlist':selectSong(0);play(track().id,0,null,'song');break;
 case 'toggle-full':toggleFullSong();break;
 case 'play-full':play(track().id,0,null,'song');break;
 case 'close-dialog':$('#dialog').close();break;
 case 'toggle-audio':
   if(mode==='story-cut'&&route==='story'){toggleStoryCut();break}
   if(audio.paused){if(!sourceId)play(track().id);else audio.play().catch(()=>toast('Press Play again.'))}
   else{audio.pause();stopStory()}break;
 case 'previous-track':case 'next-track':{
   if(route==='story'&&mode==='story-cut'){navigateStoryCut(act==='next-track'?1:-1);break}
   stopStory();const i=tracks.findIndex(t=>t.id===sourceId),n=(i+(act==='next-track'?1:-1)+tracks.length)%tracks.length;
   selectSong(n);if(route==='story')render();play(tracks[n].id,0,null,'song');break;
 }
 case 'mute':audio.muted=!audio.muted;updateAudioUI();break;
 case 'close-player':playToken++;stopStory();audio.pause();$('#player').hidden=true;document.body.classList.remove('has-player');if(route==='story')render();break;
 case 'player-track':if(mode==='story-cut'){openStoryCut(sourceId);break}selectSong(tracks.findIndex(t=>t.id===sourceId),false);location.hash='songs';if(route==='songs')render();break;
 case 'data-view':dataView=b.dataset.view;render();break;
 case 'year':year=+b.dataset.year;render();break;
 case 'concept':conceptIndex=+b.dataset.index;render();break;
 case 'house-choice':houseChoice=b.dataset.choice;render();break;
 }
 });
 document.addEventListener('input',e=>{
   if(e.target.id==='story-music-volume')StoryMusic.setVolume(e.target.value);
   if(e.target.id==='song-search'){query=e.target.value;$('#track-list').innerHTML=songRows()}
   if(e.target.id==='audio-seek'&&audio.duration){
     let at=+e.target.value/1000*audio.duration;
     if(mode==='story-cut'&&stopAt!==null){at=Math.max(0,Math.min(stopAt-.025,at));cutFinished=false}
     if(isCutMode()&&clipSegments.length){segmentIndex=clipSegments.findIndex(s=>at<s[1]);if(segmentIndex<0)segmentIndex=clipSegments.length-1;at=Math.max(at,clipSegments[segmentIndex][0])}
     audio.currentTime=at;updateLyrics();updateAudioUI();scheduleBoundary();
   }
   if(e.target.id==='audio-volume'){volume=+e.target.value;audio.volume=volume;audio.muted=false;updateAudioUI()}
 });
 audio.addEventListener('timeupdate',()=>{checkCutBoundary();updateAudioUI();if(route==='story')updateLyrics()});
 audio.addEventListener('play',()=>{updateAudioUI();scheduleBoundary()});
 audio.addEventListener('playing',scheduleBoundary);
 audio.addEventListener('seeked',()=>{scheduleBoundary();updateLyrics()});
 audio.addEventListener('ratechange',scheduleBoundary);
 audio.addEventListener('pause',()=>{clearTimeout(boundaryTimer);updateAudioUI()});
 audio.addEventListener('loadedmetadata',updateAudioUI);
 audio.addEventListener('ended',()=>{
   if(mode==='story-cut'){cutFinished=true;stopStory();if(route==='story')render();return}
   if(mode==='song'){
     const i=tracks.findIndex(t=>t.id===sourceId);
     if(i>=0&&i<tracks.length-1){selectSong(i+1);play(tracks[i+1].id,0,null,'song')}
     else{audio.pause();updateAudioUI();toast('You’ve reached the end of our playlist.')}
   }
 });
 $('#dialog').addEventListener('close',()=>{$('#dialog-content').innerHTML='';if(route==='story')render();syncStoryMusic()});
 document.addEventListener('storymusicchange',updateStoryMusicControls);
 document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,button,a,summary')||$('#dialog').open)return;if(e.key==='Escape'&&document.body.classList.contains('presenting')){$('.present-button').click();return}if(route==='story'&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();if(e.key==='ArrowRight')advanceDialogue();else if(storyPhase==='dialogue'&&line>0)jumpDialogue(line-1);else setScene(scene-1)}if(e.code==='Space'){e.preventDefault();if(route==='story')$('[data-action="story-toggle"]').click();else if(sourceId)$('#global-play').click()}});
 document.addEventListener('keydown',e=>{const tab=e.target.closest('[role="tab"]');if(!tab)return;const list=tab.closest('[role="tablist"]'),items=[...list.querySelectorAll('[role="tab"]')],i=items.indexOf(tab);let n;if(['ArrowDown','ArrowRight'].includes(e.key))n=(i+1)%items.length;else if(['ArrowUp','ArrowLeft'].includes(e.key))n=(i-1+items.length)%items.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=items.length-1;if(n!==undefined){e.preventDefault();const action=items[n].dataset.action,index=items[n].dataset.index,view=items[n].dataset.view;items[n].click();const selector=index!==undefined?`[data-action="${action}"][data-index="${index}"]`:`[data-action="${action}"][data-view="${view}"]`;$(selector)?.focus()}});
 window.addEventListener('hashchange',showRoute);showRoute();
})();
