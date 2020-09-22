<script>
</script>


	<nav>
        <div class="about">
            About
        </div>
        <div class="portfolio">
            Portfolio
        </div>
    </nav>

<style>
	nav{
        display:flex;
        align-content: space-between;
        justify-content:space-around;
        flex-direction: row;
        height:7%;
        width:100%;
        z-index: -2;
        background: rgb(91,43,152);
        background: linear-gradient(14deg, rgba(91,43,152,1) 0%, rgba(121,9,81,1) 89%);
        color:#b8b8b6;
        margin:0 0 0 0;
        padding:0 0 0 0;

	}
    .about:hover, .portfolio:hover{
        background-color:rgba(239, 129, 129, 0.4);
        color:#959752 !important;

    }
    .about, .portfolio
    {
        width:50%;
        height:100%;
        display:flex;
        justify-content:center;
        align-items: center;
    }

	@media (max-width: 640px) {
		nav{
			height:10vh !important;
		}
	}
</style>