<script>
	import About from './About.svelte';
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';
	import Social from './Social.svelte';
	import Portfolio from './Portfolio.svelte';

	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { watchResize } from "svelte-watch-resize";

	//local vars
	let footerMouseOver;
	let footer;
	let reso;
	//this var set to setContext for studie propousal
	var showFooter = false;

	//imports from childs (in childs same name but "export" specification)
	let hideMenu;
	let showAbout;
	let showPortfolio;
	let modalMenu;
	let socialSide;
	let canvasSocialSide;
	let skillsEl;
	let whoEl;

	onMount(()=>{
		window.addEventListener("mousemove",handleMouseOutside);
		// console.dir(modalMenu);
		hideMenu=true; //for example this modified the hideMenu var original from the child exports it
	})

	const resize = ()=>{
		reso = window.innerWidth;
		if(reso<=640){
			showFooter=true;
		}
		if(reso>640){
			showFooter=false;
		}
	}

	const openFooter = ()=>{
		if(reso>640){
			openf=!openf;
		}
	}

	setContext('showingFooter', openFooter);

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
</script>


<main use:watchResize={resize} >
	<Nav bind:showAbout={showAbout} bind:showPortfolio={showPortfolio} bind:modalMenu={modalMenu} bind:hideMenu={hideMenu}></Nav>
	<Social bind:canvasSocialSide={canvasSocialSide} bind:socialSide={socialSide}></Social>

		{#if (showAbout)}
		<About bind:skillsEl={ skillsEl } bind:whoEl={ whoEl }></About>
	{/if}
	{#if (!showAbout)}
		<Portfolio></Portfolio>
	{/if}
	
	
	<Footer></Footer>
</main>

<style>
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
	@media (max-width: 640px) {
		main {
			background-color:chartreuse;
			width:100vw;
			max-width:100% !important;
			left:0;
			background-image: url('/images/galaxy-small.jpg');
			height:auto;
		
			background-color: burlywood;
			animation: backfloat2 55s linear infinite alternate;	
		}

	}

</style>