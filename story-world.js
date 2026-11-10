'use strict';
// Pixel scenery and cyanowl's CC0 sprites share one 8-unit grid. See assets/ARTWORK.md.
window.StoryWorld = (() => {
  const W=960,H=600,C={ink:'#373141',paper:'#fcf8fb',wall:'#e6def0',wood:'#b5a1c2',deep:'#6d5e80',terracotta:'#bb735a',skin:'#c78e68'};
  // A sprite pixel is eight world units. Render scenery at that same resolution,
  // then enlarge without smoothing. All narration stays outside the artwork.
  const PIXEL=8;
  let pixelPass=false,actors=null;
  const palette=['#373141','#514563','#6d5e80','#85768f','#9e8cad','#b5a1c2','#c5b0dc','#d3c2df','#e6def0','#f1e9f7','#fcf8fb','#fffcf8','#e1c7d7','#c6acd1','#d8b5d0','#f7d6e4','#b3c8b1','#bed2cb','#8b9d7a','#7a8d9d','#a4b8c4','#b3c9d5','#c0cbe4','#d0d6eb','#b6bad5','#8e8eaf','#a9a6c9','#c8d8dc','#e8d7f1','#e3cddd','#c7b9d2','#d7c5e1'];
  const colors=palette.map(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)));
  const colorCache=new Map();
  let frames=[],raf=0,clock=0,last=null,key='',paused=false;
  let state={scene:0,beat:0,speaker:'Narrator',phase:'dialogue',beatAt:0,exitAt:null};
  const spriteSheets={};
  for(const type of ['mika','eli']){
    const img=new Image();
    img.addEventListener('load',()=>{if(frames.length)schedule()});
    img.src=`assets/sprites/${type}.png?v=aligned-v2`;
    spriteSheets[type]=img;
  }
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},lerp=(a,b,t)=>a+(b-a)*t;
  const snap=v=>Math.round(v/PIXEL)*PIXEL;
  function path(g,d,fill,stroke=C.ink,width=2){
    const p=new Path2D(d);
    if(fill){g.fillStyle=fill;g.fill(p)}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=pixelPass?Math.max(PIXEL,width):width;g.lineJoin='miter';g.stroke(p)}
  }
  function box(g,x,y,w,h,fill,r=0,stroke=null){
    if(pixelPass){
      x=snap(x);y=snap(y);w=Math.max(PIXEL,snap(w));h=Math.max(PIXEL,snap(h));
      g.fillStyle=stroke||fill;g.fillRect(x,y,w,h);
      if(stroke&&w>PIXEL*2&&h>PIXEL*2){g.fillStyle=fill;g.fillRect(x+PIXEL,y+PIXEL,w-PIXEL*2,h-PIXEL*2)}
      return;
    }
    g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();
    if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}
  }
  function oval(g,x,y,rx,ry,fill,stroke=null){
    if(pixelPass){
      const ellipse=(a,b,color)=>{g.fillStyle=color;const cx=Math.round(x/PIXEL),cy=Math.round(y/PIXEL),r=Math.max(1,Math.round(a/PIXEL)),h=Math.max(1,Math.round(b/PIXEL));
        for(let row=-h;row<=h;row++){const span=Math.floor(r*Math.sqrt(Math.max(0,1-row*row/(h*h))));g.fillRect((cx-span)*PIXEL,(cy+row)*PIXEL,(span*2+1)*PIXEL,PIXEL)}};
      ellipse(rx,ry,stroke||fill);if(stroke&&rx>PIXEL&&ry>PIXEL)ellipse(rx-PIXEL,ry-PIXEL,fill);return;
    }
    g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}
  }
  function line(g,points,color,width=2){
    if(pixelPass){
      g.fillStyle=color;const size=Math.max(1,Math.round(width/PIXEL))*PIXEL;
      for(let i=1;i<points.length;i++){
        let x=Math.round(points[i-1][0]/PIXEL),y=Math.round(points[i-1][1]/PIXEL);
        const ex=Math.round(points[i][0]/PIXEL),ey=Math.round(points[i][1]/PIXEL),dx=Math.abs(ex-x),dy=-Math.abs(ey-y),sx=x<ex?1:-1,sy=y<ey?1:-1;
        let error=dx+dy;
        for(;;){g.fillRect(x*PIXEL,y*PIXEL,size,size);if(x===ex&&y===ey)break;const e=2*error;if(e>=dy){error+=dy;x+=sx}if(e<=dx){error+=dx;y+=sy}}
      }
      return;
    }
    g.beginPath();g.moveTo(...points[0]);for(const p of points.slice(1))g.lineTo(...p);g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();
  }
  function star(g,x,y,r=10){path(g,`M${x} ${y-r}L${x+3} ${y-3} ${x+r} ${y} ${x+3} ${y+3} ${x} ${y+r} ${x-3} ${y+3} ${x-r} ${y} ${x-3} ${y-3}Z`,'#fff9f9','#aa94bd',1.2)}
  function limitPalette(g,w,h){
    const data=g.getImageData(0,0,w,h),p=data.data;
    for(let i=0;i<p.length;i+=4){
      if(!p[i+3])continue;
      const key=(p[i]<<16)|(p[i+1]<<8)|p[i+2];let best=colorCache.get(key);
      if(!best){let distance=Infinity;for(const c of colors){const d=(p[i]-c[0])**2+(p[i+1]-c[1])**2+(p[i+2]-c[2])**2;if(d<distance){distance=d;best=c}}colorCache.set(key,best)}
      p[i]=best[0];p[i+1]=best[1];p[i+2]=best[2];p[i+3]=255;
    }
    g.putImageData(data,0,0);
  }
  function renderPixelScene(item,g,paint,w=W,h=H){
    const sw=Math.ceil(w/PIXEL),sh=Math.ceil(h/PIXEL);
    if(!item.pixelLayer){item.pixelLayer=document.createElement('canvas');item.pixelLayer.width=sw;item.pixelLayer.height=sh}
    const pg=item.pixelLayer.getContext('2d',{willReadFrequently:true});
    pg.setTransform(1/PIXEL,0,0,1/PIXEL,0,0);pg.clearRect(0,0,w,h);pg.imageSmoothingEnabled=false;
    const sceneActors=[];actors=sceneActors;pixelPass=true;
    paint(pg);limitPalette(pg,sw,sh);
    actors=null;pixelPass=false;
    g.clearRect(0,0,w,h);g.imageSmoothingEnabled=false;
    g.drawImage(item.pixelLayer,0,0,sw,sh,0,0,sw*PIXEL,sh*PIXEL);
    if(sceneActors.length){
      pg.clearRect(0,0,w,h);pixelPass=true;sceneActors.forEach(args=>person(pg,...args));pixelPass=false;
      g.drawImage(item.pixelLayer,0,0,sw,sh,0,0,sw*PIXEL,sh*PIXEL);
    }
  }

  function plant(g,x,y,scale=1){g.save();g.translate(x,y);g.scale(scale,scale);path(g,'M-23-8 L23-8 L17 28 Q0 35-17 28Z','#ccaecb','#62506d');line(g,[[0,-8],[0,-73]],'#7a8d9d',4);for(const [a,b,flip] of [[0,-30,1],[0,-49,-1],[0,-66,1],[-1,-42,1]]){g.save();g.translate(a,b);g.scale(flip,1);path(g,'M0 0 Q-29-28-39-6 Q-20 15 0 0Z','#b3c8b1',null);g.restore()}g.restore()}
  function mug(g,x,y,color){box(g,x,y,20,23,color,5);g.beginPath();g.arc(x+22,y+10,7,-Math.PI/2,Math.PI/2);g.strokeStyle=color;g.lineWidth=4;g.stroke();oval(g,x+10,y+1,8,3,'#d8cce6')}
  function keyIcon(g,x,y){g.strokeStyle='#9685b5';g.lineWidth=5;g.beginPath();g.arc(x,y,9,0,Math.PI*2);g.stroke();line(g,[[x+8,y],[x+31,y],[x+31,y+8],[x+25,y+8]],'#9685b5',5)}
  function paper(g,x,y,w,h,title,rows=[]){
    g.save();g.translate(x,y);box(g,3,5,w,h,'#6c54771a',4);box(g,0,0,w,h,'#fffcf8',4,'#84738e');
    // Silent visual notes: checkboxes and short rules, never tiny written labels.
    box(g,12,14,w-32,8,'#c5b0dc');
    for(let i=0;i<Math.min(3,rows.length||2);i++){const y=38+i*24;if(y+8<h-8){box(g,12,y,8,8,'#b3c8b1');box(g,30,y,w-48-(i%2)*16,4,'#d3c9e0')}}
    g.restore();
  }
  function phone(g,x,y,label=''){
    box(g,x,y,39,69,'#484057',8);box(g,x+4,y+7,31,52,'#eee8f5',4);line(g,[[x+15,y+4],[x+24,y+4]],'#b3a8c9');
    if(label){box(g,x+9,y+22,20,12,'#c5b0dc');line(g,[[x+9,y+42],[x+25,y+42]],'#b9aed1')}
  }
  function laptop(g,x,y,w=107){box(g,x,y,w,67,'#9083a9',5);box(g,x+6,y+6,w-12,53,'#ece6f6',2);path(g,`M${x-7} ${y+67}H${x+w+8}L${x+w+18} ${y+76}H${x-17}Z`,'#b7aacd','#6a5c7c');line(g,[[x+20,y+21],[x+w-20,y+21]],'#c2b4d4',3);line(g,[[x+20,y+30],[x+w-35,y+30]],'#cabfda',3)}
  function carton(g,x,y,w=95,h=70,label=''){box(g,x,y,w,h,'#c7b9d2',3,'#726282');path(g,`M${x} ${y}L${x+12} ${y-14}H${x+w-10}L${x+w} ${y}Z`,'#e1d4e6','#726282');box(g,x+w/2-6,y,12,h,'#f6e9e5')}
  function spriteFrame(t,opts={}){
    if(opts.pose==='carry')return {row:2,col:opts.walking?3+Math.floor(t*7)%2:3};
    if(opts.pose==='phone')return {row:2,col:0};
    if(opts.pose==='gesture')return {row:2,col:1};
    if(opts.walking)return {row:1,col:Math.floor(t*7)%4};
    return {row:0,col:0};
  }
  function person(g,x,y,type,t,opts={}){
    if(opts.hidden)return;
    if(actors){actors.push([x,y,type,t,opts]);return}
    const img=spriteSheets[type],scale=opts.scale||1;
    oval(g,x,y+4,43*scale,6*scale,'#51456324');
    if(!img?.complete||!img.naturalWidth)return;
    const {row,col}=spriteFrame(t,opts),unit=8;
    g.save();g.translate(pixelPass?snap(x):Math.round(x),pixelPass?snap(y):Math.round(y));
    g.scale((opts.facing==='left'?-1:1)*scale,scale);
    g.imageSmoothingEnabled=false;
    // The phone sits behind the raised fingers of the corrected, centered pose.
    if(opts.pose==='phone'){
      box(g,88,-200,32,56,'#373141');
      box(g,96,-192,16,32,'#d0d6eb');
    }
    // One complete source frame: head, neck, arms, and legs always stay together.
    g.drawImage(img,col*32,row*40,32,40,-16*unit,-36*unit,32*unit,40*unit);
    if(opts.pose==='carry')carton(g,-44,-133,91,49);
    if(opts.pose==='case'){
      line(g,[[-64,-96],[-64,-86]],C.ink,3);box(g,-91,-86,54,80,'#c6a9cb',3,C.ink);
      line(g,[[-80,-78],[-80,-13]],'#f0dfeb',2);oval(g,-80,-4,4,4,C.ink);oval(g,-46,-4,4,4,C.ink);
    }
    g.restore();
  }
  function portrait(g,type,t=0,talking=false){
    g.save();g.clearRect(0,0,160,180);box(g,0,0,160,180,'#fffdf8');
    const img=spriteSheets[type];
    if(img?.complete&&img.naturalWidth){
      g.imageSmoothingEnabled=false;g.filter='grayscale(1) contrast(1.12)';
      // Crop the same intact figure, including its neck and shoulders.
      g.drawImage(img,4,0,24,26,-4,-2,168,182);
      g.filter='none';
    }
    if(talking)box(g,12,169,136,3,C.deep);
    g.restore();
  }
  function skyline(g,x,y,w,h,night=false){
    box(g,x,y,w,h,night?'#a9a6c9':'#d0d6eb',0);
    for(let i=0;i<8;i++){
      const bw=w/8+9,bh=42+((i*37)%96);box(g,x+i*w/8,y+h-bh,bw,bh,night?'#8e8eaf':'#b6bad5');
      for(let row=0;row<4;row++)for(let col=0;col<2;col++)box(g,x+i*w/8+8+col*14,y+h-bh+12+row*18,6,9,night&&((i+row)%3===0)?'#e8d7f1':'#d9d9ed',1);
    }
  }
  function room(g,scene,beat,t){
    const night=scene===2||scene===3||scene===1&&beat>0;
    box(g,0,0,W,H,night?'#ddd8eb':'#f1e9f7');
    box(g,0,389,W,211,'#efe7f2');
    for(let row=0;row<5;row++)for(let col=-1;col<12;col++)if((row+col)%2===0){const y=389+row*44,x=col*94-row*12;path(g,`M${x} ${y}H${x+94}L${x+82} ${y+44}H${x-12}Z`,'#ddd0e9',null)}
    path(g,'M0 387Q267 391 482 388T960 390 M0 393Q430 396 960 394',null,'#80718f',2);
    star(g,615,47,12);star(g,780,64,7);star(g,598,213,6);
    for(let i=0;i<6;i++)line(g,[[301+i*6,351],[309+i*6,343]],'#c6b8d3',1);
    box(g,50,105,238,232,'#fbf7fc',8,'#85768f');skyline(g,63,117,212,204,night);line(g,[[169,117],[169,323]],'#f9f3fc',8);line(g,[[63,220],[275,220]],'#f9f3fc',8);box(g,39,331,261,12,'#a89abc',3);
    path(g,'M44 101Q32 206 47 325L77 327Q56 216 75 101Z','#c5b0dc',null);path(g,'M272 101Q292 206 275 325L244 327Q265 218 245 101Z','#c5b0dc',null);
    if(scene===2)for(let i=0;i<14;i++){const x=77+(i*37)%170,y=126+(t*36+i*27)%179;line(g,[[x,y],[x-3,y+10]],'#e3e8da80',1)}
    box(g,415,304,258,104,'#b3aac9',16,C.ink);box(g,432,290,225,81,'#cac0de',13,C.ink);box(g,438,310,100,56,'#dcd4ea',11);box(g,548,310,100,56,'#dcd4ea',11);line(g,[[436,407],[436,426]],'#65566f',8);line(g,[[654,407],[654,426]],'#65566f',8);
    box(g,823,143,104,380,'#776580',4,C.ink);box(g,834,154,82,356,scene===4?'#b3bdd2':'#b8a5cb',3);box(g,845,178,61,116,scene===4?'#d6dbea':'#d3c2df',2);oval(g,899,339,4,4,'#f7d6e4');box(g,813,518,125,13,'#e6d7e9',3);
    box(g,337,111,235,12,'#a18eb5',3);for(let i=0;i<8;i++)box(g,348+i*24,65+(i%3)*7,17,46-(i%3)*7,['#c5b0dc','#bed2cb','#e1c7d7'][i%3],2);
    box(g,62,402,178,14,'#bba8c8',5,C.ink);line(g,[[78,417],[78,493]],'#83718c',9);line(g,[[224,417],[224,493]],'#83718c',9);plant(g,150,385,.7);
    oval(g,493,531,314,41,scene===2?'#c3b8d4':'#c6acd1');oval(g,493,531,270,29,scene===2?'#dcd6e8':'#e3cddd');
    // The shared table is at hand height; characters remain in front of it.
    box(g,424,428,196,14,'#c3b2cf',7,C.ink);line(g,[[446,443],[438,518]],'#8c789b',8);line(g,[[597,443],[606,518]],'#8c789b',8);
    if(scene<4){mug(g,457,403,'#d8b5d0');mug(g,559,403,'#b3c9d5')}
    if(scene===0){keyIcon(g,514,419);carton(g,80,472,104,68,'BOOKS');carton(g,747,491,88,58,'OUR THINGS')}
    if(scene===1){
      paper(g,654,82,147,150,'OUR WEEK',['M  T  W  T  F  S  S','Mika · daytime','Eli · night shifts']);
      if(beat>0){for(let i=0;i<4;i++)oval(g,82+i*15,400-i*4,23,5,'#f5eff9','#c2b7d3');if(beat<4)paper(g,744,260,126,112,'DUE THIS WEEK',['Rent · utilities','Groceries']);laptop(g,459,352,105)}
      if(beat>=4)paper(g,677,266,165,123,'SHARE THE CARE',['Groceries · Eli','Laundry · Eli','Plan & review · both']);
    }
    if(scene===2){paper(g,658,76,151,150,'WHAT IS NEXT?',['Mika · Iloilo job','Eli · Manila work','Marriage? Children?']);laptop(g,473,352,114);phone(g,391,368,'unread')}
    if(scene===3){paper(g,669,78,148,145,'THREE MONTHS',['Weekly check-ins','Shared chores','Honest plans']);for(let i=0;i<3;i++){line(g,[[684+i*34,186],[690+i*34,192],[703+i*34,176]],'#81739c',3)}paper(g,459,347,124,75,'JOB OFFER',['Iloilo']);}
    if(scene===4){carton(g,80,468,108,74,'MIKA');carton(g,716,474,96,68,'ELI');paper(g,441,356,164,68,'FINAL BILLS',['Deposit · utilities']);if(beat>=5)keyIcon(g,518,419);}
  }
  function commute(g,t,beat){
    box(g,0,0,960,600,'#f2edf7');box(g,25,28,444,539,'#ede4f4',14);box(g,490,28,444,539,'#e0e2f1',14);
    skyline(g,43,96,408,248,false);skyline(g,508,96,408,248,true);
    box(g,43,346,408,220,'#dccce8');box(g,508,346,408,220,'#c4cbdf');
    line(g,[[43,437],[451,437]],'#8c769d',4);line(g,[[508,437],[916,437]],'#9a8cb0',4);
    // Actual transport and platforms make the opening pressure visible.
    box(g,43,252,408,102,'#f2edf7',12,'#9e8cad');
    for(let i=0;i<5;i++){box(g,59+i*77,267,59,47,'#c0cbe4',7);line(g,[[72+i*77,270],[72+i*77,309]],'#dddff0',2)}
    box(g,43,326,408,13,'#b7a0d1');line(g,[[43,368],[451,368]],'#ead7f1',6);
    box(g,544,261,355,96,'#dbd3eb',13,'#91809f');box(g,557,275,110,43,'#b4bddd',7);box(g,681,275,62,43,'#b4bddd',4);box(g,756,275,62,43,'#b4bddd',4);box(g,830,275,54,65,'#b5c5dc',4);
    oval(g,595,358,17,17,'#5b4e70');oval(g,843,358,17,17,'#5b4e70');oval(g,595,358,8,8,'#d1c7e1');oval(g,843,358,8,8,'#d1c7e1');
    paper(g,71,425,128,115,'THE DAY',['Work','Travel','Home, tired']);paper(g,759,425,136,115,'THE NIGHT',['Travel','Shift','Missed dinner']);
    person(g,277,548,'mika',t,{facing:'right',pose:'phone',emotion:'tired',talking:state.speaker==='Mika'&&t-state.beatAt<4});
    person(g,675,548,'eli',t,{facing:'left',pose:'phone',emotion:'tired',talking:state.speaker==='Eli'&&t-state.beatAt<4});
  }
  function separateHomes(g,t){
    box(g,0,0,960,600,'#f5eef8');box(g,22,25,444,549,'#e8ddf0',14);box(g,491,25,447,549,'#e1e6f0',14);
    for(const [x,night] of [[47,false],[518,true]]){box(g,x,107,190,184,'#fbf6fb',6,'#aa9ab6');skyline(g,x+10,117,170,164,night);line(g,[[x+95,117],[x+95,281]],'#f8f2fb',6)}
    box(g,22,439,444,135,'#d7c5e1',0);box(g,491,439,447,135,'#c8d8dc',0);
    box(g,74,424,304,14,'#b7a0c7',5);box(g,549,424,309,14,'#a4b8c4',5);for(const x of [91,359,566,842])line(g,[[x,440],[x,517]],'#877d9b',8);
    laptop(g,91,354,105);plant(g,366,408,.62);paper(g,728,346,138,73,'DRAFT MESSAGE',['not sent']);phone(g,576,350,'unsent');
    person(g,273,548,'mika',t,{facing:'right',emotion:'hope',talking:state.speaker==='Mika'&&t-state.beatAt<4});
    person(g,681,548,'eli',t,{facing:'left',pose:state.beat===1?'phone':'rest',emotion:'soft',talking:state.speaker==='Eli'&&t-state.beatAt<4});
  }
  function stageActors(scene,t,opts=state){
    const moving=scene===4&&opts.exitAt!=null?ease((t-opts.exitAt-.3)/3.8):0;
    const entry=scene===0?ease(t/1.8):1;
    return [
      {type:'mika',x:scene===0?lerp(300,337,entry):337,y:548,facing:'right',walking:scene===0&&entry<1,pose:scene===4?'case':scene===1&&opts.beat===1?'gesture':'rest',emotion:scene===2?'sad':scene===5?'hope':'soft'},
      {type:'eli',x:scene===4?lerp(662,886,moving):scene===0?lerp(701,664,entry):664,y:scene===4?lerp(548,533,moving):548,facing:scene===4&&moving>0?'right':'left',walking:scene===4&&moving>0&&moving<1||scene===0&&entry<1,hidden:scene===4&&moving===1,pose:scene===4?'carry':'rest',emotion:scene===2?'tired':'soft'}
    ];
  }
  function drawScene(g,t,mode,scene){
    if(mode==='outside'){room(g,0,5,t);person(g,337,548,'mika',t,{facing:'right',emotion:'hope'});person(g,664,548,'eli',t,{facing:'left',emotion:'soft'});return}
    const beat=state.phase==='cut'?5:state.beat;
    if(scene===0&&beat<2){commute(g,t,beat);return}
    if(scene===5){separateHomes(g,t);return}
    room(g,scene,beat,t);
    stageActors(scene,t,{...state,beat}).forEach(a=>person(g,a.x,a.y,a.type,t,{...a,talking:state.phase==='dialogue'&&state.speaker.toLowerCase()===a.type&&t-state.beatAt<4.5}));
  }
  function draw(item,t){
    const g=item.canvas.getContext('2d'),ratio=item.ratio;g.setTransform(ratio,0,0,ratio,0,0);g.imageSmoothingEnabled=false;
    if(item.mode==='portrait'||item.mode==='cast'){
      const who=item.mode==='cast'?item.who:state.speaker;
      if(who==='Narrator')renderPixelScene(item,g,pg=>{box(pg,0,0,160,184,'#eee8f2');plant(pg,80,126,1.1)},160,184);
      else portrait(g,who.toLowerCase(),t,item.mode!=='cast'&&state.phase==='dialogue'&&t-state.beatAt<4.5);
      return;
    }
    renderPixelScene(item,g,pg=>drawScene(pg,t,item.mode,item.scene));
  }
  function loop(ms){
    raf=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(last!==null&&!paused&&!reduced&&!document.hidden)clock+=clamp((ms-last)/1000,0,.08);
    last=ms;frames=frames.filter(f=>f.canvas.isConnected);frames.forEach(f=>draw(f,reduced?20:clock));
    if(frames.length&&!paused&&!reduced&&!document.hidden)raf=requestAnimationFrame(loop);
  }
  function schedule(){cancelAnimationFrame(raf);last=null;raf=requestAnimationFrame(loop)}
  function update(next){
    const changed=next.scene!==undefined&&next.scene!==state.scene;
    if(changed){clock=0;state.exitAt=null}
    if(changed||next.beat!==undefined&&next.beat!==state.beat||next.phase!==undefined&&next.phase!==state.phase)state.beatAt=clock;
    state={...state,...next};
    if(state.scene===4&&(state.beat>=5||state.phase==='cut')&&state.exitAt===null)state.exitAt=clock;
  }
  document.addEventListener('visibilitychange',()=>{last=null;if(!document.hidden)schedule()});
  return {
    mount(root=document,next={}){
      const game=root.querySelector('canvas[data-world="inside"]'),newKey=game?'scene:'+game.dataset.scene:'intro';
      if(newKey!==key){clock=0;state.beatAt=0;state.exitAt=null;key=newKey}
      update(next);
      frames=[...root.querySelectorAll('canvas[data-world]')].map(canvas=>({canvas,mode:canvas.dataset.world,scene:Number(canvas.dataset.scene||0),who:canvas.dataset.who||'Mika',ratio:Math.min(2,window.devicePixelRatio||1)}));
      frames.forEach(f=>{const portrait=f.mode==='portrait'||f.mode==='cast';f.canvas.width=(portrait?160:W)*f.ratio;f.canvas.height=(portrait?180:H)*f.ratio});schedule();
    },
    portrait,
    stageActors,
    toggleMotion(){paused=!paused;schedule();return paused},
    isPaused(){return paused},
    replay(){clock=0;state.beatAt=0;state.exitAt=state.scene===4&&(state.beat>=5||state.phase==='cut')?0:null;paused=false;schedule()}
  };
})();
