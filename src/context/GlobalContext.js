import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// initial state
const initialState = {
  user: null,
  fetchingUser: true,
  completeToDos: [],
  incompleteToDos: [],
};

// reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        fetchingUser: false,
      };
    case "SET_COMPLETE_TODOS":
      return {
        ...state,
        completeToDos: action.payload,
      };
    case "SET_INCOMPLETE_TODOS":
      return {
        ...state,
        incompleteToDos: action.payload,
      };
    case "RESET_USER":
      return {
        ...state,
        user: null,
        completeToDos: [],
        incompleteToDos: [],
        fetchingUser: false,
      };
    default:
      return state;
  }
};

// create the context
export const GlobalContext = createContext(initialState);

// provider component
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  // action: get current user
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const api = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await api.get("api/auth/current");
      if (res.data) {
        const toDosRes = await api.get("/api/tasks/user/get");

        if (toDosRes.data) {
          dispatch({ type: "SET_USER", payload: res.data });
          dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: toDosRes.data.completeToDos,
          });
          dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: toDosRes.data.incompleteToDos,
          });
        }
      } else {
        dispatch({ type: "RESET_USER" });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      //await axios.get("/api/auth/logout");

      dispatch({ type: "RESET_USER" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };

  const addToDo = (toDo) => {
    const newToDo = { ...toDo };
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: [newToDo, ...state.incompleteToDos],
    });
  };

  const toDoComplete = (toDo) => {
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: state.incompleteToDos.filter(
        (incompleteToDo) => incompleteToDo.uuid !== toDo.uuid
      ),
    });
    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: [toDo, ...state.completeToDos],
    });
  };

  const toDoIncomplete = (toDo) => {
    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: state.completeToDos.filter(
        (completeToDo) => completeToDo.uuid !== toDo.uuid
      ),
    });
    const newIncompleteToDos = [toDo, ...state.incompleteToDos];
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: newIncompleteToDos.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  };

  const removeToDo = (toDo) => {
    if (toDo.completed) {
      dispatch({
        type: "SET_COMPLETE_TODOS",
        payload: state.completeToDos.filter(
          (completeToDo) => completeToDo.uuid !== toDo.uuid
        ),
      });
    } else {
      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: state.incompleteToDos.filter(
          (incompleteToDo) => incompleteToDo.uuid !== toDo.uuid
        ),
      });
    }
  };

  const updateToDo = (toDo) => {
    if (!toDo.completed) {
      const newIncompleteToDos = state.incompleteToDos.map((incompleteToDo) =>
        incompleteToDo.uuid !== toDo.uuid ? incompleteToDo : toDo
      );
      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: newIncompleteToDos,
      });
    }else{
      const newCompleteToDos = state.CompleteToDos.map((completeToDo) =>
      completeToDo.uuid !== toDo.uuid ? completeToDo : toDo
    );
    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: newCompleteToDos,
    });
    }
  };
  const value = {
    ...state,
    getCurrentUser,
    logout,
    addToDo,
    toDoComplete,
    toDoIncomplete,
    removeToDo,
    updateToDo,
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}
