import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getToken } from "./authentication/authService";

import { AuthContext } from "./authentication/authContext";
import Spinner from "./components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getNextId } from "./utils/utility";

//API
import { API_CREATE_ITEM, API_FETCH_DATA } from "./api/apiEndpoints";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [jwtToken, setJwtToken] = useState("");
  const [spinner, setSpinner] = useState(false);
  const { userName } = useContext(AuthContext);

  useEffect(() => {
    const token = getToken("jwt_token");

    const fetchData = async (token) => {
      try {
        const response = await fetch(API_FETCH_DATA, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          toast("Error : Failed to fetch data");
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setItems(
          data.items.map((item) => {
            return {
              ...item,
              disabled: true,
              didChange: false,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token) {
      setJwtToken(token);
      fetchData(token);
    }
  }, []);

  // Create To do list Item
  const createItem = async () => {
    setSpinner(true);
    try {
      const newItem = {
        id: `${getNextId(items) + 1}`,
        title: newItemTitle,
        done: false,
        didChange: false,
        disabled: true,
      };
      const { didChange, disabled, ...reqData } = newItem;

      const response = await axios.post(API_CREATE_ITEM, reqData, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      newItem.didChange = false;
      setUndoStack([...undoStack, { action: "CREATE", items }]);
      setItems([...items, newItem]);
      setNewItemTitle("");
      setChangesMade(true);
      setSpinner(false);
      toast("Your item has been created");
    } catch (error) {
      console.error("Error creating item:", error);
      toast(
        `Error : ${
          error?.response?.data?.errors?.[0]?.message ||
          error?.message ||
          "Network Error Occured"
        }`
      );
      setSpinner(false);
    }
  };

  // To Delete Item
  const deleteItem = async (itemId) => {
    setSpinner(true);
    try {
      await axios.delete(
        `https://good-monday-js-test.vercel.app/to-do-items/${itemId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      const updatedItems = items.filter((item) => item.id !== itemId);
      setUndoStack([...undoStack, { action: "DELETE", items }]);
      setItems(updatedItems);
      setChangesMade(true);
      setSpinner(false);
      toast("Your item has been Deleted");
    } catch (error) {
      console.error("Error deleting item:", error);
      setSpinner(false);
      toast(
        `Error : ${
          error?.response?.data?.errors?.[0]?.message ||
          error?.message ||
          "Network Error Occured"
        }`
      );
    }
  };

  const handleEditItem = (itemId) => {
    setSpinner(true);
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          disabled: false,
        };
      }
      return item;
    });

    setUndoStack([...undoStack, { action: "EDIT", items }]);
    setItems(updatedItems);
    setChangesMade(true);
    setSpinner(false);
  };

  //Handle Title Change
  const handleNewItemChange = (e) => {
    setNewItemTitle(e.target.value);
  };

  const handleDoneToggle = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          done: !item.done,
          didChange: true,
        };
      }
      return item;
    });
    setUndoStack([...undoStack, { action: "TOGGLE", items }]);
    setChangesMade(true);
    setItems(updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    deleteItem(itemId);
  };

  const handleSaveChanges = async () => {
    setSpinner(true);

    let semaphore = 0;
    let maxSemaphore = 5;

    const waitUntilSemaphoreAvailable = () => {
      return new Promise((resolve) => {
        const checkSemaphore = () => {
          if (semaphore < maxSemaphore) {
            resolve();
          } else {
            maxSemaphore = maxSemaphore + 5;
            setTimeout(checkSemaphore, 1000);
          }
        };
        checkSemaphore();
      });
    };

    try {
      // Filter items with didChange = true
      const changedItems = items.filter((item) => item.didChange);

      await Promise.all(
        changedItems.map(async (item) => {
          semaphore++;
          await waitUntilSemaphoreAvailable();

          const response = await fetch(
            `https://good-monday-js-test.vercel.app/to-do-items/${item.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
              body: JSON.stringify({
                title: item.title,
                done: item.done,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to update item with ID ${item.id}`);
          }
        })
      );

      toast("Your item has been Saved");
    } catch (error) {
      console.error("Error saving changed items:", error);
      toast(
        `Error : ${
          error?.response?.data?.errors?.[0]?.message ||
          error?.message ||
          "Network Error Occured"
        }`
      );
    }
    setChangesMade(false);
    setUndoStack([]);
    setRedoStack([]);
    setSpinner(false);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastChange = undoStack.pop();
      setRedoStack([...redoStack, { action: "REDO", items }]);

      undoAction(lastChange);
      toast(`Undo : ${lastChange?.action}`);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastChange = redoStack.pop();
      setUndoStack([...undoStack, { action: "UNDO", items }]);
      redoAction(lastChange);
      toast(`Redo : Completed`);
    }
  };

  const undoAction = (change) => {
    setItems(change.items);
  };

  const redoAction = (change) => {
    setItems(change.items);
  };

  const handleInputChange = (e, itemId) => {
    const newTitle = e.target.value;

    setUndoStack([...undoStack, { action: "UPDATE", items }]);
    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, title: newTitle, didChange: true }
          : item
      )
    );
    setChangesMade(true);
  };
  {
  }

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-96  mt-8">
          <h1 className="text-3xl font-bold mb-4">To-Do List</h1>
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg">Welcome, {userName}</p>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter new item"
              value={newItemTitle}
              onChange={handleNewItemChange}
              className="border border-gray-300 px-4 py-2 w-64"
            />
            <button
              onClick={createItem}
              className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none ${
                newItemTitle.length === 0 ? "opacity-30" : ""
              } `}
              disabled={newItemTitle.length === 0}
            >
              Add
            </button>
          </div>
          <div className="h-64 overflow-auto">
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleDoneToggle(item.id)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      disabled={item.disabled}
                      value={item.title}
                      onChange={(e) => handleInputChange(e, item.id)}
                      className={`border border-gray-300 ${
                        item.disabled ? "bg-gray-300 opacity-30" : ""
                      } px-2 py-1 `}
                    />
                  </div>
                  <button
                    onClick={() => handleEditItem(item.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {changesMade && (
            <div className="mt-4">
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
              >
                Save Changes
              </button>
              <button
                onClick={handleUndo}
                className={`ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none ${
                  undoStack.length > 0 ? "" : "pointer-events-none opacity-30"
                } `}
                disabled={!(undoStack.length > 0)}
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                className={`ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none ${
                  redoStack.length > 0 ? "" : "pointer-events-none opacity-30"
                } `}
                disabled={!(redoStack.length > 0)}
              >
                Redo
              </button>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default HomePage;
