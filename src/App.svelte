<script>
	// import background from '../public/assets/background.jpg';
	import About from './About.svelte';
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';

	let skillsEl;
	let whoEl;
	// const handleMouseMove = (e)=>{
	// 	let rect = e.target.getBoundingClientRect();
	// 	let x = e.clientX - rect.left;
	// 	let y = e.clientY - rect.top;
	// 	console.log("mousex: "+x);
	// 	console.log("mousey: "+y);
	// }

	const handleTouchMove = (e)=>{

	let touchLocation = e.targetTouches[0];
	console.log(touchLocation);
	let pageX = Math.floor((touchLocation.screenX-touchLocation.target.offsetWidth)) + "px";
	let pageY = Math.floor((touchLocation.screenY-touchLocation.target.offsetHeight)) + "px";
	console.log("pagex: "+pageX);
	console.log("pagey: "+pageY);
	   let x =pageX;
	   let y =pageY;

	 	skillsEl.style.setProperty('--x', x + 'px');
	 	  skillsEl.style.setProperty('--y', y + 'px');

	 	whoEl.style.setProperty('--x', x + 'px');
	 	  whoEl.style.setProperty('--y', y + 'px');

}
</script>


<main  on:touchmove={(e)=>handleTouchMove(e)}>
	<Nav></Nav>
	<!-- <background>{@html background}</background> -->
	<About bind:skillsEl={ skillsEl } bind:whoEl={ whoEl }></About>
	<Footer></Footer>
</main>

<style>
	/* background {
		position: fixed;
		width:100%;
		height:100%;
		z-index:-1;
		left:0;
		top:0;
		opacity: 0.5;
	} */
	main {
		background-image: url('/images/orion-nebula-big.jpg');
		background-repeat: no-repeat;
		background-size: stretch;
		/* background-position-x: -300px; */
		background-position: center center;
		background-color:black;
		height:100vh;
		width:100%;
		text-align: center;
		margin:0 !important;
		padding:0 !important;
		animation: backfloat 5s infinite alternate;

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
	}

</style>