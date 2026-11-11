  /* TROCAR: número da clínica com DDI e DDD, só dígitos (ex.: 5511912345678) */
  var WHATSAPP_NUMBER = "5511900000000";

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var msg = encodeURIComponent(el.getAttribute("data-wa"));
    el.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll("[data-ba]").forEach(function (box) {
    var input = box.querySelector("input");
    function set(v){ v=Math.min(100,Math.max(0,v)); box.style.setProperty("--position", v+"%"); input.value=v; }
    function fromX(x){ var r=box.getBoundingClientRect(); return ((x-r.left)/r.width)*100; }
    var down=false;
    box.addEventListener("pointerdown",function(e){ if(e.button!==0) return; down=true; box.classList.add("dragging"); box.setPointerCapture(e.pointerId); set(fromX(e.clientX)); });
    box.addEventListener("pointermove",function(e){ if(down) set(fromX(e.clientX)); });
    function end(e){ down=false; box.classList.remove("dragging"); }
    box.addEventListener("pointerup",end); box.addEventListener("pointercancel",end);
    input.addEventListener("input",function(){ set(parseFloat(input.value)); });
    set(50);
  });

  /* Carrossel 3D do antes e depois */
  (function(){
    var deck=document.getElementById("deck");if(!deck)return;
    var cards=[].slice.call(deck.querySelectorAll(".deck-card")),dots=[].slice.call(document.querySelectorAll("#deckDots button")),n=cards.length;
    var cur=0,timer=null,DUR=9000,paused=false,visible=false,reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,resumeT=null;
    function show(i){
      cur=(i+n)%n;
      cards.forEach(function(c,k){
        var off=(k-cur+n)%n;
        c.classList.remove("active","next","prev");
        var f=c.querySelector(".dk-prog i");f.style.transition="none";f.style.width="0";
        if(off===0){c.classList.add("active");c.removeAttribute("aria-hidden");
          if(!reduce&&!paused&&visible){requestAnimationFrame(function(){requestAnimationFrame(function(){f.style.transition="width "+DUR+"ms linear";f.style.width="100%"})})}
          deck.setAttribute("data-accent",c.getAttribute("data-accent"));}
        else{c.setAttribute("aria-hidden","true");if(off===1)c.classList.add("next");else if(off===n-1)c.classList.add("prev");}
      });
      dots.forEach(function(d,k){d.classList.toggle("on",k===cur)});
    }
    function stop(){clearInterval(timer);timer=null;var f=cards[cur].querySelector(".dk-prog i");f.style.transition="none";f.style.width="0"}
    function start(){stop();if(reduce||paused||!visible)return;show(cur);timer=setInterval(function(){show(cur+1)},DUR)}
    function pause(){paused=true;stop();clearTimeout(resumeT)}
    function resume(delay){clearTimeout(resumeT);resumeT=setTimeout(function(){paused=false;start()},delay||0)}
    cards.forEach(function(c,k){c.addEventListener("click",function(){if(k!==cur){show(k);if(!paused)start()}})});
    dots.forEach(function(d,k){d.addEventListener("click",function(){show(k);start()})});
    document.getElementById("deckPrev").addEventListener("click",function(){show(cur-1);start()});
    document.getElementById("deckNext").addEventListener("click",function(){show(cur+1);start()});
    deck.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){show(cur+1);start()}else if(e.key==="ArrowLeft"){show(cur-1);start()}});
    deck.addEventListener("mouseenter",pause);deck.addEventListener("mouseleave",function(){resume(600)});
    deck.addEventListener("pointerdown",function(e){if(e.pointerType==="touch"){pause();}});
    deck.addEventListener("pointerup",function(e){if(e.pointerType==="touch"){resume(7000)}});
    deck.addEventListener("focusin",pause);deck.addEventListener("focusout",function(){resume(600)});
    if("IntersectionObserver" in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?start():stop()},{threshold:.35}).observe(deck)}
    else{visible=true}
    show(0);
    /* leve inclinação 3D no card ativo */
    if(matchMedia("(hover:hover)").matches&&!reduce){
      deck.addEventListener("mousemove",function(e){var r=deck.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;deck.style.setProperty("--tx",(x*5).toFixed(2)+"deg");deck.style.setProperty("--ty",(y*-4).toFixed(2)+"deg")});
      deck.addEventListener("mouseleave",function(){deck.style.setProperty("--tx","0deg");deck.style.setProperty("--ty","0deg")});
    }
  })();
  (function(){
    var t=document.querySelector(".gcar-track");if(!t)return;
    var dots=document.querySelectorAll(".gdots button"),n=dots.length;
    function idx(){return Math.round(t.scrollLeft/t.clientWidth)}
    function go(i){i=Math.max(0,Math.min(n-1,i));t.scrollTo({left:i*(t.clientWidth+16),behavior:"smooth"})}
    t.addEventListener("scroll",function(){var i=Math.min(n-1,Math.round(t.scrollLeft/(t.clientWidth+16)));dots.forEach(function(d,k){d.classList.toggle("on",k===i)})},{passive:true});
    dots.forEach(function(d,k){d.addEventListener("click",function(){go(k)})});
    document.querySelector(".gprev").addEventListener("click",function(){go(Math.round(t.scrollLeft/(t.clientWidth+16))-1)});
    document.querySelector(".gnext").addEventListener("click",function(){go(Math.round(t.scrollLeft/(t.clientWidth+16))+1)});
  })();
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* Revelação ao rolar */
  (function(){
    if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
    var groups=[
      [".treat-intro, .cases-head, .about-head, .about .wrap > h2, .about .wrap > p, .growth h2, .growth .wrap > p, .process-intro, .faq h2, .more h2, .tb-text, .tb-head",0],
      [".treatments ul > li, .partner, .deck, .deck-ctrl, .gcar, .steps, .faq details, .cases-foot, .tb-media, .more li, .cta-actions",1]
    ];
    var els=[];
    groups.forEach(function(g){document.querySelectorAll(g[0]).forEach(function(el){
      if(el.closest(".hero")||els.indexOf(el)>-1)return;
      var sib=el.parentElement?Array.prototype.indexOf.call(el.parentElement.children,el):0;
      el.setAttribute("data-r","");el.style.setProperty("--i",Math.min(sib,6));els.push(el);
    });});
    document.querySelectorAll(".steps li").forEach(function(li,i){li.querySelector(".n").style.setProperty("--i",i)});
    document.documentElement.classList.add("js");
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
    els.forEach(function(el){io.observe(el)});
  })();

  /* Menu: celular e teclado */
  (function(){
    var b=document.querySelector(".nav-toggle"),root=document.documentElement;
    function set(o){root.classList.toggle("menu-open",o);if(b){b.setAttribute("aria-expanded",o?"true":"false");b.setAttribute("aria-label",o?"Fechar menu":"Abrir menu")}}
    if(b)b.addEventListener("click",function(){set(!root.classList.contains("menu-open"))});
    document.querySelectorAll(".nav a").forEach(function(a){a.addEventListener("click",function(){set(false)})});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){set(false);document.querySelectorAll(".nav-dd.open").forEach(function(d){d.classList.remove("open")})}});
    matchMedia("(min-width:1080px)").addEventListener("change",function(e){if(e.matches)set(false)});
    var dd=document.querySelector(".nav-dd>button");
    if(dd)dd.addEventListener("click",function(){var p=dd.parentElement,o=p.classList.toggle("open");dd.setAttribute("aria-expanded",o?"true":"false")});
    document.addEventListener("click",function(e){var p=document.querySelector(".nav-dd.open");if(p&&!p.contains(e.target)){p.classList.remove("open")}});
  })();

  /* Leve movimento do fundo com o mouse, só em telas com mouse (referências Naturea e Desfoque Dental) */
  (function(){
    var bg=document.querySelector(".phero-bg img"),hero=document.querySelector(".phero");
    if(!bg||!hero||!matchMedia("(hover:hover)").matches||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
    var tick=false;
    hero.addEventListener("mousemove",function(e){
      if(tick)return;tick=true;
      requestAnimationFrame(function(){
        var r=hero.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*14,y=((e.clientY-r.top)/r.height-.5)*10;
        bg.style.transform="scale(1.04) translate("+x.toFixed(1)+"px,"+y.toFixed(1)+"px)";tick=false;
      });
    });
    hero.addEventListener("mouseleave",function(){bg.style.transform=""});
  })();
