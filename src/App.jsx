import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

const backend_url = import.meta.env.VITE_BACKEND_URL 


function App() {
  const [linkList, setLinkList] = useState([])

useEffect(() => {
  (async () => {
    setLinkList((await axios.get(backend_url)).data);
  })()
}, [])
  return (
    <div className="App">
     <h1>Zubi's Webdev Links</h1>
     <p>There are {linkList.length} links</p>
     <ul>
                                    {linkList.map((linkList, i) => {
                                        return <a key={i} href={linkList.url} target="_blank"><li key={i}>{linkList.title}</li></a>;
                                    })}
                                </ul>
    </div>
  )
}

export default App
