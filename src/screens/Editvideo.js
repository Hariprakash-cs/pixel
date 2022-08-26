import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { config } from './../config';
import { useFormik } from 'formik'

import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Editvideo() {
    const notify = () => toast.success('Video edited successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    let navigate = useNavigate();
    let params = useParams();
    useEffect(() => {
        fetchdata();

    }, [])
    let fetchdata = async () => {
        let a = await axios.get(`${config.api}/api/newvideo/editvideo/${params.id}`);

        formik.setValues(a.data)
    }
    let formik = useFormik({
        initialValues: {
            title: "",
            movie: "",
            cast: "",
            catagory: "",
            thumbnail_img: "",
            video_link: ""

        },
        validate: (values) => {
            let errors = {}
            if (!values.title) {
                errors.title = "please enter the product title"
            }
            if (!values.movie) {
                errors.movie = "please enter the product movie"
            }
            if (!values.cast) {
                errors.cast = "please enter the cast"
            }
            if (!values.catagory) {
                errors.catagory = "please enter the catagory"
            }
            if (!values.thumbnail_img) {
                errors.thumbnail_img = "please enter the thumbnail_img "
            }
            if (!values.video_link) {
                errors.video_link = "please enter the video_link"
            }

            return errors;
        },
        onSubmit: async (values) => {
            try {
                delete values._id;
                await axios.put(`${config.api}/api/newvideo/editedvideo/${params.id}`, values);
                navigate("/admin");
            } catch (error) {
                console.log(error);

            }
        }
    });
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='container'>
                <form onSubmit={formik.handleSubmit} autoComplete="off">

                    <div className='row'>
                        <h1 className='add-video'>Edit Video</h1>
                        <div className='col-lg-4 edit-img'>

                        </div>
                        <div className='col-lg-6'>
                            <div className='col-lg-12'>

                                <input type="text" placeholder='Title' className='form-control' name="title" onChange={formik.handleChange} value={formik.values.title}></input>
                            </div>

                            <div className='col-lg-12 mt-2'>

                                <input type="text" placeholder='Movie Name' className='form-control' name="movie" onChange={formik.handleChange} value={formik.values.movie}></input>
                            </div>

                            <div className='col-lg-12 mt-2'>

                                <input type="text" placeholder='Cast & Crew' className='form-control' name="cast" onChange={formik.handleChange} value={formik.values.cast}></input>
                            </div>

                            <div className='col-lg-12 mt-2'>
                                <select className='form-control' placeholder='Catagory' name='catagory' onChange={formik.handleChange} value={formik.values.catagory}>
                                    <option value="Nah" >select any one catagory</option>
                                    <option value="Teaser">Teaser</option>
                                    <option value="Trailer">Trailer</option>
                                    <option value="Lyrics song">Lyrics song</option>
                                    <option value="Video song">Video song</option>

                                </select>
                            </div>

                            <div className='col-lg-12 mt-2'>

                                <textarea cols="30" rows="3" placeholder='Thumbnail Image' className='form-control' name="thumbnail_img" onChange={formik.handleChange} value={formik.values.thumbnail_img}></textarea>
                            </div>

                            <div className='col-lg-12 mt-2'>


                                <textarea cols="30" rows="3" placeholder='Video Link' className='form-control' name="video_link" onChange={formik.handleChange} value={formik.values.video_link}></textarea>
                            </div>

                            <div className='col-lg-12 mt-2'>
                                <input type="submit" value="submit" className='btn btn-red  mt-2' disabled={!formik.isValid} onClick={notify}></input>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Editvideo