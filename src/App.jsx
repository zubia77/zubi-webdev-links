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
        return Object.keys(currentUser).length > 0;
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
                setCurrentUser({});
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

    const handleDeleteLink = async () => {
        const response = await fetch(backend_base_url + "/linklists:_id", {
            method: "DELETE",
        })
        

        if (response.ok) {
          getLinklist();  
        }
    }

    const handleLogoutButton = () => {
        localStorage.removeItem("token", "");
        setCurrentUser({});
    };

    return (
        <div className="App">
            <h1>Zubi's Webdev Links</h1>

            {userIsLoggedIn() ? (
                <>
                    <Linkform />
                    <p>There are {linkList.length} links</p>
                    <ul>
                        {linkList.map((linkList, i) => {
                            return (
                                <a key={i} href={linkList.url} target="_blank">
                                    <li key={i}>
                                        {linkList.title}
                                        <button className="delete" onClick={handleDeleteLink}>X</button>
                                    </li>
                                </a>
                            );
                        })}
                    </ul>
                    <button className="logout" onClick={handleLogoutButton}>
                        Logout
                    </button>
                </>
            ) : (
                <form className="login" onSubmit={handleLoginButton}>
                    <div className="row">
                        username:{" "}
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                        />
                    </div>
                    <div className="row">
                        password:{" "}
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
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
