import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import { v4 as uuidv4 } from "uuid";
import BASE_URL from "../config";

function NewToDo() {
  const { addToDo } = useGlobalContext();
  const [title, setTitle] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const api = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newTask = {
        uuid : uuidv4(),
        title : title,
    }

    api.post(`${BASE_URL}/api/tasks/task/add`, newTask).then((res) => {
      setTitle("");
      addToDo(res.data);
    });
  };
  return (
    <form className="new" onSubmit={onSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn" type="submit" disabled={title.length ===0}>
        add
      </button>

    </form>
  );
}

export default NewToDo;
