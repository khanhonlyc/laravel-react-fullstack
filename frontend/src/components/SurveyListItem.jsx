import React from "react";
import TButton from "./core/TButton";

const SurveyListItem = ({survey, OnDeleteClick}) => {
  return (
    <>
    <div>{survey.title}</div>
    <TButton color="red" children={survey.id} onClick={OnDeleteClick} />
    </>
  );
};

export default SurveyListItem;
