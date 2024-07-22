import { useState, useEffect } from "react";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";

const SurveyPulicView = () => {
  const [loading, setLoading] = useState(false);
  const [survey, setSurvey] = useState(false);
  const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`survey/get-by-slug/${slug}`)
      .then(({ data }) => {
        setLoading(false);
        setSurvey(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);
  return <div></div>;
};

export default SurveyPulicView;
