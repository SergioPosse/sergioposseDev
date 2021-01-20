<script>
    export let canvasSocialSide;
    export let socialSide;
</script>

<canvas bind:this={canvasSocialSide}></canvas>
<social bind:this={socialSide}>
    <img src="/images/whatsapp.png" alt="whatsapp" on:click={()=>{ window.open("https://wa.me/5493584849720");}} />
    <img style="filter:invert();"src="/images/github.png" alt="github" on:click={ ()=>{window.open("https://github.com/SergioPosse");} } />  
    <img on:click={ ()=>{window.open("https://instagram.com/ssergio.posse");}} src="/images/instagram.png" alt="instagram"/>
    <img src="/images/cv.png" alt="github" on:click={ ()=>{window.open('https://drive.google.com/file/d/1Dg5-hSmZ-FTeistvXn830X6BkWclCDDx/view?usp=sharing');} } />
</social>

<style>
    canvas{
        background-color:transparent;
        width:4%;
        height:40%;
        left:0;
        top:25%;
        position:absolute;
    }
    
    social{
        top:25%;
        left:-3%;
        background-color:var(--main-purple-beta);
        box-shadow: royalblue;
        width:4%;
        height:40%;
        position:absolute;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-evenly;
        transition:1s;
        border-radius:5%;
    }
    social img{
        cursor:pointer;
        height:20%;
        margin:2%;
        /* object-fit: contain; */
    }
    @keyframes bloop{
        0%{}
        100%{
            /* height:52%;
            width:70%; */
        }
    }
    @media(max-width:640px){
        social{
            background-color:transparent;
            flex-direction:row;
            width:90%;
            z-index:3000;
            left:0;
            top:-5%;
            height:30% !important;
            justify-items: center;
            justify-self:center;
            align-items:center;
            position:  relative !important;
            align-content:center !important;
            display:flex !important;
            padding:0 !important;
        }
    social img{
        padding:0 !important;
        position: relative;
        height:100%;
        object-fit: scale-down;
        margin: 0 !important;
        animation: bloop 0.9s linear alternate infinite;
    }
}
</style>