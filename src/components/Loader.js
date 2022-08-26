import React, { useState } from 'react'
import ScaleLoader from "react-spinners/ScaleLoader";
function Loader() {
    let [loading, setLoading] = useState(true);

    return (
        <div className='loader'>
        <div className="sweet-loading">


            <ScaleLoader color='#000' loading={loading} css='' height={73}
                margin={10}
                width={8} />
        </div></div>
    )
}

export default Loader