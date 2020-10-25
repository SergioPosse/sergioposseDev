<script>

import { onMount } from 'svelte';

    let works = {
        0:{
            "image": "/images/appogif.gif",
            "url": "",
            "giturl": "https://github.com/SergioPosse/Appointment-Patients-System---MERN",
            "title": "Medical-Care RioIV - Appointments System for administration",
            "description": "Reactjs introducing hooks to my toolbox and making a calendar from scratch. The database is in the cloud Mongodb ATLAS"
        },
        1:{
            "image": "/images/blogphp.gif",
            "url":"https://sergioposse-blogphp.herokuapp.com/",
            "giturl": "https://github.com/SergioPosse/phpblogMVC",
            "title": "Blog PHP",
            "description": "A nice and simple blog, made from scratch with php and mysql. Learning the MVC arquitecture. Frontend made with materialize and the deploy was on Heroku with ClearDb"
        },
        
        2:{
            "image": "/images/siloh.gif",
            "url": "https://siloh-fumigacion.herokuapp.com/",
            "giturl": "https://github.com/SergioPosse/SilohFumigacion",
            "title": "Siloh Fumigacion",
            "description": "Attention! Password for 'Administrador' is 'admin', for 'Empleado' is 'empleado'. Task manager for a small group of control plague professionals. Materialize and vanilla javascript with xmlhttprequest and PHP backend"
        } 
    }


    let selected=0;
    let carouselRef;
    let firstRef, prevRef, nextRef,pRef;

    let url = false;

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

        console.dir(firstRef.parentNode.lastChild);
        if(firstRef.parentNode.lastChild.localName === "h3"){
            firstRef.parentNode.removeChild(firstRef.parentNode.lastChild);
        }
        let newEl = document.createElement("h3");
        let text = document.createTextNode(current.title);
        newEl.appendChild(text);
        
        newEl.style.setProperty('padding', "0.3vw");
        firstRef.parentNode.appendChild(newEl);
        firstRef.style.setProperty('background-image', "url("+current.image+")");
        if(current.url!=""){
            url = true;
            console.log("url: "+current.url);
        }
        else{
            url=false;
        }
        pRef.innerHTML = current.description;
        prevRef.innerHTML = prev.title;
        prevRef.style.setProperty('background-image', "url("+prev.image+")");
        nextRef.innerHTML = "<p style='color:white;'>"+next.title+"</p>";
        nextRef.style.setProperty('background-image', "url("+next.image+")");
        
    }

    onMount(()=>{
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
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
                  
                        <div  on:click={handleClickPrev} bind:this={prevRef} class="prev"></div>
                 
                        <div on:touchstart={(e)=>handleTouch(e)} on:touchmove={(e)=>{handleTouchMove(e)}} class={animate? "first animationtesteo" : "first"}>
                            <div class="over">
                                <div class="git-over" on:click={()=>{window.open(works[selected].giturl)}}><img src="/images/git-over.png" alt="git"/><h4>Code</h4></div>
                                <div on:click={()=>{window.open(works[selected].url)}} class={url? "url-over visible" : "url-over invisible"} ><img src="/images/url-over.png" alt="git"/><h4>Web Site</h4></div>
                                <p bind:this={pRef} ></p>
                            </div>
                            <div class="first-image" bind:this={firstRef}></div>
                            <img class="swipe" alt="handtouch" src="/images/swipe.png"/>

                            <img class="touch" alt="handtouch" src="/images/handtouch.png"/>
                        </div>
                 
                        <div  on:click={handleClickNext} bind:this={nextRef} class="next">
                        </div>
         
                    
        </div>
    
<style>
    .swipe{
        filter:invert();
        position:absolute;
        left:10%;
        bottom:10%;
        width:30%;
        object-fit: scale-down;
        visibility: hidden;
    }
    @keyframes swipe{
        0%{
            left:10%;
        }
        100%{
            left:70%;
            visibility: hidden;
        }

    }
    .touch{
        filter:invert();
        position:absolute;
        right:3%;
        top:5%;
        width:37%;
        object-fit: scale-down;
        visibility: hidden;

    }
    @keyframes touch{
        0%{
            right:30%;
            top:30%;
        }
        50%{
            right:30%;
            top:30%;
        }
        75%{
            right:30%;
            top:30%;
            /* width:20%; */
            transform:scale(1.1);

        }
        85%{
            right:30%;
            top:30%;
            /* width:35%; */
            transform:scale(1.0);
        }
        90%{
            right:30%;
            top:30%;
            /* width:25%; */
            transform:scale(1.1);

        }
        100%{
            right:30%;
            top:30%;
            /* width:30%; */
            transform:scale(1.0);
            display:none;
            visibility: hidden;
        }
    }

.invisible{
    cursor:none;
    filter:grayscale(100);
    pointer-events:none;

}
.first:hover .first-image{
    opacity:0%;
}
.first:hover .over{
    display:flex;
    opacity:100%;

}
.first:hover .git-over,.url-over{
    cursor:pointer;
}

.over{
    position:absolute;
    display:none;
    padding:1rem;
    flex-direction:row-reverse;
    width:90%;
    height:80%;
    z-index: 10000;
    margin:auto;
    font-size: calc(var(--vh, 1vh) * 1);
;
}
.over img{
    width:50%;
}
.git-over,.url-over{
    display:flex;
    justify-content: center;
    align-items:center;
    padding:0.7rem;
    flex-direction: column;
    height:30%;
    width:20%;
    border:1px solid black;
    margin:0.7rem;
    background-color:white;
    opacity:100% !important;
    font-size: calc(var(--vh, 1vh) * 2);

    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);

}
.over p{
    background-color:rgb(201, 147, 206);
    text-align:center;
    padding:1rem;
    color:rgba(4, 3, 5, 0.541);
    font-size: calc(var(--vh, 1vh) * 3);
;

}

.first-image{
    width:80%;
    height:80%;
    background-size:cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 19999;
    margin:auto;
    display:flex;
    margin-top:1%;

}
.carousel{
    margin:auto;
    width:80%;
    height:96%;
    flex-direction:column;
    display: flex;
    align-items: center;
    /* background-color: blue; */
    position:relative;
    text-align: center;
    flex-wrap:wrap;
   }

.first {
    font-size: calc(var(--vh, 1vh) * 1.7);
    color:rgb(206, 193, 175);
    position:relative;
    background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);
        /* background-color:rgba(255, 255, 255, 0.8); */
     width:70%;
    height:70%;
    top:10%;
    z-index:66333 !important;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
    /* border:1px solid red; */
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
    /* border:1px solid yellow; */
}

.next:hover{
    cursor:pointer;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
}
.prev:hover{
    cursor:pointer;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
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
    box-shadow: 0 15px 18px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /* border:1px solid fuchsia; */
}

.animationtesteo{animation: testeo 2s linear infinite !important;}
@keyframes testeo{0%{}50%{width:55%;height:75%;}100%{left:45%;}
}
@keyframes testeosmall{
    0%{
    }
    50%{
        width:85%;
        height:55%;
    }
    100%{
        left:45%;
    }
}

@media (max-width: 640px){

.animationtesteo{animation: testeosmall 2s linear infinite !important;}

.carousel{
    margin-left:auto;
    height: calc(var(--vh, 1vh) * 95);
    height: calc(var(--vh, 1vh) * 100);
    display: flex;
    align-items: center !important;
    justify-content: center !important;
    align-content: center !important;

    text-align: center;
}

   .first{
       top:0%;
       height:65%;
       width:90% !important;
       z-index:800;

   }
   .prev{
    top:27% !important;
    height:65%;
    width:80%;
    left:5%;
    border:1px solid white;

   }
   .next{
       border:1px solid white;
    top:23%;
    left:8%;
    height:65%;
    width:81%;
   }
   .first:hover{
    width:90vw;
    height:65%;
}

.over{
    position:absolute;
    display:none;
    padding:1rem;
    flex-direction:row-reverse;
    width:90%;
    height:80% !important;
    z-index: 10000;
    margin:auto;
}
.over img{
    width:50%;
}
.git-over,.url-over{
    display:flex;
    justify-content: center;
    align-items:center;
    padding:0.7rem;
    flex-direction: row;
    height:20% !important;
    width:20%;
    border:1px solid black;
    margin:0.7rem;
    background-color:white;
    opacity:100% !important;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);

}
.over p{
    background-color:rgb(201, 147, 206);
    text-align:center;
    height:30%;
    padding:1rem;
    color:rgba(4, 3, 5, 0.541);
    font-size: calc(var(--vh, 1vh) * 2);
}
.first:hover .over{
    display:flex;
    flex-direction:row-reverse;
    opacity:100%;
    flex-wrap:wrap;
    justify-items:stretch;
    align-items:center;
    justify-content: space-evenly;

}
    .swipe{
        visibility: visible;
        animation: swipe 1s alternate forwards;
        animation-iteration-count: 3;
    }
    .touch{
        visibility:visible;
        animation: touch 0.8s linear forwards;
        animation-iteration-count: 4;
    }

}
</style>