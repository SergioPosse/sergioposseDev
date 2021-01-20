<script>
    import { fade } from 'svelte/transition';
</script>

<footer>
    <div class="copyright">
        <h4>Copyright Sergio Posse 2020</h4>
    </div>
</footer>

<style>
    footer{
        bottom:0;
        width:100vw;
        max-width: 100% !important;
        background: var(--dark);
        color:var(--l-purple);
        height:4%;
        display:flex;
        flex-direction: column;
        justify-items: center;
        align-items:center;
        align-content: center;
        justify-content: center;
        z-index: 300 !important;
    }
    .copyright{
        width:100%;
        height:auto;
        font-size:30%;
    }
    @media(max-width: 640px){
        footer{
            width:100vw !important;
            max-width: 100% !important;
            height:5vh;
            font-size:0.3em;
            margin-bottom:0;
            bottom:0 !important;
            position: absolute;
        }
        .copyright{
            color:var(--l-purple);;
        }
    }
</style>