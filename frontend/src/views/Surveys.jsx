import { useEffect, useState } from "react";
import "../App.css";
import HeaderMainComponent from "../components/Header-main-Component";
import { userStateContext } from "../contexts/ContextProvider";
import SurveyListItem from "../components/SurveyListItem";
import axiosClient from "../axios";

function Surveys() {
  const { showToast } = userStateContext();
  const [mege, setMege] = useState({});
  const [surveys, setSurveys] = useState([]);

  const OnDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      axiosClient.delete(`/survey/${id}`).then(() => {
        getSurveys();
        showToast('The survey was deleted');
      });
    }
  };

  const getSurveys = (url) => {
    url = url || "/survey";
    axiosClient.get(url).then(({ data }) => {
      // console.log(43, data);
      setMege(data);
      setSurveys(data.data);
    });
  };
  useEffect(() => {
    getSurveys();
  }, []);
  return (
    <HeaderMainComponent title={"Surveys"}>
      {surveys.map((survey) => (
        <SurveyListItem
          key={survey.id}
          survey={survey}
          onDeleteClick={OnDeleteClick}
        />
      ))}
    </HeaderMainComponent>
  );
}

export default Surveys;
