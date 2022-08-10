import React,{Component} from "react";
import ReactDOM from "react-dom";
import { w3cwebsocket as w3CWebsocket } from "websocket";


import {Card, Avatar, Input, Typography} from "antd"
import 'antd/dist/antd.css'


const {Search} = Input 
const {Text} = Typography 

const client = new w3CWebsocket('ws://127.0.0.1:8000')

export default class App extends Component {


    state = {
        userName: '',
        isLoggedIn: false,
        message: [],
        searchValue: ''
    }

    componentDidMount() {

      

        client.onopen = () => {
            console.log('Kết Nối Với DB Thành Công !!!')
        }

        // Db trả về
        client.onmessage = (message) => {
            console.log(message)

            const dataFromServer = JSON.parse(message.data)

            console.log('got reply', dataFromServer)

            if(dataFromServer.type === 'message'){
                this.setState({
                    message: [...this.state.message, {
                        msg: dataFromServer.msg,
                        user: dataFromServer.user
                    }]
                })
            }
        }
    }


    handleOnclickBtn = (value) => {

        // Client gui di 
        client.send(JSON.stringify({
            type: "message",
            msg: value,
            user: this.state.userName
        }))


    }

    render() {
        return (
            <div className='main'>
                {this.state.isLoggedIn ? 

                   <div>
                        <div className='title'>
                            <Text type="secondary" style={{fontSize: '36px'}}></Text>
                        </div>
    
                        {this.state.message.map((message,index) => 
                            <p key={index}>{message.user} ---- {message.msg}</p>    
                        )}
                        <div className='bottom'>
                            <Search
                                placeholder='input message and send'
                                enterButton='Send'
                                value={this.state.searchValue}
                                size='large'
                                onChange={(e) => this.setState({searchValue: e.target.value})}
                                onSearch={value => this.handleOnclickBtn(value)}
                            />
                        </div>
                   </div>

                :
                <div style={{padding: '200px 40px'}}>
                    <Search 
                        placeholder="Enter Username"
                        enterButton='Login'
                        size="large"
                        onSearch={value => this.setState({ isLoggedIn: true, userName: value})}
                    />

                </div>
                }
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))