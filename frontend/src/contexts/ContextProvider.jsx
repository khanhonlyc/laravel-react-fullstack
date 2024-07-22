import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios";

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  surveys: [],
  questionTypes: [],
  setCurrentUser: () => {},
  setUserToken: () => {},
  toast: {
    message: null,
    show: false,
  },
});

export const ContextProvider = ({ children }) => {
  // {
  //   name: "Tom Cook",
  //   email: "tom@example.com",
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  // }
  const [currentUser, setCurrentUser] = useState();
  // if (localStorage.getItem("TOKEN")) {
  //   useEffect(() => {
  //     axiosClient.post("/getauth").then((res) => {
  //       setCurrentUser(res.data.user);
  //     });
  //   }, []);
  // }
  const [userToken, _setUserToken] = useState(
    localStorage.getItem("TOKEN") || ""
  );

  const tmpSurveys = [
    {
      userId: 1,
      id: 1,
      title:
        "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
    },
    {
      userId: 1,
      id: 2,
      title: "qui est esse",
      body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
    },
    {
      userId: 1,
      id: 3,
      title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
      body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
    },
  ];
  const [surveys, setSurveys] = useState(tmpSurveys);
  const [toast, setToast] = useState({ message: "", show: false });
  const [questionTypes] = useState(['text', "select", "radio", "checkbox", "textarea"])

  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 5000);
  };

  const setUserToken = (token) => {
    if (token) {
      localStorage.setItem("TOKEN", token);
    } else {
      localStorage.removeItem("TOKEN");
    }
    _setUserToken(token);
  };
  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
        surveys,
        toast,
        setToast,
        showToast,
        questionTypes
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const userStateContext = () => useContext(StateContext);
