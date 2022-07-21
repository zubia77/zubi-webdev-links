import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Linkform from "./components/Linkform.jsx";

const backend_url = import.meta.env.VITE_BACKEND_URL;
const backend_base_url = "http://localhost:3060";

function App() {
    const [linkList, setLinkList] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const userIsLoggedIn = () => {
        return currentUser.username !== "anonymousUser";
    };

    const getLinklist = () => {
        (async () => {
            setLinkList(
                (await axios.get(backend_base_url + "/linklists")).data
            );
        })();
    };

    useEffect(() => {
        (async () => {
            const response = await fetch(backend_base_url + "/maintain-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
                getLinklist();
            } else {
                const response = await fetch(backend_base_url + "/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "anonymousUser",
                        password: "anonymousUser123",
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    getLinklist();
                    setCurrentUser(data.user);
                    localStorage.setItem("token", data.token);
                } else {
                    setMessage("bad login");
                }
            }
        })();
    }, []);

    const handleLoginButton = async (e) => {
        e.preventDefault();
        const response = await fetch(backend_base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        setUsername("");
        setPassword("");
        if (response.ok) {
            const data = await response.json();
            getLinklist();
            setCurrentUser(data.user);
            localStorage.setItem("token", data.token);
        } else {
            setMessage("bad login");
        }
    };

    const currentUserIsInAccessGroup = (accessGroup) => {
        if (currentUser.accessGroups) {
            return currentUser.accessGroups.includes(accessGroup);
        } else {
            return false;
        }
    };

    const handleDeleteLink = async () => {
        const response = await fetch(backend_base_url + "/linklists:_id", {
            method: "DELETE",
        });

        if (response.ok) {
            getLinklist();
        }
    };

    const handleLogoutButton = () => {
        localStorage.removeItem("token");
        setCurrentUser({ username: "anonymousUser" });
    };

    return (
        <div className="App">
            <h1>Zubi's Webdev Links</h1>

            <div className="loggedInInfo">
                {userIsLoggedIn() && (
                    <div className="info">
                        <div >
                            {currentUserIsInAccessGroup("administrators") && (
                                <div>info for administrators</div>
                            )}
                            {currentUserIsInAccessGroup("jobSeekers") && (
                                <div>new job information for job seekers</div>
                            )}
                        </div>
                        Logged in: {currentUser.firstName}{" "}
                        {currentUser.lastName}
                    </div>
                )}
            </div>

            {userIsLoggedIn() ? (
                <>  <button className="logout" onClick={handleLogoutButton}>
                        Logout
                    </button>
                    <p className="infoLinks">There are {linkList.length} links</p>{" "}
                  
                    <Linkform />
                    <ul>
                        {linkList.map((linkList, i) => {
                            return (
                                <a key={i} href={linkList.url} target="_blank">
                                    <li key={i}>
                                        {linkList.title}
                                        {/* <button
                                            className="delete"
                                            onClick={handleDeleteLink}
                                        >
                                            X
                                        </button> */}
                                    </li>
                                </a>
                            );
                        })}
                    </ul>
                </>
            ) : (
                <form className="login" onSubmit={handleLoginButton}>
                    <div className="row">
                        {" "}
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            placeholder="Username..."
                        />
                    </div>
                    <div className="row">
                        {" "}
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password..."
                        />
                    </div>
                    <div className="row">
                        <button>Login</button>
                    </div>
                    <div className="row">{message}</div>
                </form>
            )}
        </div>
    );
}

export default App;
