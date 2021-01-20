<script>
	import {fade} from 'svelte/transition';

	export let skillsEl;
	export let whoEl;

		const handleMousemove = (event, element)=>{
			let rect = event.target.getBoundingClientRect();
			  let x = event.clientX - rect.left;
			  let y = event.clientY - rect.top;
			  if(element==="skills"){
				skillsEl.style.setProperty('--x', x + 'px');
			  	skillsEl.style.setProperty('--y', y + 'px');
			  }
			  if(element==="who"){
				whoEl.style.setProperty('--x', x + 'px');
			  	whoEl.style.setProperty('--y', y + 'px');
			  }
			  
		}

		

</script>

	<about transition:fade class="about">
		<div class="row">
			<section bind:this={whoEl} on:mousedown={(e)=>handleMousemove(e, "who")} on:touchmove={(e)=>handleMousemove(e, "who")} on:mousemove={(e)=>handleMousemove(e, "who")} class="card-simple" ><h2>Who i am?</h2>
				<p>Hello friend! My name is Sergio Posse, im a simple guy interested by every kind of programming but experienced in web development. In my free time i play the guitar and write music, i like experimental or underground bands that blows your mind! Check my 
					<a style="z-index:120;color:#F2E6FC;"target="_blank" href='https://soundcloud.com/kumikobox'>Soundcloud</a> if you feel curious.</p>
			</section>
		
				<section class="card-over" >
					<h2>Formation</h2>
					<img alt="graduatedImage" class="img-fluid" src='/images/graduated.png' />
					<strong>High School:</strong><p>IPEM 259 Ambrosio Olmos - INDUSTRIAL (graduated as metalworking speciality)</p>
						<strong>Tertiary Studies:</strong><p>ITec Instituto Tecnológico Río Cuarto (graduated as Superior techichian in soft development)</p>
				</section>		
				
		</div>
		<div class="row">
			
			<section class="card-over"  ><h2>Working Experience</h2>
				<img alt="programmerImage" class="img-fluid" src='/images/work.png' />

				<p>Practices when i was studying, like scrum simulations, QA Testing and frontend/backend basics </p>
					<p>Amateur projects for friends and family</p>
			</section>
		
			<section bind:this={skillsEl} on:mousemove={(e)=>handleMousemove(e, "skills")} class="card-simple" ><h2>Main skills</h2>
				<p>Global vision - Selflearning - Modeling (UML) - Control versioning (Git) - Operative Systems & Virtual Machines config - Hardware - UX Design (Figma)</p>
			</section>
		</div>
	</about>

<style>

	.card-simple p{
		text-shadow: 1px 1px 2px black, 0 0 1em rgb(0, 0, 0), 0 0 0.2em rgb(0, 0, 0);
	}
	.img-fluid {
		position:absolute;
		top:10%;
		left:10%;
		width:10%;
		transition: 0s;
	}
	.about{
		display:flex;
		flex-wrap: nowrap;
		font-size: 1em;
		font-weight: 100;
		border-radius: 0.5;
		width:75%;
		height:73%;
		margin: auto;
		margin-top:2%;
		transition: 0.3s;
		z-index: 6;
	}
	section{
		position:relative;
		background-color:var(--main-purple-beta);
		box-shadow: 0 15px 18px 0 var(--dark-beta), 0 6px 20px 0 var(--dark-beta);
		color:var(--l-purple) !important;
		height:30% !important;
		max-height: 30%;
		min-height:30% !important;
		overflow:hidden;
		text-align: center;
		display:flex;
		flex-wrap:nowrap;
		flex-direction:column;
		align-items:center;
		justify-content:center;
		margin:5px;
		border-radius:6%;
		padding:10%;
		font-size: 0.8em;
	}
	.row{
		display:flex;
		flex-wrap:nowrap;
		flex-direction:column;
		width:50%;
		height:100%;
	}
.card-simple{
  border: none;
  color: var(--l-purple) !important;
  outline: none;
  position:relative;
}
.card-over:before{
	position:absolute;
	content:'';
	height:0;
	width:0;
	border:0.5px solid transparent;
	bottom:0;
	left:0;
	box-sizing:border-box;
	animation: bordershine 2s linear infinite;
	border-bottom:none !important;
	border-right:none !important;
}
.card-over:after{
	position:absolute;
	content:'';
	height:0;
	width:0;
	border:0.5px solid transparent;
	top:0;
	right:0;
	box-sizing:border-box;
	animation: bordershine2 2s linear  infinite;
	border-top:none !important;
	border-left:none !important;
}

@keyframes bordershine{
	50%{
		height:100%;
		width:0%;
		border-bottom:none !important;
		border-right:none !important;
		border:1px solid var(--yellow);
	}
	100%{
		width:100%;
		height:100%;
		border-bottom:none !important;
		border-right:none !important;
		border:1px solid var(--l-purple);
	}
}
@keyframes bordershine2{
	50%{
		width:0%;
		height:100%;
		border-top:none !important;
		border-left:none !important;
		border:1px solid var(--yellow);
	}
	100%{
		width:100%;
		height:100%;

		border-top:none !important;
		border-left:none !important;
		border:1px solid var(--l-purple);
	}

}
a{
	z-index:100;
	pointer-events:all;
	cursor:pointer;
	position:relative;
}
.card-simple:before {
  	--size: 0;
  	content: '';
  	position: absolute;
  	left: var(--x);
  	top: var(--y);
  	width: var(--size);
  	height: var(--size);
  	background: radial-gradient(circle closest-side,var(--yellow), transparent);
  	transform: translate(-50%, -50%);
  	transition: width 0.2s ease, height 0.2s ease;
}
.card-simple:hover:before {
  --size: 400px;
}

	.card-over{
		transition: 1s;
		border:none;
		outline:none;
		cursor:pointer;
		font-weight: 300px;
		color:white !important;
		background-color:var(--h-purple);

	}
	

	@keyframes flashpass{
		0%{
			transform:translateY(0%);
			transform:translateX(0%);
			transform:scale(1,1);

		}
		100%{
			transform:translateY(0%);
			transform:scale(1.4,1.4);
			transform:translateX(80%);
		}
	}
	@media (max-width: 640px) {
		.card-simple:before {
			content: '';
			position: absolute;
			left: 0%;
			top: 0% !important;
			width: 60%;
			height: 50%;
			background: radial-gradient(circle closest-side, var(--yellow), transparent);
			transition: width 0.2s ease, height 0.2s ease;
			animation: flashpass 2s linear alternate infinite;
		}

		.row{
			width:100%;	
		}
		.about{
			width:100vw;
			max-width: 100% !important;
			height:auto;
			padding-top:10%;
			padding-bottom:20%;
			display:flex;
			gap:5%;
			flex-direction: column;
			flex-wrap:wrap;
		}
		section{
			display:flex;
			align-self:center;
			justify-self:center;
			margin-top:1% !important;
			height:50vh !important;
			width:60vw !important;
			font-size: 90%;
		}	
	}
</style>