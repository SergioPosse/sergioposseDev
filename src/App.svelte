<script>
	// import background from '../public/assets/background.jpg';
	import About from './About.svelte';
	import Nav from './Nav.svelte';
</script>


<main>
	<Nav></Nav>
	<!-- <background>{@html background}</background> -->
	<About></About>
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
		background-image: url('/images/hole.jpg');
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
	@media (max-width: 640px) {
		main {
			height:auto;
		}
	}
</style>