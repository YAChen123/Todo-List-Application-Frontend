import React, { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import ToDoCard from "./ToDoCard";
import NewToDo from "./NewToDo";

function Dashboard() {
  const { user, completeToDos, incompleteToDos } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && navigate) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="dashboard">
        <NewToDo />
      <div className="todos">
        {incompleteToDos.map((toDo) => (
          <ToDoCard toDo={toDo} key={toDo.uuid}/>
        ))}
      </div>

      {completeToDos.length > 0 && (
        <div className="todos">
          <h2 className="todos__title">Complete Todo's</h2>
          {completeToDos.map((toDo) => (
            <ToDoCard toDo={toDo} key={toDo.uuid}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
