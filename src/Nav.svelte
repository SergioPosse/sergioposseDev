


	<nav>
        {#if (!hideMenu)}
        <div bind:this={modalMenu} class="menu-modal">
            <h4 class="menu-modal-item" style="color:white;background-color:black">Sergio David Posse</h4>
            <span class="menu-modal-item" style="background-color:rgb(158, 226, 242,0);color:rgb(224, 255, 255,0.7);">Leave a message in this site</span>
            <span class="menu-modal-item" on:click={ handlePdfClick } style="background-color:rgb(224, 100, 100,0);color:rgb(224, 255, 255,0.7););">View my formal resume</span>
        </div>
        {/if}
        <img on:click={clickMenu} src="/images/menu.png" alt="menu"/>
        <div on:click={()=>{clickNav("about")}} class={!showAbout? "about" : "about over-option-nav"}>
            About
        </div>
        <div on:click={()=>{clickNav("portfolio")}} class={showAbout? "portfolio" : "portfolio over-option-nav"}>
            Portfolio
        </div>
    </nav>

    <script>
        export let hideMenu;

        export let modalMenu;
        export let showAbout = true;

        let visible=false;
    
        const clickMenu = ()=>{
            hideMenu=false;  
        }
    
        const handlePdfClick = ()=>{
            window.open('/cv-sergiodavidposse.pdf');    
        }

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
    h4{
        opacity: 0.2;
    }
    .menu-modal{
        border-radius:0 0 6% 0;
        position: absolute;
        left:0;
        top:0;
        display:flex;
        flex-direction:column;
        align-items: stretch;
        align-content:space-between;
        justify-content: space-evenly;
        height:50%;
        width:20%;
        background-color: black;
        z-index: 500 !important;
        color:black;
        filter: drop-shadow(16px 16px 20px rgb(255, 255, 255));
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
        border:1px solid papayawhip;
        background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);

        /* transition:1s; this give me error with the mouseout event*/
    }
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
        background-color:rgba(239, 129, 129, 0.4);
        color:#959752 !important;
        filter: drop-shadow(0px 6px 20px rgb(44, 212, 22))


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
        width:86.2%;
        margin-left:auto;
        margin-right:auto;
    }
    img{
        width:3%;
        height:85%;
        padding:2%;
        filter:invert();
        cursor:pointer;
    }

	@media (max-width: 640px) {
		nav{
			height:10vh !important;
            width:100vw;
            position:fixed;
            z-index:10000 !important;

		}
        img{
            width:8%;
            height:55%;
        }
        .menu-modal{
            height:100vh;
            font-size:1em;
            width:80% !important;
            border-radius:0 0 0 0;

        }
	}
</style>