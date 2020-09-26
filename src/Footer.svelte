<script>
    import { fade } from 'svelte/transition';
    import { getContext } from 'svelte';

    let visible = false;

    const handleGmailOver = ()=>{
        visible = !visible;
    }

    const showFooter = getContext('showingFooter');

    const handlePdfClick = ()=>{
        window.open('/cv-sergiodavidposse.pdf');    
    }
    const handleGmailClick = ()=>{
        document.getElementById('justCopy').value='SergioDavidPosse@gmail.com';
        let elemento = document.getElementById("justCopy");
        elemento.select();
        elemento.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Copied: "+elemento.value);
    }
</script>

<footer transition:fade>
    <input style="position:absolute;left:-9999px;" id="justCopy" value="SergioDavidPosse@gmail.com" />

    <div on:click={showFooter} class="button-footer2"><img src="/images/up.png" alt="open-footer" /></div>

    <div class="footer-message">
            <input style="width:auto;" id="in" class={visible?"gmail-modal visible":"gmail-modal invisible"} value="SergioDavidPosse@gmail.com" />
            <div on:click={()=>{ window.open("https://wa.me/5493584849720");}}><h4>Whatsapp</h4></div>
            <div on:mouseout={handleGmailOver} on:mouseover={handleGmailOver} on:click={ handleGmailClick }><h4>Gmail</h4></div>
            <div on:click={()=>window.open('https://instagram.com/ssergio.posse')}><h4>Instagram</h4></div>
            <div on:click={()=>window.open('https://github.com/SergioPosse')}><h4 >Github</h4></div>
            <div><h4>Leave Message</h4></div>
            <div on:click={ handlePdfClick }><h4>View resume</h4> </div>  
    </div>
    <div class="copyright">
        <h4>Copyright Sergio Posse 2020</h4>
    </div>
</footer>

<style>
    .gmail-modal{
        position:absolute;
        top:-100%;
        left:20%;
        background-color:white;
        color:black;
        border-radius:5%;
        box-shadow:black;
        padding:3%;
        font-size:70%;
    }
    .visible{
        visibility:show;
    }
    .invisible{
        visibility: hidden;
    }
    .button-footer2 img{
        cursor:pointer;
        position:absolute;
        width:2% !important;
        height:auto !important;
        left:49%;
        filter:invert();
        transform: scaleY(-1);

    }
    .button-footer2{
        cursor:pointer;
    }
      
    .footer-message{
        display:flex;
        flex-direction: row !important;
        width:100%;
        align-content: center;
        align-items: center;
        justify-content: space-evenly;
    }
    .footer-message div{
        cursor: pointer;
    }
    footer{
        position: absolute;
        bottom:0;
        width:100%;
        background: rgb(91,43,152);
        background: linear-gradient(176deg, rgba(91,43,152,1) 0%, rgba(0,0,0,1) 51%);
        color:thistle;
        height:auto;
        display:flex;
        flex-direction: column;
        justify-items: center;
        align-items:center;
        z-index: 300 !important;
    }
    .copyright{
        width:100%;
        font-size:30%;
    }

    @media(max-width: 640px){
        footer{
            width:100% !important;
            height:auto;
            font-size: 80%;
        }
        .footer-message{
            font-size:80%;
        }
        .footer-message div {
            padding:4% !important;
        }
        .copyright{
            color:white;;
        }   
        .button-footer2 img{
        position:absolute;
        width:10% !important;
        height:50% !important;
        left:49%;
        filter:invert();
        top:-40px;
        z-index:400;
        transform: scaleY(-1);
        visibility: hidden;
    }
    }

</style>