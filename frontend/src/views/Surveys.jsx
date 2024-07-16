import { useState } from "react";
import "../App.css";
import HeaderMainComponent from "../components/Header-main-Component";
import { userStateContext } from "../contexts/ContextProvider";
import SurveyListItem from "../components/SurveyListItem";

function Surveys() {
  const { surveys } = userStateContext();
  console.log(33, surveys);
  const OnDeleteClick = () => {
    console.log("delete");
  };
  return (
    <HeaderMainComponent title={"Surveys"}>
      {/* Surveys */}
      {surveys.map((survey) => (
        // <div key={survey.id}>{survey.title}</div>
        <SurveyListItem
          key={survey.id}
          survey={survey}
          OnDeleteClick={OnDeleteClick}
        />
      ))}
    </HeaderMainComponent>
  );
}

export default Surveys;
