import { Button } from "@headlessui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import TButton from "./core/TButton";

const HeaderMainComponent = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl flex justify-between px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {title=="Surveys"&&(
          <TButton onClick={()=>navigate('/surveys/create')} className="text-xl flex items-center bg font-bold tracking-tight text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Surver
          </TButton>
          )}
        </div>
      </header>
      <main>
        <div className="mx-auto grid grid-cols-2 shadow-md max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
};

export default HeaderMainComponent;
