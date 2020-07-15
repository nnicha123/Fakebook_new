import React, { Component } from 'react'
import './Register.css'
import axios from 'axios'

class Register extends Component {
    state = {
        username: '',
        password: '',
        first_name: '',
        last_name:'',
        profile_pic: ''
    }
    submit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/users/register',this.state).then(res => this.setState({first_name:'',username:'',password:'',last_name:''}))
        .catch(err => console.log(err))
    }
    render() {
        return (
            <div className="outerRegister">
                <div className="registerLeft"></div>
                <div className="registerRight">
                    <form onSubmit={this.submit}>
                        <h3 style={{margin:0}}>Create an account</h3>
                        <p>It's quick and easy</p>
                        <div class="nameGroup">
                            <div className="form-group">
                                <label>First name</label>
                                <input type="text" placeholder="First name" value={this.state.first_name} onChange={(e) => this.setState({first_name:e.target.value})}/>
                            </div> 
                            <div className="form-group">
                                <label>Surname</label>
                                <input type="text" placeholder="Surname" value={this.state.last_name} onChange={(e) => this.setState({last_name:e.target.value})}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
                        </div>
                        <button type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Register
