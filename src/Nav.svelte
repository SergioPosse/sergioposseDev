


	<nav>
        {#if (!hideMenu)}
        <div bind:this={modalMenu} class="menu-modal">
            <h4 class="menu-modal-item" style="color:white;background-color:black">Sergio David Posse</h4>
            <span class="menu-modal-item" style="background-color:rgb(158, 226, 242,0);color:rgb(224, 255, 255,0.7);">Leave a message in this site</span>
            <span class="menu-modal-item" on:click={ handlePdfClick } style="background-color:rgb(224, 100, 100,0);color:rgb(224, 255, 255,0.7););">View my formal resume</span>
        </div>
        {/if}
        <img on:click={clickMenu} src="/images/menu.png" alt="menu"/>
        <div class="about">
            About
        </div>
        <div class="portfolio">
            Portfolio
        </div>
    </nav>

    <script>
        export let hideMenu;

        export let modalMenu;

        let visible=false;
    
        const clickMenu = ()=>{
            hideMenu=false;  
        }
    
        const handlePdfClick = ()=>{
            window.open('/cv-sergiodavidposse.pdf');    
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
        background-color:rgb(91,43,152, 1) !important;
        border:1px solid papayawhip;
        /* transition:1s; this give me error with the mouseout event*/
    }
	nav{
        display:flex;
        justify-content:space-evenly;
        align-items: center;
        flex-direction: row;
        height:7vh !important;
        width:100%;
        z-index: 100;
        background: rgb(91,43,152);
        background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);
        color:#b8b8b6;
       
	}
    .about:hover, .portfolio:hover{
        background-color:rgba(239, 129, 129, 0.4);
        color:#959752 !important;

    }
    .about, .portfolio{
        width:43%;
        height:100%;
        display:flex;
        justify-content:center;
        align-items: center;
    }
    img{
        width:3%;
        height:85%;
        filter:invert();
        cursor:pointer;
    }

	@media (max-width: 640px) {
		nav{
			height:10vh !important;
            width:100vw;
            position:fixed;
            z-index:600 !important;
		}
        img{
            width:7%;
        }
        .menu-modal{
            height:100vh;
            width:70% !important;
        }
	}
</style>