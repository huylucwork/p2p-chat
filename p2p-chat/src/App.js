import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Axios from "axios";
import SideBar from "./chat/SideBar";
import Login from "./login/index";
import SignUp from "./signup/index";
import Loading from "./loading/loading";

function App() {

  const [login, setLogin] = useState(false);
  const [user, setUser] = useState();

  const [existUser, setExistUser] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/cn-signup-check-exist")
      .then((response)=>{
        setExistUser(response.data);
      })
      .catch((err)=>{})   
  },[]);

  const [allUser, setAllUser] = useState([]);
  const [allFriend, setAllFriend] = useState([]);
  const [allPort, setAllPort] = useState([]);
  const [allStranger, setAllStranger] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);

  useEffect(()=>{
    if (login) {
      setOpenLoading(true);
      Axios.post("http://localhost:3001/cn-all-user",{
          current_id: user[0].id
      })
          .then((response)=>{
              setAllUser(response.data);
              setOpenLoading(false);
          })
    }
  },[user])

  useEffect(()=>{
    if (login) {
      setOpenLoading(true);
      setAllStranger([]);
      setAllFriend([]);
      allUser.forEach((value) => {
          Axios.post("http://localhost:3001/cn-check-friend",{
              current_id: user[0].id,
              friend_id: value.id
          })
              .then((response)=>{
                  if (response.data.length === 0 && value.id !== user[0].id)
                      setAllStranger(oldArray => [...oldArray,value])
                  else if(value.id !== user[0].id)
                      setAllFriend(oldArray => [...oldArray,value])
              })
      })
      Axios.post("http://localhost:3001/cn-all-friend", {
        current_id: user[0].id
      })
        .then((response)=>{
          setAllPort(response.data)
        })
        setOpenLoading(false);
        setOpenLoading(false);
      }
  },[user])

  return (
    <div className="App">
      {openLoading && <Loading />}
      <Routes>
        <Route index element={<Login user={user} setUser={setUser} setLogin={setLogin}/>} /> 
        <Route path="sign-up" element={<SignUp existUser={existUser} />} />
        {login && 
        <Route 
          path="/chat" 
          element={<SideBar 
            user={user} setUser={setUser} setLogin={setLogin} 
            allFriend={allFriend} setAllFriend={setAllFriend}
            allStranger={allStranger} setAllStranger={setAllStranger}
            allPort={allPort} setAllPort={setAllPort}
        />} /> }
        {!login && <Route path="/chat" element={<Navigate to="/"/>} /> }
      </Routes>
    </div>
  );
}

export default App;
