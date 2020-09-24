<script>
    import { fade } from 'svelte/transition';
    import { getContext } from 'svelte'

    const showFooter = getContext('showingFooter');


    let visible = false;
    let gmailEl;
    const handleGmailOver = ()=>{
        visible = !visible;
    }

    const copyText = (text)=>{
        navigator.clipboard.writeText(text);

    }
     const handleGmailClick = ()=>{
        let opcion = confirm("copy to clipboard?");
        if (opcion == true) {
            let val = document.getElementById("in");
            val.select();
            document.execCommand("copy");
            alert("Copied to clipboard: " + val.value); 
	    }
         
    }

    const handlePdfClick = ()=>{
        window.open('/cv-sergiodavidposse.pdf');    
    }


</script>

<footer transition:fade>
    <div on:click={showFooter} class="button-footer2"><img src="/images/up.png" alt="open-footer" /></div>

    <div class="footer-social">
        <img src="/images/whatsapp.png" alt="whatsapp" on:click={()=>{ window.open("https://wa.me/5493584849720");}} />
        <img src="/images/github.png" alt="github" on:click={ ()=>{window.open("https://github.com/SergioPosse");} } />
        
        <input id="in" bind:this={gmailEl} class={visible?"gmail-modal visible":"gmail-modal invisible"} value="SergioDavidPosse@gmail.com" />
        <img on:click={handleGmailClick} on:mouseover={handleGmailOver} on:mouseout={handleGmailOver} alt="gmail"src="/images/gmail.png" />
        <!-- <a target="_blank" href="https://mailto:agustinacarrizofotografia@gmail.com">mail</a> -->
    </div>
    <div class="footer-message">
        <div>
            <h4>Leave Message</h4>
            <img alt="chat" src="/images/chat.png">
        </div>
        <div>
            <h4>View resume</h4>
            <img on:click={ handlePdfClick } alt="chat" src="/images/pdf.png">
        </div>     
    </div>
    <div class="copyright">
        <h4>Copyright Sergio Posse 2020</h4>
    </div>
</footer>

<style>
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
    .gmail-modal{
        position:absolute;
        top:-50%;
        left:50%;
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
    .footer-social{
        position:relative;
        height:100%;
        display:flex;
        font-size:80%;
        width:30%;
        justify-content:center;
        align-items:center;

    }
    .footer-social img{
        cursor:pointer;
        height:60%;
        margin-left:5%;
        margin-right:5%;

    }
    .footer-message div img{
        cursor:pointer;
        height:20%;
        width:20% !important;
        margin-left:5%;
        margin-right:5%;
        
    }

    footer{
        width:100%;
        background: rgb(91,43,152);
        background: linear-gradient(176deg, rgba(91,43,152,1) 0%, rgba(0,0,0,1) 51%);
        color:white;
        height:10%;
        display:flex;
        position:relative;
    }

    .footer-message div{
        display:flex;
        align-content:center;
        align-items:center;
        justify-content: space-evenly;
        padding:7%;
    }
    .footer-message{
        width:40% !important;
        justify-content: space-between;
        
    }
    .footer-message{
        width:auto;
        height:100% !important;
        display:flex;
        align-items: center;
        justify-items: center;
        align-content: center;
        font-size:80%;
    }
  
    .copyright{
        width:30%;
        display:flex;
        padding-right:1%;
        font-size:30%;
        justify-content: flex-end;
        align-items:flex-end;
        flex-direction: column;
    }

    @media(max-width: 640px){
        footer{
            width:100% !important;
            height:20%;
            font-size: 80%;
        }
        .footer-message{
            flex-direction:column;
            justify-content: center !important;
        }
        .footer-message div {
            padding:4% !important;
        }
        .footer-message div img{
            width:20%;
            height:auto;
        }
        .copyright{
            color:white;;
        }
        .footer-social{
            font-size:60%;
            width:50%;
            justify-content:center !important;
            align-items:center !important;
            align-content:center !important;
            justify-items: center !important;

        }
        .footer-social img{
            cursor:pointer;
            height:30%;
            width:20%;
            margin-left:5%;
            margin-right:5%;
            margin-top:20%;
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
    }
    }

</style>