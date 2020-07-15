import React, { Component } from 'react'
import './Form.css'
import axios from 'axios'
import Register from './Register'
import LocalStorageService from './services/localStorageService'

class Login extends Component {
    state = {
        username: '',
        password: ''
    }
    submit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/users/login', this.state).then(res => {
            console.log(res.data)
            LocalStorageService.setToken(res.data.token)
            LocalStorageService.setUsername(res.data.username)
            window.location.replace('/myprofile')
        })
            .catch(err => console.log(err))

    }
    render() {
        return (
            <div className="wrapLoginRegister">
                <div className="outerWrapper">
                    <h3 style={{ margin: 0, color: 'white', padding: '10px 0', fontSize: '40px' }}>facebook</h3>
                    <form onSubmit={this.submit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
                <Register/>
            </div>
        )
    }

}

export default Login
