import React, { useEffect, useState } from 'react'
import { MdMoreVert } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import io from "socket.io-client";
import { useSelector } from "react-redux";
const Home = () => {
    const UserID = useSelector((state) => state.user.id);
    console.log("In home", UserID)
    const [chat, setChat] = useState([]);
    const [otherchat, setOtherchat] = useState("");
    const [isclicked, setIsclicked] = useState(false);
    const [Name, setName] = useState("");
    const [formtoggle, setFormtoggle] = useState(false)
    const [selectedChat, setSelectedChat] = useState(null);

    const Navigate = useNavigate();


    const fetchchat = async () => {

        const res = await fetch("http://localhost:5000/chats", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserID })
        })

        if (res.ok) {
            const data = await res.json();
            setChat(data)
        }


        // const chatWithMessages = await Promise.all(
        //     data.map(async (chat) => {
        //         const msgRes = await fetch(`http://localhost:5000/messages/latest/${chat.chatId}`);
        //         const latestMsg = await msgRes.json();
        //         return { ...chat, latestMsg: latestMsg ? latestMsg.text : "" };
        //     })
        // );

    }
    const changeformtoggle = () => {
        setFormtoggle(!formtoggle)
    }
    useEffect(() => {
        fetchchat();

    }, []);

    const startnewchat = async (e) => {
        e.preventDefault();
        const storechat = await fetch("http://localhost:5000/storechats", {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ UserID, otherchat, Name, senderId: UserID })
        })
        if (storechat.ok) {
            const message = await storechat.json()
            alert(message.message)
        }
        fetchchat();
        changeformtoggle(formtoggle)

    }
    const logout = async () => {
        const logout = await fetch("http://localhost:5000/logout")
        if (logout.ok) {
            const rt = await logout.json()
            alert(rt.message)
            Navigate("/login")
        }
    }
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", paddingTop: "30px",
            background: "linear-gradient(135deg, #6e8efb, #a777e3)",

        }}>


            {formtoggle && <form onSubmit={startnewchat} style={{
                display: "flex",
                border: "2px solid black",
                height: "270px",
                width: "240px",
                top: "20%",
                left: "22%",
                position: "absolute",
                zIndex: "1",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                backdropFilter: "blur(4px)",
                gap: "10px",
                paddingLeft: "10px",
                borderRadius: "12px",
                fontWeight: "bold",
                // background: "linear-gradient(135deg, #6e8efb, #a777e3)",

            }}>
                <p style={{ marginLeft: 'auto', marginBottom: "5px", paddingRight: "10px" }} onClick={() => changeformtoggle(formtoggle)}>❌</p>
                <p style={{ marginBottom: "7px" }}>Add A New Member</p>
                <p>Enter other userID</p>
                <input type="text" value={otherchat} id="" onChange={(e) => setOtherchat(e.target.value)} required style={{
                    padding: "3px",
                    borderRadius: "7px",
                    border: "2px solid rgb(221, 221, 221)",
                }} />
                <p>Enter Name</p>
                <input type="text" value={Name} id="" onChange={(e) => setName(e.target.value)} required style={{
                    padding: "3px",
                    borderRadius: "7px",
                    border: "2px solid rgb(221, 221, 221)",
                }} />
                <button type="submit" style={{
                    borderRadius: "5px",
                    height: "25px",
                    marginTop: "7px",
                    padding: "3px"
                }} >Start A New Chat</button>
            </form>}
            <div style={{
                width: "1051px",
                height: "617px",
                border: "0.1px solid aqua",
                borderRadius: "20px",
                backgroundColor: "white",
            }}>
                <div style={{
                    height: "70px",
                    display: "flex",
                    position: "relative",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }}>
                        <p style={{
                            position: "absolute",
                            top: "10px",
                            left: "33px",
                            zIndex: "1",
                        }}>💬</p>
                        <div style={{
                            width: "60px",
                            height: "30px",
                            background: "white",
                            borderRadius: "60px 60px 0 0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            marginRight: "15px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            marginLeft: "20px",
                        }}></div>
                        <p style={{ fontSize: "25px", color: "white", fontWeight: "bold" }}>CHATAPP</p>
                    </div>
                    {isclicked && < div style={{
                        position: "absolute",
                        textAlign: "center",
                        right: "40px",
                        backgroundColor: "white",
                        padding: "8px",
                        borderRadius: "10px"
                    }}>
                        <p>Profile</p>
                        <p onClick={logout}>Logout</p>
                    </div>}
                    <MdMoreVert size={34} style={{ cursor: "pointer", color: "white", paddingRight: "10px" }} onClick={() => setIsclicked(!isclicked)} />
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    // alignItems: "center",
                }}>
                    <div style={{ display: "flex", gap: "20px", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", marginLeft: "24px", width: "30%", borderRight: "1px solid #e9ecef", }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <h2 style={{
                                fontWeight: "600",
                                color: "#495057",
                                fontSize: "20px"
                            }}>Chats</h2>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50px",
                                color: "white",
                                fontSize: "24px",
                                background: "#6e8efb",
                            }} onClick={() => changeformtoggle(formtoggle)}>+</div>
                        </div>
                        <input type="text" placeholder='Search...' id="" style={{
                            width: "100%",
                            padding: "12px 15px 12px 40px",
                            borderRadius: "25px",
                            border: "1px solid #ddd",
                            background: "white",
                            fontSize: "14px",
                        }} />
                        <div style={{ overflowY: "auto", height: "420px" }}>
                            {chat && chat.map((el, index) => (
                                <div key={index} style={{
                                    display: "flex",
                                    gap: "14px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: " 5px",
                                    padding: "14px",

                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "50px",
                                        width: "50px",
                                        height: "50px",
                                        fontWeight: "bold",
                                        fontSize: "15px",
                                        color: "white",
                                        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                                    }}>{el.senderId === UserID ? el.Name.trim().slice(0, 2).toUpperCase() : "Un"}</div>
                                    <div key={index} style={{  //Here onclick
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                        width: "150px",
                                    }} onClick={() => setSelectedChat(el.chatId)}>
                                        <p style={{
                                            color: " #495057", fontWeight: "600",
                                        }}>{el.senderId === UserID ? el.Name : "Unknown"}</p>
                                        <p style={{
                                            color: " #6c757d",
                                            fontSize: "14px",
                                            whiteSpace: " nowrap",
                                            overFlow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "150px",
                                        }}>I have sent you a mess..</p>

                                    </div>
                                    <p style={{
                                        color: " #6c757d",
                                        fontSize: "14px",
                                        whiteSpace: " nowrap",
                                        overFlow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "150px",
                                    }}>10:30</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{
                        marginLeft: "20px",
                        color: "black",
                        width: "100%",
                        backgroundColor: "#efeae2",
                        borderBottomRightRadius: "15px",
                    }}>
                        {selectedChat ? (
                            <ChatWindow
                                chatId={selectedChat} // 👈 pass chatId here
                            // chat={chat}

                            />
                        ) : (
                            <div style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                alignItems: "center",

                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    textAlign: "center",
                                    width: "80%",


                                }}>
                                    <div style={{ fontSize: "80px" }}>💬</div>
                                    <h2>Welcome to ChatApp</h2>
                                    <p style={{}}>Select a chat from the list or start a new conversation. Share your UserID with your friend to begin messaging, or enter their User ID to start a chat. This is your UserID-<strong>{UserID}</strong></p>
                                    <button style={{
                                        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                                        color: "white",
                                        border: "none",
                                        width: "40%",
                                        marginLeft: "30%",
                                        marginTop: "20px",
                                        padding: "12px 30px",
                                        borderRadius: "25px",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        transition: "transform 0.2s, box-shadow 0.2s"
                                    }} onClick={() => changeformtoggle(formtoggle)}>Start New Chat</button>
                                </div>
                            </div>


                        )}
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Home
