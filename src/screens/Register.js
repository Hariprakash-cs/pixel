import axios from 'axios';
import React, { useState } from 'react'
import { config } from './../config';
import Success from '../components/Success';
import Loader1 from '../components/Loader1';
import Error from '../components/Error';
function Register() {
    const [name,setname]=useState('');
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [confirmpassword,setconfirmpassword]=useState('');
    const [error,seterror] = useState(false);
    const [loading, setloading] = useState(false);
    const [success, setsuccess] = useState(false);
    async function register(){
        if(password==confirmpassword)
        {
            const user={
                name,
                email,
                password,
                confirmpassword
            }
            console.log(user);
            try {
                setloading(true);
                const result=await axios.post(`${config.api}/api/users/register`,user);
                setloading(false);
                setsuccess(true);
                setname('');
                setemail('');
                setpassword('');
                setconfirmpassword('');
                window.location.href="/login";
                const regdata=result.data;
            } catch (error) {
                console.log(error);
                setloading(true);
                seterror(true);
            }
        }else{
            alert('passwords not matched')
        }
    }
  return (
    <div>
        {loading && (<Loader1/>)}
        {error && (<Error/>)}
       
        <div className='row justify-content-center pt-5 register-background'>
            <div className='col-md-5 mt-2'>
            {success && (<Success message='Registration Successful'/>)}
                <div className='register p-4'>
                    <h2 className='pad-10' style={{color:"white"}}>Register</h2>
                    <input type='text' className='form-control' placeholder='Name' value={name} onChange={(e)=>{setname(e.target.value)}}/>
                    <input type='text' className='form-control' placeholder='Email' value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                    <input type='text' className='form-control' placeholder='Password' value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                    <input type='text' className='form-control' placeholder='Confirm Password' value={confirmpassword} onChange={(e)=>{setconfirmpassword(e.target.value)}}/>
                <button className='btn btn-log mt-3' onClick={register}>Register</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register