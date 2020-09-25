<script>
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

	<about class="about">
		<div class="row">
			<section bind:this={whoEl} on:mousemove={(e)=>handleMousemove(e, "who")} class="card-simple" ><h2>Who i am?</h2>
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
	.img-fluid {
		position:absolute;
		top:50%;
		width:18%;
		transition: 0s;
	}
	.about{
		display:flex;
		flex-wrap: wrap;
		font-size: 1em;
		font-weight: 100;
		border-radius: 0.5;
		width:70%;
		height:83%;
		margin: auto;
		transition: 0.3s;
		z-index: 6;
	}
	section{
		position:relative;
		background-color: rgba(78, 23, 103, 0);
		box-shadow: 0 15px 18px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		color:#e7e7e7 !important;
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
		font-size: 90%;
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
  color: white !important;
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
.card-over:hover:before, .card-over:hover:after{
	border:none !important;
}
@keyframes bordershine{
	50%{
		height:100%;
		width:0%;
		border-bottom:none !important;
		border-right:none !important;
		border:1px solid  rgb(247, 27, 181);
	}
	100%{
		width:100%;
		height:100%;
		border-bottom:none !important;
		border-right:none !important;
		border:1px solid white;
	}
}
@keyframes bordershine2{
	50%{
		width:0%;
		height:100%;
		border-top:none !important;
		border-left:none !important;
		border:1px solid white;
	}
	100%{
		width:100%;
		height:100%;

		border-top:none !important;
		border-left:none !important;
		border:1px solid rgb(247, 27, 181);
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
  	background: radial-gradient(circle closest-side, rgba(255, 255, 255, 0.5), transparent);
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
	}
	.card-over p, .card-over strong{
		color:transparent;
		transition: 1s;
	}
	.card-over:hover{
		background-color:rgba(75, 12, 128, 0.89);
		transition: 1s;
		border:0px !important;
	}
	.card-over:hover p, .card-over:hover strong{
		color:white !important;
		font-weight: 300px;
		transition: 4s;
	}
	.card-over:hover .img-fluid{
		visibility: hidden;
		transition-delay: 0s;
	}
	.card-over .img-fluid{
		visibility:visible;
		transition-delay: 1s;
	}
	@media (max-width: 640px) {
		.row{
			width:100%;
		}
		.about{
			padding-top:12%;
			padding-bottom:30%;
			flex-direction: column;
			flex-wrap: nowrap !important;
		}
		section{
			font-size: 80%;
		}
	}
</style>