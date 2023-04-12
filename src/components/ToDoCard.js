import React, { useState, useRef } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import BASE_URL from "../config";

function ToDoCard({ toDo }) {
  const [title, setTitle] = useState(toDo.title);
  const [editing, setEditing] = useState(false);
  const input = useRef(null);
  const { toDoComplete, toDoIncomplete, removeToDo, updateToDo } =
    useGlobalContext();

  const onEdit = (e) => {
    e.preventDefault();
    setEditing(true);
    input.current.focus();
  };

  const stopEditing = (e) => {
    if (e) {
      e.preventDefault();
    }

    setEditing(false);
    setTitle(toDo.title);
  };

  const markAsComplete = (e) => {
    e.preventDefault();
    const updatedToDo = { ...toDo, isCompleted: true };
    const token = localStorage.getItem("token");
    const api = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    api.put(`${BASE_URL}/api/tasks/task/complete`, updatedToDo).then((res) => {
      toDoComplete(res.data);
    });
  };

  const markAsIncomplete = (e) => {
    e.preventDefault();
    const updatedToDo = { ...toDo, isCompleted: false };
    const token = localStorage.getItem("token");
    const api = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    api.put(`${BASE_URL}/api/tasks/task/incomplete`, updatedToDo).then((res) => {
      toDoIncomplete(res.data);
    });
  };

  const deleteToDo = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const api = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (window.confirm("Are you sure you want to delete this Todo?"))
      api.delete(`${BASE_URL}/api/tasks/task/${toDo.uuid}/delete`).then(() => {
        removeToDo(toDo);
      });
  };

  const editToDo = (e) => {
    e.preventDefault();
    const updatedToDo = { ...toDo, title: title };
    const token = localStorage.getItem("token");
    const api = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    api
      .put(`${BASE_URL}/api/tasks/task/edit`, updatedToDo)
      .then((res) => {
        updateToDo(res.data);
        setEditing(false);
      })
      .catch((err) => {
        console.log(err)
        stopEditing();
      });
  };

  return (
    <div className={`todo ${toDo.completed ? "todo--complete" : ""}`}>
      <input
        type="checkbox"
        checked={toDo.completed}
        onChange={!toDo.completed ? markAsComplete : markAsIncomplete}
      />
      <input
        type="text"
        ref={input}
        value={title}
        readOnly={!editing}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="todo__controls">
        {!editing ? (
          <>
            {!toDo.completed && <button onClick={onEdit}>Edit</button>}
            <button onClick={deleteToDo}>Delete</button>
          </>
        ) : (
          <>
            <button onClick={stopEditing}>Cancel</button>
            <button onClick={editToDo}>Save</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ToDoCard;
