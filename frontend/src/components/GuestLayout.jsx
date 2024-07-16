import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider";


const GuestLayout = () => {
  const { userToken } = userStateContext();
  if (userToken) {
    console.log(12, userToken)
    return <Navigate to="/" />
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default GuestLayout;
