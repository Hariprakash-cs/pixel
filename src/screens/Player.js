import React, { useEffect, useState } from 'react'
import { config } from './../config';
import { useParams } from "react-router-dom";
import axios from 'axios';
import ReactPlayer from 'react-player/youtube'
import Swal from 'sweetalert2';
import Loader1 from '../components/Loader1';
import moment from "moment";
function Player() {
  const [loading, setloading] = useState(true);
  const params = useParams();
  const [video, setvideo] = useState()
  let [createdat, setcreatedat] = useState()
  useEffect(() => {
    if (!localStorage.getItem('react_app_token')) {
      Swal.fire('Oops', 'Login, before playing video', 'error').then(result => {
        window.location.href = '/login'
      })

    }
    let fetchdata = async () => {

      try {

        setloading(true);
        const videodetail = (await axios.post(`${config.api}/api/newvideo/${params.id}`)).data;
        console.log(videodetail)
        setvideo(videodetail);
        setcreatedat(videodetail[0].createdAt)
        setloading(false);
      } catch (error) {
        console.log(error)
        setloading(false);
      }
    }
    fetchdata();
  }, []);
  const date = moment(createdat).format("DD-MM-YYYY")
  return (
    <>
      {loading ? (<Loader1 />) : (
        <>
          {video.map((e) => {
            return (
              <div className='play-body'>
                <div className='container '>
                  <div className='row justify-content-center'>
                    <div className='col-md-8 video-player box-shadow-1 '>

                      <ReactPlayer controls url={e.video_link}
                        width="640px" height="360px"
                      />

                    </div>
                    <div className='col-md-6 play-cont mt-2'>
                      <h5><b>Title:</b>{` ${e.title} from ${e.movie}`}</h5>
                      <h6><b>Cast:</b>{` ${e.cast}`}</h6>
                      <h6><b>Published At:</b>{` ${date}`}</h6>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}

export default Player