import React, { useEffect, useRef } from 'react'
import { init } from "ityped";
function Landing() {
  const textRef = useRef();
  useEffect(() => {
    init(textRef.current, {
      showCursor: true,
      backDelay: 1500,
      backSpeed:60,
      strings: [ "Get Started"],
    });
  }, []);
  return (
    <div className='bg-img' onClick={()=>window.location.href='/home'}>
        <div className='cont' >
          <h3 className='intro'>
          <span ref={textRef}></span><br></br>
          </h3>
          </div>
    </div>
  )
}

export default Landing