<script>

import { onMount } from 'svelte';
import { watchResize } from "svelte-watch-resize";


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
    let overRef;
    let url = false;
    let animate=false;
    let reso;
    let animDuration;
    
    const handleClickNext = async ()=>{

        animate=true; //first animation happend with current image and then when TIMEOUT change the selected work

        setTimeout(()=>{
            animate=false;
            let el = document.querySelector('.first-menu');
            el.classList.remove("fade");
            void el.offsetWidth; // trigger a DOM reflow //taken from stackoverflow
            el.classList.add("fade");
            el = document.querySelector('.first-front');
            el.classList.remove("fade");
            void el.offsetWidth; // trigger a DOM reflow //taken from stackoverflow
            el.classList.add("fade");
            for(let i=0; i<Object.keys(works).length; i++){
                if(works[selected]===works[i]){
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
            setCarousel();
        },animDuration); //this is the complete time for the multiple animation "testeo" and "testeo2" from the class .animationtesteo
        //wich is loaded dinamically with the boolear var "animate" in the html div tag   
    }

    const handleClickPrev = async ()=>{
        animate=true;
        setTimeout(()=>{
            animate=false;
            let el = document.querySelector('.first-menu');
            el.classList.remove("fade");
            void el.offsetWidth; // trigger a DOM reflow //taken from stackoverflow
            el.classList.add("fade");
            el = document.querySelector('.first-front');
            el.classList.remove("fade");
            void el.offsetWidth; // trigger a DOM reflow //taken from stackoverflow
            el.classList.add("fade");
            for(let i=0; i<Object.keys(works).length; i++){
                if(works[selected]===works[i]){
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
            setCarousel();
        },animDuration);
    }

    const setCarousel = ()=>{
        let current;
        // let prev,next;
        current = works[selected];
        // (selected-1<0) ? prev =  works[Object.keys(works).length-1] : prev = works[selected-1];
        // (selected+1>Object.keys(works).length-1) ? next = works[0] : next = works[selected+1];
        // console.dir(firstRef.parentNode.lastChild);
        // if(firstRef.parentNode.lastChild.localName === "h3"){
        //     firstRef.parentNode.removeChild(firstRef.parentNode.lastChild);
        // }
        // let newEl = document.createElement("h3");
        // let text = document.createTextNode(current.title);
        // newEl.appendChild(text);
        // newEl.style.setProperty('padding', "0.3vw");
        // firstRef.parentNode.appendChild(newEl);
        // firstRef.style.setProperty('background-image', "url("+current.image+")");
        // firstRef.style.setProperty('animation',"fade 1s linear forwards")
        current.url!="" ? url = true : url=false;
    }

    onMount(()=>{
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        // console.log(works[0]);
        // console.log(Object.keys(works).length)
        reso = window.innerWidth;

        reso < 640 ? animDuration=200 : animDuration=1000;
        setCarousel(); 
    })

	const resize = ()=>{
		reso = window.innerWidth;
	}


    //mobile behaviour for touch instead mouse
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

    const seeDescription = ()=>{
        let el = overRef

        el.style.setProperty('display','flex');
        el.style.setProperty('opacity','100%');

        document.querySelector('.over-background').style.setProperty("opacity","80%");
        document.querySelector('.over-background').style.setProperty("z-index","1000000");
        document.querySelector('.first').style.setProperty("opacity","0%");
        document.querySelector('.next').style.setProperty("opacity","0%");
        document.querySelector('.prev').style.setProperty("opacity","0%");
        el.classList.remove("animate");
        void el.offsetWidth; // trigger a DOM reflow //taken from stackoverflow
        el.classList.add("animate");

    }
    const closeDescription = ()=>{
        let el = overRef
        el.style.setProperty('opacity','0%');
        document.querySelector('.over-background').style.setProperty("opacity","0%");
        document.querySelector('.over-background').style.setProperty("z-index","1000");

        document.querySelector('.first').style.setProperty("opacity","100%");
        document.querySelector('.next').style.setProperty("opacity","100%");
        document.querySelector('.prev').style.setProperty("opacity","100%");

    }

    
</script>
<div class="over-background" on:click={closeDescription}>
    <div class="over animate" bind:this={overRef}>
        <h1 on:click={closeDescription}>X</h1>
        <p>{works[selected].description}</p>
    </div>
</div>


        <div class="carousel" use:watchResize={resize}>
                  
                        <div  on:click={handleClickPrev} class="prev">
                            <img src="/images/play.png" alt="previous" class="prev-button"/>
                        </div>
                 

                        <div class={animate? "first animationtesteo" : "first"} on:touchstart={(e)=>handleTouch(e)} on:touchmove={(e)=>{handleTouchMove(e)}}>
                            

                            <h3 class="fade">{works[selected].title}</h3>

                            <div class="first-front fade">
                                <img src={works[selected].image} alt="project-img"/>
                            </div>
                            
                            <div class="first-menu fade">
                                <div class="git-over" on:click={()=>{window.open(works[selected].giturl)}}><img src="/images/git-over.png" alt="git"/><h4>Code</h4></div>
                                <div class={url? "url-over visible" : "url-over invisible"} on:click={()=>{window.open(works[selected].url)}}  ><img src="/images/url-over.png" alt="git"/><h4>Web Site</h4></div>
                                <button on:click={seeDescription}  class="see-description">See description ...</button>
                            </div>
                            
                            <!-- <div class="first-image" bind:this={firstRef}>
                                
                            </div> -->
                            <img class="swipe" alt="handtouch" src="/images/swipe.png"/>
                            <!-- <img class="touch" alt="handtouch" src="/images/handtouch.png"/> -->
                        </div>
                 



                        <div  on:click={handleClickNext} class="next">
                            <img src="/images/play.png" alt="previous" class="next-button"/>
                        </div>
         
                    
        </div>
    
<style>

.fade{
    animation:fade 1.5s linear forwards !important;
}
.over-background{
     position:absolute;
    left:0;
    top:0;
    width:100vw;
    height:100vh;
    background-color:rgb(0,0,0,100%);
    opacity:0%;
}
.animate{
    animation: bringover 0.5s cubic-bezier(0,1,.37,.32) forwards;
}
.invisible{
    cursor:none;
    filter:grayscale(100);
    pointer-events:none;

}
/* .first:hover .first-image{
    opacity:0%;
}
.first:hover .over{
    display:flex;
    opacity:100%;
    transition: all 0.8s;
    transition-delay: 1s;
    animation: bringover 0.5s cubic-bezier(0,1,.37,.32) forwards;
}
} */
.first {
    font-size: calc(var(--vh, 1vh) * 1.7);
    color:rgb(206, 193, 175);
    position:relative;
    background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);
    width:70%;
    height:70%;
    top:10%;
    z-index:656666 !important;
    box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678);
    display:flex;
    flex-direction:row;
    align-items:center;
    align-content:center;
}

.first h3{
    position:absolute;
    left:10%;
    top:0;
}
.first-front{
    display:flex;
    flex-direction:row;
    width:85%;
    align-items:center;
    justify-content: center;
    opacity:0%;

}
.first-menu{
    display:flex;
    flex-direction:column;
    width:15%;
    align-items:center;
    justify-content: space-evenly;
    padding-right:1.8rem;
}
.first-front img{
    width:90%;
    height:90%;
    object-fit: contain;
    
}
.first-menu button{
    background:transparent;
    width:80%;
    cursor:pointer; 
    border:none;
    color:rgb(190, 175, 175);
    text-decoration: underline;
}
.over{
    position:absolute;
    display:none;
    padding:1rem;
    flex-direction:row-reverse;
    width:50%;
    top:15%;
    height:50%;
    z-index:66336 !important;
    margin:auto;
    font-size: calc(var(--vh, 1vh) * 1);
    opacity:100%;
    justify-content:center;
    justify-items:center;
    align-items:center;
    align-content:center;
}

.git-over,.url-over{
    width:80% !important;
    cursor:pointer;
    display:flex;
    justify-content: space-evenly;
    align-items:center;
    padding:0.3rem;
    flex-direction: column;
    opacity:100% !important;
    font-size: calc(var(--vh, 0.7vh) * 2);
    /* box-shadow: 0 15px 18px 0 rgba(211, 255, 251, 0.4), 0 6px 20px 0 rgba(255, 254, 254, 0.678); */
    object-fit: contain;

}
.git-over img, .url-over img{
    width:40%;
    object-fit: contain;
}

.over p{
    background-color:rgb(201, 147, 206);
    text-align:center;
    padding:1rem;
    color:rgba(4, 3, 5, 0.541);
    font-size: calc(var(--vh, 1vh) * 3);
    transition: all 0.8s;
    width:70%;
    height:60%;
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

.next {
    position:absolute;
    right:0;
    top:17%;
    display:flex;
    background: linear-gradient(14deg, rgb(45, 20, 77,0.35) 50%, rgb(66, 7, 46,0.35) 50%);
    width:30%;
    height:50%;
    z-index:656665;
    box-shadow: 0 15px 18px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /* border:1px solid yellow; */
}

.prev:hover,.next:hover{
    cursor:pointer;
}

.prev {
    display:flex;
    position:absolute;
    left:0;
    top:17%;
    background: linear-gradient(14deg, rgb(45, 20, 77,0.35) 50%, rgb(66, 7, 46,0.35) 50%);
    width:30%;
    height:50%;
    z-index:656665 !important;
    box-shadow: 0 15px 18px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /* border:1px solid fuchsia; */
}
.prev-button{
    transform:rotate(180deg);
    left:10%;  
}
.next-button{
    right:10%;
}
.prev-button,.next-button{
    top:35%;
    position: absolute;
    filter:invert();
    width:20%;
    object-fit: contain;
}

.animationtesteo{
    animation-name: testeo, testeo2;
    animation-duration: 500ms, 500ms;
    animation-delay: 0ms,500ms !important; /* add this */
    animation-timing-function: linear, linear;
    animation-fill-mode: forwards, initial;

}
@keyframes testeo{
    0%{
    }
    100%{
        transform:scale(1.1,1.1);
    }
}
@keyframes testeo2{
    0%{
        transform:scale(1.1,1.1);

    }
    100%{
        transform:scale(1.1,1.1);

        transform: translateY(1000%);
    }
}
@keyframes bringover{
        0%{
            transform:translateX(0%);
            opacity:20%;
        }
        80%{ transform:translateX(50%);}
        85%{
            transform:translateX(47%);
        }
        90%{
            transform:translateX(50%);
        }
        95%{
            transform:translateX(47%);
        }
        100%{
            transform:translateX(50%);
            opacity:100%;
        }
    }
    @keyframes bringoversmall{
        0%{
            transform:translateY(-500%);
            opacity:20%;
        }
        100%{
            transform:translateY(-20%);
            opacity:100%;
        }
    }
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
            transform:translateX(-20%);
        }
        100%{
            transform:translateX(200%);
            visibility: hidden;
        }

    }

@keyframes testeosmall{
    0%{
    }
    100%{
        transform: translateX(5%);
    }
}
@keyframes fade{
    0%{opacity:0%;}100%{opacity: 100%;}
}

@media (max-width: 640px){

.animationtesteo{
    animation-name: testeosmall;
    animation-duration: 400ms;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}
.prev-button,.next-button{
    visibility: hidden;
}
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
    width:90%;
    left:-7%;
    border:1px solid white;
   }
.next{
    background: linear-gradient(14deg, rgb(45, 20, 77,1) 50%, rgb(66, 7, 46,1) 100%);   
    border:1px solid white;
    top:23%;
    left:-2.5%;
    height:65%;
    width:90%;
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
.over p{
    background-color:rgb(201, 147, 206);
    text-align:center;
    height:30%;
    padding:1rem;
    color:rgba(4, 3, 5, 0.541);
    font-size: calc(var(--vh, 1vh) * 2);
}

/* .first:hover .over{
    display:flex;
    flex-direction:row-reverse;
    opacity:100%;
    flex-wrap:wrap;
    justify-items:stretch;
    align-items:center;
    justify-content: space-evenly;
} */
.swipe{
    visibility: visible;
    animation: swipe 1s alternate forwards;
    animation-iteration-count: 3;
}
.first {
    display:flex;
    flex-direction:column;
    align-items:center;
    align-content:center;
    justify-content: center;
   
}
.first h3{
    align-self:center;
}
.first-front{
    display:flex;
    flex-direction:row;
    width:98%;
    height:auto;
    align-items:center;
    justify-content: center !important;
    justify-items:center;
    justify-content: center;
    opacity:0%;
}
.first-menu{
    display:flex;
    flex-direction:row;
    width:80%;
    height:auto;
    align-items:center;
    justify-content: center !important;
    align-self:center;
    padding-left:2rem;
    padding-top:1rem;
}
.first-front img{
    width:90%;
    height:100%;  
}
.first-menu button{
    background:transparent;
    width:100%;
    cursor:pointer; 
    border:none;
    color:rgb(190, 175, 175);
    text-decoration: underline;
}
.animate{
    animation: bringoversmall 0.5s cubic-bezier(0,1,.37,.32) forwards;
}
.see-description{
    position:absolute;
    bottom:2%;
    left:0%;
    padding:1.4rem;
}
}
</style>