import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import QuestionEditor from "./QuestionEditor";

const SurveyQuestions = ({ questions, onQuestionsUpdate }) => {
  const [myQuestions, setMyQuestions] = useState([...questions]);

  const addQuestion = (index) => {
    index = index ?? myQuestions.length;
    myQuestions.splice(index, 0, {
      id: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
    });
    setMyQuestions([...myQuestions]);
    onQuestionsUpdate(myQuestions);
  };

  const deleteQuestion = (question) => {
    const newQuestions = myQuestions.filter((q) => q.id !== question.id);
    setMyQuestions(newQuestions);
    onQuestionsUpdate(newQuestions);
  };
  const questionChange = (question) => {
    if (!question) return;
    const newQuestions = myQuestions.map((val) => {
      if (val.id === question.id) {
        return { ...question };
      }
      return val;
    });
    setMyQuestions(newQuestions);
    onQuestionsUpdate(newQuestions);
  };

    useEffect(() => {
      setMyQuestions(questions);
    }, [questions]);

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Questions</h3>
        <button
          type="button"
          className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
          onClick={() => addQuestion()}
        >
          <PlusIcon className="w-4 mr-2" />
          Add question
        </button>
      </div>
      {myQuestions.length ? (
        myQuestions.map((q, ind) => (
          <QuestionEditor
            key={q.id}
            index={ind}
            question={q}
            questionChange={questionChange}
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
          />
        ))
      ) : (
        <div className="text-gray-400 text-center py-4">
          You don't have any questions created
        </div>
      )}
    </>
  );
};
export default SurveyQuestions;
