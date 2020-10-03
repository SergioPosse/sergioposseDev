<script>

import { onMount, tick } from 'svelte';
import {fade} from 'svelte/transition';



//function stackoverflow answered Nov 24 '14 at 21:44 by EscapeNetscape
//https://stackoverflow.com/questions/17567344/detect-left-right-swipe-on-touch-devices-but-allow-up-down-scrolling
function detectswipe(el,func) {
  swipe_det = new Object();
  swipe_det.sX = 0;
  swipe_det.sY = 0;
  swipe_det.eX = 0;
  swipe_det.eY = 0;
  var min_x = 20;  //min x swipe for horizontal swipe
  var max_x = 40;  //max x difference for vertical swipe
  var min_y = 40;  //min y swipe for vertical swipe
  var max_y = 50;  //max y difference for horizontal swipe
  var direc = "";
  ele = document.getElementById(el);
  ele.addEventListener('touchstart',function(e){
    var t = e.touches[0];
    swipe_det.sX = t.screenX; 
    swipe_det.sY = t.screenY;
  },false);
  ele.addEventListener('touchmove',function(e){
    e.preventDefault();
    var t = e.touches[0];
    swipe_det.eX = t.screenX; 
    swipe_det.eY = t.screenY;    
  },false);
  ele.addEventListener('touchend',function(e){
    //horizontal detection
    if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y)))) {
      if(swipe_det.eX > swipe_det.sX) direc = "r";
      else direc = "l";
    }
    //vertical detection
    if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x)))) {
      if(swipe_det.eY > swipe_det.sY) direc = "d";
      else direc = "u";
    }

    if (direc != "") {
      if(typeof func == 'function') func(el,direc);
    }
    direc = "";
  },false);  
}

    let works = {
        0:{
            "url": "/images/a.jpg",
            "title": "Proyecto 01",
            "description": "Proyecto 1 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        1:{
            "url": "/images/b.jpg",
            "title": "Proyecto 02",
            "description": "Proyecto 2 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        
        2:{
            "url": "/images/c.jpg",
            "title": "Proyecto 03",
            "description": "Proyecto 3 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        
        3:{
            "url": "/images/d.jpg",
            "title": "Proyecto 04",
            "description": "Proyecto 4 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        
        4:{
            "url": "/images/e.jpg",
            "title": "Proyecto 05",
            "description": "Proyecto 5 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        
        5:{
            "url": "/images/f.jpg",
            "title": "Proyecto 06",
            "description": "Proyecto 6 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        
        6:{
            "url": "/images/g.jpg",
            "title": "Proyecto 07",
            "description": "Proyecto 7 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
        
        7:{
            "url": "/images/h.jpg",
            "title": "Proyecto 08",
            "description": "Proyecto 8 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"
        },
    }


    let selected=0;
    let carouselRef;
    let firstRef, prevRef, nextRef;

    let animate=false;
    
    const handleClickNext = async ()=>{
        for(let i=0; i<Object.keys(works).length; i++){
            if(works[selected]===works[i]){
                console.log("selected work: "+works[selected]);
                console.log("selected i : "+works[i]);
                if(works[selected+1]){
                    selected++
                    console.log("sel: "+selected);
                    break;
                }
                else{
                    selected = 0;
                    break;
                }          
            }     
        }
        setTimeout(()=>{
            animate=false;
            setCarousel();
        },400);
        animate=true;
        
    }

    const handleClickPrev = async ()=>{
        for(let i=0; i<Object.keys(works).length; i++){
            if(works[selected]===works[i]){
                console.log("selected work: "+works[selected]);
                console.log("selected i : "+works[i]);
                if(works[selected-1]){
                    selected--
                    console.log("sel: "+selected);
                    break;
                }
                else{
                    selected = Object.keys(works).length-1;
                    break;
                }          
            }     
        }
        setTimeout(()=>{
            animate=false;
            setCarousel();
        },400);
        animate=true;
        
    }

    const setCarousel = ()=>{
        let current,next,prev;
        current = works[selected];
        (selected-1<0) ? prev =  works[Object.keys(works).length-1] : prev = works[selected-1];
        (selected+1>Object.keys(works).length-1) ? next = works[0] : next = works[selected+1];

        firstRef.innerHTML = current.title;
        firstRef.style.setProperty('background-image', "url("+current.url+")");
        prevRef.innerHTML = prev.title;
        prevRef.style.setProperty('background-image', "url("+prev.url+")");
        nextRef.innerHTML = "<p>"+next.title+"</p>";
        nextRef.style.setProperty('background-image', "url("+next.url+")");
        
    }

    onMount(()=>{
        console.log(works[0]);
        console.log(Object.keys(works).length)
        setCarousel(); 
    })


    let xDown;

    const handleTouch = (e)=>{
        console.dir(e)
        xDown = e.touches[0].clientX;                                      
    }
    const handleTouchMove = (e)=>{
        if ( ! xDown ) {
            return;
        }
        let xUp = e.touches[0].clientX;                                    
        let xDiff = xDown - xUp;
        if ( xDiff > 0 ) {
            handleClickPrev(); 
        } else {
            handleClickNext(); 
        }
        /* reset values */
        xDown = null;
    }


</script>

        <div bind:this={carouselRef} class="carousel">
            <div class="carousel-content">
                  
                        <div  on:click={handleClickPrev} bind:this={prevRef} class="prev"></div>
                 
                        <div id="first1" on:touchstart={(e)=>handleTouch(e)} on:touchmove={(e)=>{handleTouchMove(e)}} transition:fade bind:this={firstRef} class={animate? "first animationtesteo" : "first"}></div>
                 
                        <div  on:click={handleClickNext} bind:this={nextRef} class="next"></div>
         
                    <!-- <button  on:click={handleClickNext} class="next-button">Next</button> -->
            </div>
                    
        </div>
    
<style>

.carousel{
    margin:auto;
    width:80%;
    height:96%;
    flex-direction:column-reverse;
    display: flex;
    align-items: center;
    /* background-color: blue; */
    position:relative;
    text-align: center;
   }
   .carousel-content{
       display:flex;
       align-content: center;
       justify-content: center;
       align-items:center;
   }

.first {
    position:absolute;
    background-size:cover;
    background-position: center center;
    /* background-color:rgba(255, 255, 255, 0.8); */
    background-repeat: no-repeat;
    width:50%;
    height:70%;
    top:10%;
    z-index:66 !important;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
    transition:1s;
    /* border:1px solid red; */
}
.first:hover{
    width:55%;
    height:75%;
}
.next {
    position:absolute;
    right:0;
    top:17%;
    background-size:cover;
    /* background-color: rgb(165, 42, 159); */
    width:30%;
    height:50%;
    z-index:65;
    box-shadow: 0 15px 18px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transition: 1s;
    /* border:1px solid yellow; */
}

.next:hover{
    cursor:pointer;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
    transition:1s;
}
.prev:hover{
    cursor:pointer;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
    transition:1s;
}
.prev {
    position:absolute;
    left:0;
    top:17%;
    background-size:cover;
    /* background-color: rgb(165, 42, 159); */
    width:30%;
    height:50%;
    z-index:65 !important;
    transition: 1s;
    box-shadow: 0 15px 18px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /* border:1px solid fuchsia; */
}

.animationtesteo{animation: testeo 2s linear infinite !important;}
@keyframes testeo{0%{}50%{width:55%;height:75%;}100%{left:45%;}
}
@keyframes testeosmall{0%{}50%{width:85%;height:55%;}100%{left:45%;}
}

@media (max-width: 640px){

.animationtesteo{animation: testeosmall 2s linear infinite !important;}

    
.carousel{
    margin-left:auto;
    width:75vw;
    height:100vh;
    display: flex;
    align-items: center !important;
    justify-content: center !important;
    align-content: center !important;
    justify-items: middle !important;
    position:relative;
    text-align: center;
    vertical-align: middle;
}
.carousel-content{
    height:30% !important;
    display:flex;
    align-self:center;
    justify-self:center;
   }
   .first{
       top:20%;
       height:50%;
       width:80%;
       z-index:2000;
   }
   .prev{
       top:25%;
       height:35%;
       width:80%;
   }
   .next{
    top:25%;
       height:35%;
       width:80%;
   }
   .first:hover{
    width:90vw;
    height:55%;

}

}
</style>