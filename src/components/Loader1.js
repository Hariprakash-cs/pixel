import React, { useState } from 'react'
import SyncLoader from "react-spinners/SyncLoader";
function Loader1() {
    let [loading, setLoading] = useState(true);

    return (
        <div className='loader1'>
        <div className="sweet-loading  " >


            <SyncLoader color='#000' loading={loading} css=''margin={5} size={50} />
        </div></div>
    )
}

export default Loader1