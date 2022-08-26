import { Tabs } from 'antd';
import axios from 'axios';
import { config } from './../config';
import React, { useEffect, useState } from 'react';
import Loader from "../components/Loader";
import Loader1 from "../components/Loader1";
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
const { TabPane } = Tabs;

function Admin() {
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('user')).isAdmin) {
            Swal.fire('Oops', 'You Are Not An Admin', 'error').then(result => { window.location.href = '/home' });

        }
    }, [])


    return (

        <div className='mx-4 my-1 box-shadow p-3'>
            <h2 className='text-center add-video' style={{ fontSize: "30px" }}><b>Admin Pannel</b></h2>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Videos" key="1">
                    <Videos />
                </TabPane>
                <TabPane tab="Users" key="2">
                    <Users />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Admin;

export function Videos() {
    const [videodata, setvideodata] = useState([]);
    const [loading, setloading] = useState(false);
    async function fetchdata() {
        try {
            setloading(true)
            const data = await (await axios.get(`${config.api}/api/newvideo/videolist`)).data;

            setvideodata(data);
            setloading(false)

        } catch (error) {
            setloading(false)
            console.log(error);
        }
    }
    useEffect(() => {

        fetchdata()

    }, [])

    const deletedata = async (id) => {
        let ask = window.confirm("Do you want to delete!!")
        if (ask) {
            await axios.delete(`${config.api}/api/newvideo/deletevideo/${id}`);
            fetchdata();
        }
    }
    return (<div className='row'>
        {loading && <Loader />}
        <div className='col-md-12'>

            <table class="table table-bordered table-dark table-striped">
                <thead className='text-center'>
                    <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Id</th>
                        <th scope="col">Uploader Name</th>
                        <th scope="col">Upload Title</th>

                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {videodata.length && (videodata.map((e, index) => {
                        return (<tr>
                            <th scope="row">{index + 1}</th>
                            <td>{e._id}</td>
                            <td>{e.uploader_name}</td>
                            <td>{e.title}</td>
                            <td>
                                <Link to={`/api/newvideo/editvideo/${e._id}`}><button className="btn btn-warning margin-r" >Edit</button></Link>
                                <button className="btn btn-danger " onClick={() => deletedata(e._id)}>Delete</button>
                            </td>

                        </tr>)
                    }))}

                </tbody>
            </table>

        </div>
    </div>)
}



export function Users() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(false);
    useEffect(() => {
        async function fetchdata() {
            try {
                setloading(true)
                const data = await (await axios.get(`${config.api}/api/users/getallusers`)).data;
                // const result=await data.data;
                setusers(data);
                setloading(false)
                console.log(users)
            } catch (error) {
                setloading(false)
                console.log(error);
            }
        }
        fetchdata()

    }, [])

    return (
        <>
            {loading && <Loader />}
            <div className='row'>
                <div className='col-md-12'>
                    <table class="table table-bordered table-dark table-striped">
                        <thead className='text-center'>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">User Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Is Admin</th>

                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {users.length && (users.map((e, index) => {
                                return (<tr>
                                    <th scope="row">{index + 1}</th>
                                    <th scope="row">{e._id}</th>
                                    <td>{e.name}</td>
                                    <td>{e.email}</td>
                                    <td>{e.isAdmin ? "YES" : "NO"}</td>

                                </tr>)
                            }))}

                        </tbody>
                    </table>

                </div>

            </div>
        </>
    )
}












