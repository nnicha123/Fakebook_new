import React, { Component } from 'react'
import './MyProfile.css'
import { ShoppingFilled, HeartFilled, UserOutlined, HomeFilled, MessageFilled, PlusOutlined, BellFilled, DropboxOutlined } from '@ant-design/icons';
import axios from './config/axios'
import LocalStorageService from './services/localStorageService'

class MyProfile extends Component {
    state = {
        profile_pic: '',
        cover_pic: '',
        first_name: '',
        last_name: '',
        searchFriends: '',
        id: '',
        friendNumber: 0,
        friendInfo: []
    }
    componentDidMount = () => {
        let username = LocalStorageService.getUsername()
        axios.get('http://localhost:8000/users/profile/' + username).then(res => {
            const { profile_pic, cover_pic, first_name, last_name, id } = res.data
            this.setState({ profile_pic, cover_pic, first_name, last_name, id })
            axios.get('http://localhost:8000/friends/requests/number/' + Number(this.state.id)).then(res => {
                console.log(res.data)
                let storeId = []
                for (let i = 0; i < res.data.length; i++) {
                    storeId.push(res.data[i].request_from_id, res.data[i].request_to_id)

                }
                storeId = storeId.filter(el => el !== id)
                for (let i = 0; i < storeId.length; i++) {
                    axios.get('http://localhost:8000/users/profileId/' + storeId[i]).then(res => {
                        console.log(res.data.targetProfile)
                        this.setState({ friendInfo: [...this.state.friendInfo, res.data.targetProfile] })
                    })
                }
                this.setState({ friendNumber: res.data.length })
            })
        })
    }
    logout = () => {
        LocalStorageService.removeToken()
        LocalStorageService.removeUsername()
        window.location.replace('/')
    }
    findProfile = () => {
        window.location.replace('user/' + this.state.searchFriends)
    }
    goToProfile = (username) => {
        window.location.replace('/user/' + username)
    }
    render() {
        return (
            <div className="profileWrapper">
                <div className="navWrapper">
                    <nav>
                        <div className="logoSearch">
                            <div className="logoBackground">f</div>
                            <input type="text" placeholder="Search Friends" onChange={(e) => this.setState({ searchFriends: e.target.value })} />
                            <button style={{ border: 'none', padding: '10px' }} onClick={this.findProfile}>Ok</button>
                        </div>
                        <div className="centerIcons">
                            <HeartFilled />
                            <ShoppingFilled />
                            <UserOutlined />
                            <HomeFilled />
                        </div>
                        <div className="rightBar">
                            <div className="userInfo">
                                <img src={this.state.profile_pic} className="userlogo" />
                                <div>{this.state.first_name}</div>
                            </div>
                            <div className="rightIcons">
                                <div><PlusOutlined /></div>
                                <div><MessageFilled /></div>
                                <div><BellFilled /></div>
                                <div><DropboxOutlined /></div>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="outerHead">
                    <div className="head">
                        <div className="coverImg" >
                            <img src={this.state.cover_pic} className="coverImage" />
                        </div>
                        <img src={this.state.profile_pic} className="profileImage" />
                        <div className="headerBottom">
                            <h1>{this.state.first_name} {this.state.last_name}</h1>
                        </div>
                        <div className="headerOptions">
                            <ul className="optionList">
                                <li>Timeline</li>
                                <li>About</li>
                                <li style={{ display: 'flex' }}>
                                    <div style={{ marginRight: '3px' }}>Friends</div>
                                    <div className="numberOfFriends">{this.state.friendNumber}</div>
                                </li>
                                <li>Images</li>
                                <li>Videos</li>
                            </ul>
                            <button onClick={this.logout}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="contentPage">
                        <div className="contentLeft">
                            <div className="about">
                                <h4>Friends</h4>
                                <div className="friendDiv">
                                    {this.state.friendInfo.map((el, indx) => {
                                        return <div key={indx + 1} onClick={() => this.goToProfile(el.username)}>
                                            <img src={el.profile_pic} className="friendsPics" />
                                            <p style={{ margin: 0 }}>{el.first_name}</p>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="about">
                                <h4>About</h4>
                            </div>
                            <div className="about"></div>
                            <div className="about"></div>
                        </div>
                        <div className="contentRight">
                            <div className="addPost">
                                <div className="addPostTop">
                                    <img src={this.state.profile_pic} className="userlogo" />
                                    <input type="text" placeholder="What's on your mind" />
                                </div>
                                <div className="addPostBottom">
                                    <input type="text" placeholder="Image url" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default MyProfile
