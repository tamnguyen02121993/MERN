import React, { useState } from 'react';

function Login(props) {
    const initialUserState = {
        name: "",
        id: ""
    }

    const [user, setUser] = useState(initialUserState);
    function handleInputChange(e) {
        const {name, value} = e.target;
        setUser({...user, [name]: value})
    }

    function login() {
        props.login(user);
        props.history.push('/');
    }

    return (
        <div className="submit-form">
            <div>
                <div className="form-group">
                    <label htmlFor="user">Username</label>
                    <input type="text" className="form-control mt-2" id="name" required value={user.name} name="name" onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="user">ID</label>
                    <input type="text" className="form-control mt-2" id="id" required value={user.id} name="id" onChange={handleInputChange} />
                </div>
                <button type="button" className="btn btn-success mt-2" onClick={login}>Login</button>
            </div>
        </div>
    );
}

export default Login;