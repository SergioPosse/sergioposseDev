

	<nav>
        
        <div on:click={()=>{clickNav("about")}} class={!showAbout? "about" : "about over-option-nav"}>
            About
        </div>
        <div on:click={()=>{clickNav("portfolio")}} class={showAbout? "portfolio" : "portfolio over-option-nav"}>
            Portfolio
        </div>
    </nav>

    <script>
        export let showAbout = true;


        //optimize in one function later
        const clickNav = (option)=>{
            if(option==="about"){
                showAbout=true;
            }
            else{
                showAbout=false;
            }
        }

           
    </script>




<style>
    
	nav{
        display:flex;
        justify-content:space-evenly;
        align-items: center;
        flex-direction: row;
        height:7vh !important;
        width:100vw;
        z-index: 10000;
        background: rgb(91,43,152);
        background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);
        color:#b8b8b6;
       
	}
    .over-option-nav{
        margin:auto;
        animation: glow 1s ease-in-out infinite alternate;
    }

    @keyframes glow {
  from {
    text-shadow: 0 0 10px rgb(255, 238, 0), 0 0 20px rgb(230, 255, 4), 0 0 30px #36e600, 0 0 40px #82e600, 0 0 50px #00e63a, 0 0 60px #13e600, 0 0 70px #36e600;
  }
  to {
    text-shadow: 0 0 20px rgb(231, 247, 7), 0 0 30px #2a0ae2, 0 0 40px #1b05e4, 0 0 50px #4da0ff, 0 0 60px #4dcdff, 0 0 70px #4ddbff, 0 0 80px #5f4dff;
  }
}
    .about, .portfolio{
        height:100%;
        display:flex;
        justify-content:center;
        align-items: center;
        cursor:pointer !important;
    }
    .portfolio{
        margin-left:auto;
        width:100%;
    }
    .about{
        width:100%;
        margin-left:auto;
        margin-right:auto;
    }
    

	@media (max-width: 640px) {
        .over-option-nav{
            text-shadow: 0 0 10px rgb(255, 238, 0), 0 0 20px rgb(230, 255, 4), 0 0 30px #36e600, 0 0 40px #82e600, 0 0 50px #00e63a, 0 0 60px #13e600, 0 0 70px #36e600;

        margin:auto;
        animation: none !important;
    }

		nav{
			height:10vh !important;
            width:100vw;
            position:fixed;
            z-index:10000 !important;

		}
        
        
	}
</style>