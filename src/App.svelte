<script>
	import About from './About.svelte';
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';
	import Social from './Social.svelte';
	import Portfolio from './Portfolio-OLDVERSION.svelte';
	import { onMount } from 'svelte';
	import { watchResize } from "svelte-watch-resize";

	//local vars
	let reso;
	let hideMenu=true;
	let modalMenu;
	let mainRef;
	//this var set to setContext for studie propousal

	//imports from childs (in childs same name but "export" specification)
	let showAbout=false;
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
	<h6 class="menu-modal-item" style="margin-top:-10%;color:white;background-color:weat;">Software Developer</h6>
	<h5 class="email" style="color:white;cursor:default;padding:3%;">Sergiodavidposse@gmail.com</h5>
	{#if reso<640}
		<span>
			<Social></Social>
		</span>
	{/if}
    <button class="quick-button">Quick message</button>
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
	.quick-button ,.quick-button:hover{
		behavior: inherit;
		cursor:pointer;
		width:80%;
		display:flex;
		align-self:center;
		justify-content: center;
		border:1px solid rgb(35, 34, 43);
		border-radius:25px;
		padding:2%;
		color:var(--l-purple);
		box-shadow:0px 1px 6px var(--dark);
		background-color:var(--main-purple);
		outline:none;
		z-index:5000;
	}
	.quick-button:focus:hover{
		background-color:var(--h-purple);
		border:none;
		user-select: none;
		box-shadow:0px 1px 6px rgb(37, 34, 34);
		outline:none;
	}

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
		background-color:var(--dark-alpha);
		width:100vw;
		max-width: 100%;
		height:100vh;
		max-height:100%;
		text-align: center;
		margin:0;
		padding:0 !important;
		display:flex;
		flex-direction:column;
		z-index:600;
		overflow:hidden;
	}
	main::before {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: -1;
			background-image: url('/images/galaxy-big.jpg');
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
			animation: backfloat 7s ease infinite alternate !important;	
		}
	@keyframes backfloat{
		0%{
			transform: scale(1,1);
		}
		100%{
			transform: scale(1.5,1.5);
		}
	}
	@keyframes backfloat2{
		0%{
			transform: scale(1,1);
		}
		100%{
			transform: scale(1.7,1.7);
		}
	}
	.menu-modal{
        position: absolute;
        left:0;
        top:0;
        display:flex;
        flex-direction:column;
        justify-content: space-evenly;
        height:50%;
        width:20%;
        background-color:var(--dark);
        z-index: 34500 !important;
        color:var(--dark);
        filter: drop-shadow(16px 16px 20px var(--l-purple));
		text-align: center;
		padding:2%;
    }
	.menu-modal:before{
		position:absolute;
		border:1px solid var(--h-purple);
		width:90%;
		height:90%;
		display:flex;
		align-self:center;
		align-items: center;
		align-content:center;
		justify-content: center;
		justify-items:center;
		content:"";
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
    .menu-modal .email{
		background: linear-gradient(14deg, var(--main-purple-beta) 10%, var(--h-purple) 79%);
		color:var(--l-purple) !important;
		cursor:text !important;
		font-size:1vw;
    }
	h4{
        opacity: 0.4;
    }
	@media (max-width: 640px) {
		main::before {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: -1;
			background-image: url('/images/the-night-sky-2401702_1920.jpg');
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
			animation: backfloat2 6s ease-in-out infinite alternate !important;	
		}
		main {
			overflow:hidden;
			width:100vw;
			max-width:100% !important;
			left:0;
			height:auto;
			background-image: none;
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
		.menu-modal .email{
			width:80%;
			display:flex;
			align-self:center;
			text-align:center;
			font-size:90%;
		}
	}
</style>