<script>
    import Gmail from '../public/images/gmail.svg';
    import Whatsapp from '../public/images/whatsapp.svg';
    import Github  from '../public/images/github.svg';
    import Cv from '../public/images/curriculum-vitae.svg';
    import Chat from '../public/images/chat.svg';

</script>

<footer>
    <div class="footer-social">
        <Gmail style="margin-left:10%;margin-right:3%;
        width:50%;
        height:50%;"
        class="gmail"
        ></Gmail>
        <Whatsapp style=";width:50%;height:50%;margin-left:5%;margin-right:5%;" class="whatsapp"></Whatsapp>
        <Github style="margin-right:10%;width:50%;height:50%;"></Github>
        </div>
    <div class="footer-message">
        <div>
            <h4>Leave Message</h4>
            <Chat style="cursor:pointer;width:12%;"></Chat>
        </div>
        <div>
            <h4>View resume</h4>
            <Cv style="cursor:pointer;width:12%;"></Cv>
        </div>     
    </div>
    <div class="copyright">
        <h4>Copyright Sergio Posse 2020</h4>
    </div>
</footer>

<style>
    footer{
        width:100%;
        background: rgb(91,43,152);
        background: linear-gradient(176deg, rgba(91,43,152,1) 0%, rgba(0,0,0,1) 51%);
        color:white;
        height:10%;
        display:flex;
  
    }
    .footer-message div{
        display:flex;
        align-content:center;
        align-items:center;
        justify-content: space-evenly;
    }
    .footer-message{
        width:40% !important;
        justify-content: space-between !important;
    }
    .footer-message{
        width:100% !important;
        height:100%;
        display:flex;
        align-items: center;
        justify-items: center;
        align-content: center;
        font-size:80%;
    }
    .footer-social{
        height:100%;
        display:flex;
        align-items: center;
        justify-items: center;
        align-content: center;
        font-size:80%;
        justify-content: space-evenly !important;
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
            position:fixed;
            bottom:0;
            height:20%;
        }
        .footer-social,.footer-message,.copyright{
            font-size:70%;
        }
        .footer-message{
            flex-direction:column;
        }
        .footer-social{
            width:35% !important;
        }
        .copyright{
            font-size:30% !important;
            width:34%;
        }
    }

</style>