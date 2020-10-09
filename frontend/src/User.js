import React, { Component } from 'react'
import axios from './config/axios'
import './MyProfile.css'
import { ShoppingFilled, HeartFilled, UserOutlined, HomeFilled, MessageFilled, PlusOutlined, BellFilled, DropboxOutlined } from '@ant-design/icons';
import LocalStorageService from './services/localStorageService'

class User extends Component {
    state = {
        profile_pic: '',
        cover_pic: '',
        first_name: '',
        last_name: '',
        my_id: '',
        my_profile_pic: '',
        my_first_name: '',
        my_last_name: '',
        friendSearch: '',
        status: 'Add Friend',
        friendId: 0,
        request_from: 0,
        request_to: 0,
        friendNumber: 0,
        friendInfo: [],
        postText: '',
        postImage: '',
        // postInfo: {}
        posts: [],
        posters: [],
        postInfo: []
    }
    findProfile = () => {
        window.location.replace('/user/' + this.state.searchFriends)
    }
    componentDidMount = () => {
        let myUsername = LocalStorageService.getUsername()
        axios.get('http://localhost:8000/users/profile/' + myUsername).then(res => {
            const { profile_pic, first_name, last_name, id } = res.data
            // console.log(res.data)
            this.setState({ my_profile_pic: profile_pic, my_first_name: first_name, my_last_name: last_name, my_id: id })
        })
        axios.get('http://localhost:8000/posts').then(res => {
            // console.log(res.data)
            this.setState({ posts: res.data })
            // console.log(res.data[0].user_id)
            for (let i = 0; i < res.data.length; i++) {
                axios.get('http://localhost:8000/users/profileId/' + res.data[i].user_id).then(res => {
                    // console.log(res.data.targetProfile)
                    this.setState({ posters: [...this.state.posters, res.data.targetProfile] })
                })
            }
        })

        axios.get('http://localhost:8000/users/allusers/' + this.props.username).then(res => {
            const { profile_pic, cover_pic, first_name, last_name, id } = res.data
            this.setState({ profile_pic, cover_pic, first_name, last_name, friendId: id })
            axios.get('http://localhost:8000/friends/requests/number/' + Number(this.state.friendId)).then(res => {
                let storeId = []
                for (let i = 0; i < res.data.length; i++) {
                    storeId.push(res.data[i].request_from_id, res.data[i].request_to_id)

                }
                storeId = storeId.filter(el => el !== id)
                console.log(storeId)
                let info = []
                for (let i = 0; i < storeId.length; i++) {
                    axios.get('http://localhost:8000/users/profileId/' + storeId[i]).then(res => {
                        this.setState({ friendInfo: [...this.state.friendInfo, res.data.targetProfile] })
                    })
                }
                // console.log(info)
                this.setState({ friendNumber: res.data.length, friendInfo: info })
            })
        })
            .then(() => {
                axios.get('http://localhost:8000/friends/requests/' + Number(this.state.friendId)).then(res => {
                    this.setState({ status: res.data.status, request_from: res.data.request_from_id, request_to: res.data.request_to_id })
                }).catch((err) => err)
            })
    }
    getPosts = () => {
        let newArr = this.state.posts
        for (let i = 0; i < this.state.posts.length; i++) {
            newArr[i].profile_pic = this.state.posters[i].profile_pic
            newArr[i].first_name = this.state.posters[i].first_name
            newArr[i].last_name = this.state.posters[i].last_name
        }
        // console.log(newArr)
        this.setState({ postInfo: newArr })
    }
    addFriend = () => {
        axios.post('http://localhost:8000/friends/requests/' + Number(this.state.friendId)).then(() => {
            axios.get('http://localhost:8000/friends/requests/' + Number(this.state.friendId)).then(res => {
                this.setState({ status: res.data.status })
            }).catch((err) => err)
            window.location.reload()
        })
    }
    acceptFriend = () => {
        axios.put('http://localhost:8000/friends/requests/' + Number(this.state.friendId)).then((res) => {
            this.setState({ status: res.data.status })
            window.location.reload()
        })
    }
    declineFriend = () => {
        axios.delete('http://localhost:8000/friends/requests/' + Number(this.state.friendId)).then((res) => {
            this.setState({ status: res.data.status })
            window.location.reload()
        })
    }
    toProfile = () => {
        window.location.replace('/myprofile')
    }
    goToProfile = (username) => {
        window.location.replace('/user/' + username)
    }
    submitPost = () => {
        const post = { text: this.state.postText, picture: this.state.postImage }
        axios.post('http://localhost:8000/posts/', post)
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
                            <div className="userInfo" onClick={this.toProfile}>
                                <img src={"../" + this.state.my_profile_pic} className="userlogo" />
                                <div>{this.state.my_first_name}</div>
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
                            <img src={"../" + this.state.cover_pic} className="coverImage" />
                        </div>
                        <img src={"../" + this.state.profile_pic} className="profileImage" />
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

                            {this.state.status === 'Add Friend' && <button style={{ border: 'none', padding: '10px' }} onClick={this.addFriend}>{this.state.status}</button>}
                            {this.state.status === 'pending' &&
                                <div>
                                    {this.state.request_to === this.state.my_id && <button onClick={this.acceptFriend}>Accept Friend</button>}
                                    {this.state.request_to === this.state.my_id && <button onClick={this.declineFriend}>Decline Friend</button>}
                                    {this.state.request_from === this.state.my_id && <button>Requested</button>}
                                </div>}
                            {this.state.status === 'friend' && <button>Friends</button>}
                            <button onClick={this.getPosts} style={{ border: 'none', padding: '10px' }}>Get posts</button>
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
                                            <div className="friendImg">
                                                <img src={"../" + el.profile_pic} className="friendsPics" />
                                            </div>
                                            <p style={{ margin: 0 }}>{el.first_name}</p>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="about">
                                <h4>About</h4>
                                <p>Software Engineer at TOYOTA TSUSHO DENSO ELECTRONICS (THAILAND) CO., LTD.</p>
                                <p>Education: Electronic and Telecommunication Engineering at KMUTT</p>
                                <p>Single</p>
                            </div>
                            <div className="about" style={{ height: '200px' }}>
                                <h4>Images</h4>
                                <div className="friendDiv">
                                    <div className="friendImg" style={{ borderRadius: '5px', overflow: 'hidden' }}>
                                        <img src="../images/img1.jpg" />
                                    </div>
                                    <div className="friendImg">
                                        <img src="../images/img2.jpg" />
                                    </div>
                                    <div className="friendImg">
                                        <img src="../images/img3.jpg" />
                                    </div>
                                </div>
                            </div>
                            <div className="about"></div>
                        </div>
                        <div className="contentRight">
                            <div className="addPost">
                                <div className="addPostTop">
                                    <img src={"../" + this.state.my_profile_pic} className="userlogo" />
                                    <input type="text" placeholder="What's on your mind" value={this.state.postText} onChange={(e) => this.setState({ postText: e.target.value })} />
                                </div>
                                <div className="addPostBottom">
                                    <input type="text" placeholder="Image url" value={this.state.postImage} onChange={(e) => this.setState({ postImage: e.target.value })} style={{ width: '280px' }} />
                                    <button style={{ border: 'none', background: 'none', fontSize: '10px', }} onClick={this.submitPost}>Submit</button>
                                </div>
                            </div>

                            {this.state.postInfo.map(el => {
                                return <div className="posts">
                                    <div className="posterInfo">
                                        <img src={"../" + el.profile_pic} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                        <p>{el.first_name} {el.last_name}</p>
                                    </div>
                                    <p>{el.text}</p>
                                    <img src={"../" + el.picture} style={{ width: '60%', height: '60%' }} />
                                </div>

                            })}
                            <div className="about" style={{ marginTop: '20px', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={"../" + this.state.profile_pic} className="userlogo" />
                                        <p style={{ marginLeft: '10px' }}><b>{this.state.first_name} {this.state.last_name}</b></p>
                                    </div>
                                </div>

                                <div className="postImage">
                                    <img src="../posts/post.png" />
                                </div>
                            </div>
                            <div className="about" style={{ marginTop: '20px', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={"../" + this.state.profile_pic} className="userlogo" />
                                        <p style={{ marginLeft: '10px' }}><b>{this.state.first_name} {this.state.last_name}</b></p>
                                    </div>
                                </div>

                                <div className="postImage">
                                    <img src="../posts/post.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default User
