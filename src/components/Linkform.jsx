import { useState } from "react";

const backend_base_url = "http://localhost:3060";

const Linkform = () => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const link = {title, url, description, genre}

        const response = await fetch(backend_base_url + "/linklists", {
            method: "POST",
            body: JSON.stringify({ link }),
            headers: { "Content-Type": "application/json" },   
        });
        

        if (response.ok) {
            const links = await resp.json();
            setTitle(link.title)
            setUrl(link.url)
            setDescription(link.description)
            setGenre(link.genre)
            setError(null)
        }
    }

    return (
        <form className="addALink" onSubmit={handleSubmit}>
            <h3 className="linkform">Add a new link</h3>
            
            <input className="linkform"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Name"
            />
        
            <input className="linkform"
                type="text"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="URL"
            />
                
            <input className="linkform"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Description"
            />
                
            <input className="linkform"
                type="text"
                onChange={(e) => setGenre(e.target.value)}
                value={genre}
                placeholder="Genre"
            />
            <button>Add</button>
        </form>
    );
};

export default Linkform;
