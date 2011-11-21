/*
 * jQuery Plus Slider 1.4.1.1
 * By Jamy Golden
 * http://css-plus.com
 * @jamygolden
 *
 * Copyright 2011
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($){
$.plusSlider=function(el,options){
var base=this;
base.$el=$(el);
base.el=el;
base.$el.data('plusSlider',base);
base.init=function(){
base.options=$.extend({},$.plusSlider.defaults,options);
base.$el.addClass('plusslide-container').wrap('<div class="plusslider '+base.el.getAttribute('id')+'" />');
base.$wrap=base.$el.parent();
base.$wrapContainer=base.$wrap.parent();
base.$slides=base.$el.children();
var totalSlides=base.$slides.length,
totalIndex=totalSlides-1,
sliderWidth=0,
wrapContainerWidth=base.$wrapContainer.width();
console.log(wrapContainerWidth)
if(base.options.defaultSlide>totalIndex){
base.options.defaultSlide=0;
}else if(base.options.defaultSlide<0){
base.options.defaultSlide=totalIndex;
};
base.$el.data('slides',{
current:base.options.defaultSlide,
dimensionsRecorded:false
});
for(var i=0;i<totalSlides;i++){
if(i==0)sliderWidth=0;
sliderWidth+=base.$slides.eq(i).outerWidth();
};
var currentTotalWidth=base.$slides.eq(base.options.defaultSlide).outerWidth(),
currentTotalHeight=base.$slides.eq(base.options.defaultSlide).outerHeight();
base.$slides.addClass('child').eq(base.options.defaultSlide).addClass('current');
base.$wrap.width(currentTotalWidth).height(currentTotalHeight);
base.$el.height(currentTotalHeight);
if(base.options.sliderType=='slider'){
base.$wrap.addClass('plustype-slider');
base.$el.width(sliderWidth);
if(base.options.fullBleed){
function setSliderWidth(){
for(var i=0;i<totalSlides;i++){
if(i==0)sliderWidth=0;
var $currentSlide=base.$slides.eq(i);
$currentSlide.width();
sliderWidth+=$currentSlide.outerWidth();
base.$el.width(sliderWidth);
};
};
base.$el.width(9999);
for(var i=0;i<totalSlides;i++){
var $currentSlide=base.$slides.eq(i);
if(base.$el.data('slides').dimensionsRecorded==false){
$currentSlide.data('dimensions',{
originalWidth:$currentSlide.width(),
widthPercentage:Math.round(parseFloat(100*$currentSlide.outerWidth())/parseFloat(wrapContainerWidth))
});
};
var $currentSlide=base.$slides.eq(i);
if($currentSlide.data('dimensions').originalWidth>wrapContainerWidth){
$currentSlide.width(wrapContainerWidth);
}else{
$currentSlide.width($currentSlide.data('dimensions').originalWidth);
}
if(i==totalIndex)base.$el.data('slides').dimensionsRecorded=true;
}
setSliderWidth();
}
base.$slides.show();
base.$el.css('left',base.$slides.eq(base.options.defaultSlide).position().left*-1+'px');
}else{
base.$wrap.addClass('plustype-fader');
base.$slides.eq(0).show();
};
if(totalSlides===1){
base.options.autoSlide=false;
base.options.createArrows=false;
base.options.createPagination=false;
};
if(base.options.width)base.$wrap.width(base.options.width);
if(base.options.height)base.$wrap.height(base.options.height);
if(base.options.createPagination){
base.$sliderControls=$('<ul />',{
'class':'plusslider-controls'
});
base.options.paginationBefore?base.$sliderControls.prependTo(base.$wrap):base.$sliderControls.appendTo(base.$wrap);
base.$sliderControls.wrap('<div class="plusslider-controls-wrapper" />');
for(var i=0;i<totalSlides;i++){
$('<li />',{
href:'#',
'data-index':i,
text:base.options.paginationTitle?base.$slides.eq(i).attr('data-title'):i+1
}).appendTo(base.$sliderControls);
};
if(base.options.paginationWidth)base.$sliderControls.width(base.$sliderControls.find('li').outerWidth(true)*totalSlides);
var controlIndex=0;
base.$sliderControls.find('li').click(function(e){
controlIndex=$(this).index();
base.toSlide(controlIndex);
}).eq(controlIndex).addClass('current');
};
base.toSlide=function(slide){
if(slide=='next'||slide==''){
slide=base.$el.data('slides').current+1;
}else if(slide=='prev'){
slide=base.$el.data('slides').current-1;
};
if(slide>totalIndex){
slide=0;
}else if(slide<0){
slide=totalIndex;
};
if(base.options.sliderType=='slider'){
if(!base.$el.is(':animated')){
if(base.options.createPagination){
base.$sliderControls.find('li').removeClass('current').eq(slide).addClass('current');
};
base.$el.animate({
height:base.$slides.eq(slide).outerHeight(),
left:base.$slides.eq(slide).position().left*-1+'px'
},base.options.speed,base.options.sliderEasing);
base.$wrap.animate({
height:base.$slides.eq(slide).outerHeight(),
width:base.$slides.eq(slide).outerWidth()
},base.options.speed,base.options.sliderEasing);
base.$slides.removeClass('current').eq(slide).addClass('current');
};
}else{
if(!base.$slides.is(':animated')){
if(base.options.createPagination){
base.$sliderControls.find('li').removeClass('current').eq(slide).addClass('current');
};
base.$slides.removeClass('current').eq(slide).addClass('current').fadeIn(base.options.speed,function(){
base.$slides.not('.current').hide();
});
};
};
if(base.options.autoSlide){
base.clearTimer();
base.beginTimer();
};
if(base.options.onSlide&&typeof(base.options.onSlide)=='function'){
base.options.onSlide();
};
base.$el.data('slides',{
current:slide
});
};
if(base.options.autoSlide){
base.clearTimer=function(){
if(base.timer){
window.clearInterval(base.timer);
};
};
base.beginTimer=function(){
base.timer=window.setInterval(function(){
base.toSlide('next');
},base.options.displayTime);
};
base.beginTimer();
if(base.options.pauseOnHover){
base.$el.hover(function(){
base.clearTimer();
},function(){
base.beginTimer();
});
};
};
if(base.options.createArrows){
$('<ul />',{
'class':'plusnav'
}).prependTo(base.$wrap);
base.$arrows=base.$wrap.find('.plusnav');
$('<li />',{
'class':'next',
text:base.options.nextText
}).prependTo(base.$arrows);
$('<li />',{
'class':'prev',
text:base.options.prevText
}).prependTo(base.$arrows);
base.$arrows.find('.next').click(function(){
base.toSlide('next');
});
base.$arrows.find('.prev').click(function(){
base.toSlide('prev');
});
};
if(base.options.keyboardNavigation){
base.$el.click(function(){
$('.active-plusslider').removeClass('active-plusslider');
$(this).addClass('active-plusslider');
});
$(window).keyup(function(e){
if(base.$el.is('.active-plusslider')){
if(e.keyCode==39){
base.toSlide();
}else if(e.keyCode==37){
base.toSlide('prev');
};
};
});
};
};
base.init();
};
$.plusSlider.defaults={
sliderType:'slider',
fullBleed:false,
width:false,
height:false,
defaultSlide:0,
displayTime:4000,
sliderEasing:'linear',
speed:500,
autoSlide:true,
keyboardNavigation:true,
pauseOnHover:true,
createArrows:true,
nextText:'Next',
prevText:'Previous',
createPagination:true,
paginationBefore:false,
paginationWidth:false,
paginationTitle:false,
onSlide:null
};
$.fn.plusSlider=function(options){
return this.each(function(){
(new $.plusSlider(this,options));
});
};
})(jQuery);