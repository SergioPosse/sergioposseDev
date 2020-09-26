<script>
	import About from './About.svelte';
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';
	import Social from './Social.svelte';
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { watchResize } from "svelte-watch-resize";


	var showFooter = false;
	let openf=false;
	let reso;


	let hideMenu;

	let modalMenu;
	let socialSide;
	let canvasSocialSide;

	onMount(()=>{
		window.addEventListener("mousemove",handleMouseOutside);
		console.dir(modalMenu);
		hideMenu=true;
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
	

	let skillsEl;
	let whoEl;

	// const handleTouchMove = (e)=>{

	// let touchLocation = e.targetTouches[0];
	// console.log(touchLocation);
	// let pageX = Math.floor((touchLocation.screenX-touchLocation.target.offsetWidth)) + "px";
	// let pageY = Math.floor((touchLocation.screenY-touchLocation.target.offsetHeight)) + "px";
	// console.log("pagex: "+pageX);
	// console.log("pagey: "+pageY);
	//    let x =pageX;
	//    let y =pageY;

	//  	skillsEl.style.setProperty('--x', x + 'px');
	//  	  skillsEl.style.setProperty('--y', y + 'px');

	//  	whoEl.style.setProperty('--x', x + 'px');
	//  	  whoEl.style.setProperty('--y', y + 'px');
	// }

	const openFooter = ()=>{
		if(reso>640){
			openf=!openf;
		}
	}

	setContext('showingFooter', openFooter);

	const matchElementEvent = (element, event)=>{
		let x = parseInt(event.clientX);
		let y = parseInt(event.clientY);
		console.log("mouse x: "+x," mouse y: "+y);


		let top = parseInt(element.offsetTop);
		let bot = parseInt(element.offsetTop+element.offsetHeight);
		let left = parseInt(element.offsetLeft);
		let right = parseInt(element.offsetLeft+element.offsetWidth);
		console.log("bot: "+bot+" top: "+top);
		console.log("left: "+left+" right: "+right);


		if(y>bot || x>right || y<top || x<left){
			console.log("hide element...");
			console.log(true);
			// document.removeEventListener("mousedown", handleClickOutside);
			return true;	
		}
		else{
			console.log("dont hide element...");
			// document.removeEventListener("mousedown", handleClickOutside);
			return false;
		}
	}

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
	<Nav bind:modalMenu={modalMenu} bind:hideMenu={hideMenu}></Nav>
	<Social bind:canvasSocialSide={canvasSocialSide} bind:socialSide={socialSide}></Social>
	<About bind:skillsEl={ skillsEl } bind:whoEl={ whoEl }></About>
	{#if ((showFooter===true)||(openf===true) )}
	<Footer></Footer>
	{:else}
	<div transition:fade class="button-footer" on:click={ openFooter } >
		<img src="/images/up.png" alt="open-footer" />
	</div>
	{/if}
</main>

<style>
	main {
		background-image: url('/images/orion-nebula-big.jpg');
		background-repeat: no-repeat;
		background-size: stretch;
		background-position: center center;
		background-color:black;
		width:100%;
		height:100vh;
		text-align: center;
		margin:0 !important;
		padding:0 !important;
		animation: backfloat 5s infinite alternate;
		display:flex;
		flex-direction:column;
		z-index:600;
	}
	.button-footer img{
		position: absolute;
		top:30%;
		height:60% !important;
		filter:invert();
		cursor:pointer;
		
	}
	.button-footer{
		position:relative;
		color:white;
		padding:2%;
		margin:0;
		display:flex;
		align-content:center;
		justify-items:center;
		align-items:center;
		justify-content: space-evenly;
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
			background-image: url('/images/orion-nebula-small.jpg');
			background-size: 60% 100%;
			height:auto;
			animation: backfloat2 5s infinite alternate;	
		}
		.button-footer img{
			position: relative;
			width:20%;
			height:100% !important;
			filter:invert();
			cursor:pointer;	
		}
		.button-footer{
			position:relative;
			color:white;
			z-index:400;
		}
	}

</style>