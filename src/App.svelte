<script>
	import About from './About.svelte';
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';
	import Social from './Social.svelte';
	import Portfolio from './Portfolio.svelte';

	import { onMount } from 'svelte';
	import { watchResize } from "svelte-watch-resize";

	//local vars
	let reso;
	let hideMenu=true;
	let modalMenu;
	let mainRef;
	//this var set to setContext for studie propousal

	//imports from childs (in childs same name but "export" specification)
	let showAbout;
	let showPortfolio;
	let socialSide;
	let canvasSocialSide;
	let skillsEl;
	let whoEl;

	onMount(()=>{
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		
		mainRef.addEventListener('change', ()=>{
		});

		reso = window.innerWidth;
		window.addEventListener("mousemove",handleMouseOutside);
		// console.dir(modalMenu);
		if(reso<640){
			mainRef.style.setProperty("height", "auto");
		}
		hideMenu=true; //for example this modified the hideMenu var original from the child exports it		
	})



	const resize = ()=>{
		reso = window.innerWidth;

		if(reso<640){
			mainRef.style.setProperty("height", "auto !important");
		}
		if(reso>640){
		}
	}

	//watch the mouse move for detect if is out or inside the element we pass it
	const matchElementEvent = (element, event)=>{
		let x = parseInt(event.clientX);
		let y = parseInt(event.clientY);
		// console.log("mouse x: "+x," mouse y: "+y);

		let top = parseInt(element.offsetTop);
		let bot = parseInt(element.offsetTop+element.offsetHeight);
		let left = parseInt(element.offsetLeft);
		let right = parseInt(element.offsetLeft+element.offsetWidth);
		// console.log("bot: "+bot+" top: "+top);
		// console.log("left: "+left+" right: "+right);

		if(y>bot || x>right || y<top || x<left){
			// console.log("hide element...");
			// console.log(true);
			// document.removeEventListener("mousedown", handleClickOutside);
			return true;	
		}
		else{
			// console.log("dont hide element...");
			// document.removeEventListener("mousedown", handleClickOutside);
			return false;
		}
	}

	//with helps from the function "matchElementEvent"
	//i setup here whats elements will be watching
	const handleMouseOutside = async(event)=> {
		if(hideMenu===false){
			if(matchElementEvent(modalMenu,event)){
				 hideMenu=true;
			}
			else{hideMenu=false};//is necesary?
		}

			if(matchElementEvent(canvasSocialSide,event)){
				socialSide.classList.remove("social-over");
			}
			else{
				socialSide.classList.add("social-over");
			}

			


	}  
	
	const clickMenu = ()=>{
		console.log("cliii");
            hideMenu=false;  
        }
</script>

{#if (!hideMenu)}
<div bind:this={modalMenu} class="menu-modal">
	<h4 class="menu-modal-item" style="color:white;background-color:black">Sergio David Posse</h4>
	{#if reso<640}
		<span>
			<Social></Social>
		</span>
	{/if}
    <span class="menu-modal-item" style="background-color:rgb(158, 226, 242,0);color:rgb(224, 255, 255,0.7);">Leave a message in this site</span>
    <!-- <span class="menu-modal-item" on:click={ ()=>{window.open('https://drive.google.com/file/d/1Dg5-hSmZ-FTeistvXn830X6BkWclCDDx/view?usp=sharing');} } style="background-color:rgb(224, 100, 100,0);color:rgb(224, 255, 255,0.7););">View my formal resume</span> -->
</div>
{/if}
<main bind:this={mainRef} use:watchResize={resize} >
	<img on:click={clickMenu} src="/images/menu.png" alt="menu"/>


	<Nav bind:showAbout={showAbout} bind:showPortfolio={showPortfolio}></Nav>
	{#if reso>	640}
	<Social bind:canvasSocialSide={canvasSocialSide} bind:socialSide={socialSide}></Social>
	{/if}

	{#if (showAbout)}
		<About bind:skillsEl={ skillsEl } bind:whoEl={ whoEl }></About>
	{/if}
	{#if (!showAbout)}
		<Portfolio></Portfolio>
	{/if}
	
	
	<Footer></Footer>
</main>

<style>
	img{
        width:4%;
        height:8%;
        padding:2%;
		top:0% !important;
		left:0;
        filter:invert();
        cursor:pointer;
		position:fixed;
		z-index:11000;
		object-fit: scale-down;
    }
	main {
		background-image: url('/images/galaxy-big.jpg');
		background-repeat: no-repeat;
		background-size: stretch;
		background-position: center center;
		background-color:black;
		width:100vw;
		max-width: 100%;
		height:100vh;
		max-height:100%;
		text-align: center;
		margin:0;
		padding:0 !important;
		animation: backfloat 5s infinite alternate;
		display:flex;
		flex-direction:column;
		z-index:600;
	}
	@keyframes backfloat{
		0%{
			background-size: 110% 110%;
		}
		100%{
			background-size: 100% 100%;
		}
	}
	@keyframes backfloat2{
		0%{
			background-size: 300% 300%;
		}
		100%{
			background-size: 100% 100%;
		}
	}
	.menu-modal{
        border-radius:0 0 6% 0;
        position: absolute;
        left:0;
        top:0;
        display:flex;
        flex-direction:column;
        /* align-items: stretch; */
        /* align-content:space-between; */
        justify-content: space-evenly;
        height:50%;
        width:20%;
        background-color: black;
        z-index: 34500 !important;
        color:black;
        filter: drop-shadow(16px 16px 20px rgb(255, 255, 255));
		text-align: center;
    }
    .menu-modal span{
        cursor:pointer;
        display:flex;
        justify-content: center;
        align-content:center;
        align-items:center;
        text-align: center;
        height:20%;
    }
    .menu-modal span:hover{
        border:1px solid rgb(148, 140, 25);
        background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);

        /* transition:1s; this give me error with the mouseout event*/
    }
	h4{
        opacity: 0.2;
    }

	@media (max-width: 640px) {
		main {
			background-color:chartreuse;
			width:100vw;
			max-width:100% !important;
			left:0;
			height:auto;
			background-image: url('/images/galaxy-small.jpg');		
			background-color: burlywood;
			animation: none !important;	
		}
		.menu-modal{
			height: calc(var(--vh, 1vh) * 70);
			font-size: calc(var(--vh, 1vh) * 3);
			padding: calc(var(--vh, 1vh)* 1);
            width:80% !important;
            border-radius:0 0 0 0;

        }
		img{
			position:fixed;
			top:7vh !important;
			left:1vw;
            width:13vw;
			height:8vh;
			z-index:110000;
        }

	}

</style>