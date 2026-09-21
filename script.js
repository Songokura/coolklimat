/* ============================================================
   CoolКлимат - скрипт страницы.
   Плиты и ламели · интро героя · перевод RU/KZ · меню · ленты ·
   лента работ с кнопками · видео по видимости · форма в WhatsApp.
   Библиотек нет.
   ============================================================ */
(function(){
"use strict";
var WA = "77085381876";                  /* бизнес-WhatsApp CoolКлимат */
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.CK_CONV). Клики по телефону и WhatsApp
   ловим делегированием, переход не блокируем. Пустой ярлык - событие не шлём. */
function conv(key){
  var id = (window.CK_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD"});
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
}, true);

/* ---------------- КАЗАХСКИЙ СЛОВАРЬ ----------------
   Разметка русская. Ключа нет → строка остаётся русской. */
/* Казахский словарь вынесен в assets/lang/kk.js и грузится по выбору KZ.
   В этом файле казахского текста нет - проверка Google Ads видит русский сайт. */
var KZ = {};        /* заполняется из window.SITE_KK */

/* готовые тексты WhatsApp: название услуги отдельной строкой */
var WA_TXT = {
ru:{
  hero:"Здравствуйте! Интересует:\nКондиционер с установкой\nАдрес и площадь помещения: ",
  us:"Здравствуйте! Интересует:\nУстановка кондиционера под ключ\nАдрес и площадь помещения: ",
  ch:"Здравствуйте! Интересует:\nМонтаж кондиционера в два этапа (черновой этап)\nАдрес и этап ремонта: ",
  pr:"Здравствуйте! Интересует:\nПодбор и покупка кондиционера\nПлощадь помещения: ",
  ob:"Здравствуйте! Интересует:\nСервисное обслуживание и чистка кондиционера\nАдрес и модель: ",
  za:"Здравствуйте! Интересует:\nЗаправка кондиционера фреоном\nАдрес и модель: ",
  re:"Здравствуйте! Интересует:\nРемонт и диагностика кондиционера\nЧто случилось: ",
  de:"Здравствуйте! Интересует:\nДемонтаж и перенос кондиционера\nАдрес: ",
  al:"Здравствуйте! Интересует:\nРаботы на высоте, монтаж наружного блока\nАдрес и этаж: ",
  yu:"Здравствуйте! Интересует:\nОбслуживание кондиционеров для юридического лица\nКомпания и объект: ",
  kontakty:"Здравствуйте! Пишу с сайта CoolКлимат. Нужна консультация: "
},
kk:{}            /* заполняется из window.SITE_KK */
};

var TICK = ["Установка","Черновой этап","Продажа","Обслуживание","Заправка","Ремонт","Демонтаж","Альпинист","Юрлицам"];
var TICK_KZ = null;  /* заполняется из window.SITE_KK */
var BRANDS = ["LG","Samsung","Midea","LG","Samsung","Midea"];

/* ---------------- ПЕРЕВОД ---------------- */
/* Казахский грузится файлом assets/lang/kk.js только по явному выбору человека:
   кнопка KZ, ?lang=kk или сохранённый выбор. Версия файла - та же, что у script.js. */
var SELF = document.currentScript || (function(){ var ss = document.getElementsByTagName("script"); return ss[ss.length - 1]; })();
var KKVER = (SELF && SELF.src && SELF.src.split("?v=")[1]) || "";
var kkQueue = null;
function kkApply(){
  var d = window.SITE_KK; if (!d) return false;
  KZ = d.i18n || {}; WA_TXT.kk = d.wa || WA_TXT.ru; TICK_KZ = d.tick || TICK;
  return true;
}
function kkLoad(cb){
  if (window.SITE_KK) { kkApply(); cb(); return; }
  if (kkQueue) { kkQueue.push(cb); return; }
  kkQueue = [cb];
  var el = document.createElement("script");
  el.src = "assets/lang/kk.js" + (KKVER ? "?v=" + KKVER : "");
  el.onload = function(){ var q = kkQueue; kkQueue = null; kkApply(); q.forEach(function(f){ f(); }); };
  el.onerror = function(){ kkQueue = null; };
  document.head.appendChild(el);
}
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ if (RU[el.dataset.i] === undefined) RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  var t = document.querySelector("title[data-i-t]"); if (t) RU[t.dataset.iT] = t.textContent;
}
function pick(k, kk){ return (kk && KZ[k] !== undefined) ? KZ[k] : RU[k]; }
function curLang(){ return root.lang === "kk" ? "kk" : "ru"; }

function setWaLinks(){
  var L = curLang();
  document.querySelectorAll("[data-wa]").forEach(function(a){
    var t = WA_TXT[L][a.dataset.wa] || WA_TXT[L].hero;
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
}

function applyLang(lang){
  var kk = lang === "kk";
  if (kk && !window.SITE_KK) { kkLoad(function(){ applyLang("kk"); }); return; }
  root.setAttribute("lang", kk ? "kk" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){
    var v = pick(el.dataset.i, kk); if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){
    var v = pick(el.dataset.iAlt, kk); if (v !== undefined) el.alt = v;
  });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){
    var v = pick(el.dataset.iAria, kk); if (v !== undefined) el.setAttribute("aria-label", v);
  });
  document.querySelectorAll("[data-i-c]").forEach(function(el){
    var v = pick(el.dataset.iC, kk); if (v !== undefined) el.setAttribute("content", v);
  });
  var t = document.querySelector("title[data-i-t]");
  if (t) { var tv = pick(t.dataset.iT, kk); if (tv !== undefined) t.textContent = tv; }
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", kk ? "kk_KZ" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === (kk ? "kk" : "ru");
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("ck-lang", kk ? "kk" : "ru"); } catch(e){}
  setWaLinks();
  fillTicker();
  requestAnimationFrame(fitText);
}
/* ?lang=kk в URL сильнее localStorage: русское объявление не должно открыть казахскую версию */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("ck-lang"); } catch(e){}
  var lang = (url === "kk" || url === "ru") ? url : (saved === "kk" ? "kk" : "ru");
  applyLang(lang);
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ applyLang(b.getAttribute("data-lang")); });
});

/* дисплейные строки: казахский длиннее - ужимаем, пока не влезет */
function fitText(){
  document.querySelectorAll(".h1 span, .kphone").forEach(function(el){
    el.style.fontSize = "";
    var box = el.parentElement.clientWidth;
    if (!box) return;
    var size = parseFloat(getComputedStyle(el).fontSize), base = size;
    while (el.scrollWidth > box + 1 && size > base * 0.55) {
      size *= 0.95;
      el.style.fontSize = size + "px";
    }
  });
}

/* ---------------- БЕГУЩИЕ ЛЕНТЫ ----------------
   Копий столько, чтобы дорожка была шире двух экранов; шаг цикла - одна копия. */
function fillOne(el, list, speed){
  if (!el) return;
  var one = list.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(12, w / speed) + "s");
}
function fillTicker(){
  fillOne(document.getElementById("ticker"), (curLang() === "kk" && TICK_KZ) ? TICK_KZ : TICK, 55);
  fillOne(document.getElementById("brands"), BRANDS, 40);
}
var tkTimer;
addEventListener("resize", function(){ clearTimeout(tkTimer); tkTimer = setTimeout(function(){ fillTicker(); fitText(); laneState(); }, 200); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(); fitText(); });

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ЯКОРЯ ---------------- */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 64; };
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH());
  scrollTo({ top: Math.max(0, top), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА: прозрачная над героем ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- ПЛИТЫ И ЛАМЕЛИ ----------------
   Один слушатель scroll через rAF. На каждую обёртку .pw пишем
   --enter / --exit / --stay и --open (доворот ламели), герою ещё --f
   (интро + прокрутка: линии потока и дефлектор). Дальше всё делает CSS. */
var pws = [].slice.call(document.querySelectorAll(".pw"));
var heroPw = document.getElementById("top");
var hero = heroPw ? heroPw.querySelector(".hero") : null;
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 2.4); }
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.style.setProperty("--open",  easeOut(clamp((enter - 0.3) / 0.6)).toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.62);
    if (pw === heroPw) {
      var f = 0.35 * introK + 0.65 * easeOut(clamp(stay * 1.3));
      pw.style.setProperty("--f", f.toFixed(3));
    }
  });
  hdrState();
  /* липкая панель: после 55 % первого экрана, прячется на контактах */
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
    bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
  }
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("resize", update);
  addEventListener("load", update);
  /* интро: ламели текста доворачиваются, линии потока прочерчиваются 1250 мс.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (hero) hero.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1250);
      introK = easeOut(p);
      update();
      if (p < 1) requestAnimationFrame(step);
      else introDone = true;
    };
    requestAnimationFrame(function(){ if (hero) hero.classList.add("on"); requestAnimationFrame(step); });
    /* страховка: если rAF не тикает (фоновая вкладка), собрать экран по таймеру */
    setTimeout(function(){ if (hero) hero.classList.add("on"); }, 400);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 1800);
  }
}
window.plateSync = function(){ introDone = true; introK = 1; if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); });

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- ЛЕНТА РАБОТ: кнопки листания ----------------
   Шаг - ровно одна карточка (ширина + gap из стилей), крайняя кнопка гаснет,
   обе прячутся, если всё влезло. Ленте tabindex=0 - листается стрелками. */
var lane = document.getElementById("lane");
var lprev = document.querySelector(".lbtn.prev"), lnext = document.querySelector(".lbtn.next");
function laneStep(){
  var c = lane ? lane.querySelector(".wk") : null; if (!c) return 300;
  var gap = parseFloat(getComputedStyle(lane).columnGap || getComputedStyle(lane).gap) || 14;
  return c.getBoundingClientRect().width + gap;
}
function laneState(){
  if (!lane || !lprev || !lnext) return;
  var max = lane.scrollWidth - lane.clientWidth;
  var none = max <= 1;
  lprev.hidden = none; lnext.hidden = none;
  lprev.disabled = lane.scrollLeft <= 1;
  lnext.disabled = lane.scrollLeft >= max - 1;
}
if (lane && lprev && lnext) {
  lprev.addEventListener("click", function(){ lane.scrollBy({left: -laneStep(), behavior: RED ? "auto" : "smooth"}); });
  lnext.addEventListener("click", function(){ lane.scrollBy({left: laneStep(), behavior: RED ? "auto" : "smooth"}); });
  lane.addEventListener("scroll", laneState, {passive:true});
  lane.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); lnext.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); lprev.click(); }
  });
  laneState();
  addEventListener("load", laneState);
}

/* ---------------- ВИДЕО: немая петля по видимости ---------------- */
(function(){
  var vids = [].slice.call(document.querySelectorAll("video[data-src]"));
  if (!vids.length) return;
  function start(v){
    if (!v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    var p = v.play(); if (p && p.catch) p.catch(function(){});
  }
  function stop(v){ v.pause(); }
  vids.forEach(function(v){ v.addEventListener("playing", function(){ v.classList.add("is-live"); }); });
  if (!HAS_IO) { vids.forEach(start); return; }
  var vio = new IntersectionObserver(function(es){
    es.forEach(function(e){ e.isIntersecting ? start(e.target) : stop(e.target); });
  }, {threshold:.45});
  vids.forEach(function(v){ vio.observe(v); });
})();

/* ---------------- ФОРМА → WhatsApp ---------------- */
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var L = curLang();
  var F = (L === "kk" && window.SITE_KK && window.SITE_KK.form) || {greet:"Здравствуйте! Заявка с сайта CoolКлимат.\nИмя: ", phone:"\nТелефон: ", msg:"\nЧто нужно: "};
  var t = F.greet + name + F.phone + phone + (msg ? F.msg + msg : "");
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
fillTicker();
fitText();
hdrState();
})();
