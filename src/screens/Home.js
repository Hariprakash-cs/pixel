import axios from 'axios';
import moment from "moment";
import React, { useEffect, useState } from 'react'
import { config } from './../config';
import { Link } from 'react-router-dom'
import Loader from "../components/Loader";
function Home() {
    const [loading, setloading] = useState(true);
    const [videos, setvideos] = useState([]);
    const [duplicatevideos, setduplicatevideos] = useState()
    const [searchkey, setsearchkey] = useState('')
    let [createdat, setcreatedat] = useState()
    const [type, settype] = useState('')
    let fetchdata = async () => {
        try {

            setloading(true);
            let getdata = (await axios.get(`${config.api}/api/newvideo/videolist`)).data;
            setvideos(getdata);
            setduplicatevideos(getdata);
            console.log(duplicatevideos)
            setloading(false);
            setcreatedat(getdata[0].createdAt)
        }
        catch (error) {
            console.log(error);
            setloading(false);
        }
    }
    useEffect(() => {

        fetchdata()
    }, []);
    const date = moment(createdat).format("DD-MM-YYYY")
    //search functionality//
    function filterBysearch() {
        const tempvideo = duplicatevideos.filter(video => video.title.toLowerCase().includes(searchkey.toLowerCase()));
        setvideos(tempvideo)

    }
    //..............................//

    //type filter.........................................................../
    function filterByType(e) {
        settype(e)
        if (e !== 'All') {
            const tempvideo = duplicatevideos.filter(video => video.catagory.toLowerCase() == e.toLowerCase());
            setvideos(tempvideo);
        } else {
            setvideos(duplicatevideos);
        }
    }
    return (
        <div className='container'>
            <div className='row bars mt-2 box-shadow ' >
                <div className='col-md-1'></div>

                <div className='col-md-6 search'>
                    <input type='text' className='form-control' placeholder='Search Video' value={searchkey} onChange={(e) => { setsearchkey(e.target.value) }} onKeyUp={filterBysearch} />
                </div>

                <div className='col-md-4 filter'>
                    <select className='form-control' value={type} onChange={(e) => { filterByType(e.target.value) }}>
                        <option value="All">All</option>
                        <option value="Teaser">Teaser</option>
                        <option value="Trailer">Trailer</option>
                        <option value="Lyrics song">Lyrics song</option>
                        <option value="Video song">Video song</option>
                    </select>
                </div>
                <div className='col-md-1'></div>
            </div>
            {loading ? (<Loader />) : (
                <div className='row mt-2'>
                    <div className='col-md-12'>
                        <div className='row p-2'>
                            {videos.map((e) => {
                                return (
                                    <div className="card col-md-3 py-1 px-1 " >
                                        <Link to={'/api/newvideo/' + e._id}><img className="card-img-top" src={e.thumbnail_img} alt="Card image cap" /></Link>
                                        <div className="cardbody ">
                                            <h5 className="card-title">{`${e.title} - ${e.movie} - ${e.catagory}`}</h5>
                                            {/* <h5 className="card-title">{e.upload_title.replace(/_/g, ' ')}</h5> */}
                                            <div className='home-flex'>
                                                <p className='creator'>{`Uploader : ${e.uploader_name}`}</p>
                                                <p className='creator'>{`${date}`}</p>
                                            </div>
                                        </div>
                                        <div className='playbutton'>
                                            <Link to={'/api/newvideo/' + e._id}><button className="btn-play">Play</button></Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home