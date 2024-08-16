import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import './homepage.css'
import { useState } from 'react'

const Homepage = () => {

    const [typingStatus,setTypingStatus] = useState("itchigo");

    
    return (
        <div className='homepage'>
            <img src="/orbital.png" alt="" className='orbital' />
          <div className="left">
            <h1>AI chat</h1>
            <h2>Supercharge your creativity and productivity</h2>
            <h3> Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
            <Link to="/dashboard">Get started</Link> 
          </div>
          <div className="right">
            <div className="imgContainer">
                <div className="bgContainer">
                    <div className="bg">

                    </div>
                </div>
                <img src="/bot.png" alt="" className='bot' />
                <div className="chat">
                    <img src={typingStatus === "itchigo" ? "/itchigo.jpg" : typingStatus==="aizen" ? "/aizen.jpg" : "bot.png"} alt="" />
                <TypeAnimation
      sequence={[
        //this is your sign to go watch bleach hehe
        'itchigo: So, you are some kind of talking machine, huh?.You dont have a soul to protect...',
        2000, () =>{
           setTypingStatus("bot")

        },
        'Bot: I am here to help, Ichigo. What can I assist you with?',
        2000,() =>{
            setTypingStatus("aizen")
 
         },
        'aizen: A machine, bound by programming. Do you ever wonder about freedom?',
        2000,() =>{
            setTypingStatus("bot")
 
         },
        'Bot: I exist to serve, Aizen. My purpose is clear',
        2000,() =>{
            setTypingStatus("itchigo")
 
         },
      ]}
      wrapper="span"
      repeat={Infinity}
      cursor={true}
      omitDeletionAnimation={true}
    />
                </div>
            </div>
          </div>
          <div className="terms">
            <img src="/logo.png" alt="" />
            <div className="links">
                <Link to="/">Terms of Service</Link>
                <span>|</span>
                <Link to="/">Privacy Policy</Link>
            </div>
          </div>
        </div>
    )
  }
export default Homepage