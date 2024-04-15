import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from './authentication/authService';
import { logout } from './authentication/authService';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [user, setUser] = useState('');
    const [items, setItems] = useState([]);
    const [newItemTitle, setNewItemTitle] = useState("");
    const [changesMade, setChangesMade] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [jwtToken, setJwtToken] = useState('');
    const navigate = useNavigate();

    console.log("undoStack",undoStack,redoStack)

    useEffect(() => {
        // Fetch user name from JWT token
        const token = getToken('jwt_token');
        console.log("token", token)

        const fetchData = async (token) => {
            try {
                const response = await fetch('https://good-monday-js-test.vercel.app/to-do-items/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log("data", data)
                setItems(data.items.map((item) => {

                    return {
                        ...item,
                        disabled: true,
                        didChange: false
                    };


                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        if (token) {
            const decodedToken = parseJwt(token);
            setUser(decodedToken.username);
            setJwtToken(token);
            fetchData(token);
        }




    }, []);



    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    };

    const fetchItems = async () => {
        try {
            const response = await axios.get('https://good-monday-js-test.vercel.app/to-do-items/', {
                headers: { Authorization: `Bearer ${jwtToken}` }
            }
            );
            setItems(response.data.items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    console.log("newitem", items);

    const createItem = async () => {
        try {
            const newItem = { id: `${items.length + 1}`, title: newItemTitle, done: false, didChange: false, disabled: true };
            const { didChange, disabled, ...reqData } = newItem
            const response = await axios.post('https://good-monday-js-test.vercel.app/to-do-items/', reqData, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });

            newItem.didChange = false;
            setUndoStack([...undoStack,{ action: 'CREATE', items }]); //repair with clone
            setItems([...items, newItem]);
            setNewItemTitle('');
            setChangesMade(true);

        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const updateItem = async () => {
        items.forEach(async (item) => {
            if (item.didChange) {
                try {
                    await axios.put(`https://good-monday-js-test.vercel.app/to-do-items/${item.id}`, item, {
                        headers: { Authorization: `Bearer ${jwtToken}` }
                    });

                } catch (error) {
                    console.error('Error updating item:', error);
                }
            }

        })

    };

    const deleteItem = async (itemId) => {
        console.log("item Id", itemId)
        try {
            await axios.delete(`https://good-monday-js-test.vercel.app/to-do-items/${itemId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });

            const updatedItems = items.filter((item) => item.id !== itemId);
            setUndoStack([...undoStack,{ action: 'DELETE', items }]); //repair with clone
            setItems(updatedItems);
            setChangesMade(true);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEditItem = (itemId) => {
        console.log("item Id", itemId);


        const updatedItems = items.map((item) => {
            if (item.id === itemId) {
                return {
                    ...item,
                    disabled: false
                };
            }
            return item;
        });

        setUndoStack([...undoStack,{ action: 'EDIT', items }]); // Backup the items
        setItems(updatedItems); // Update items with disabled property changed
        setChangesMade(true);

    };

    const handleNewItemChange = (e) => {
        setNewItemTitle(e.target.value);
    };

    const handleDoneToggle = (itemId) => {
        const itemToUpdate = items.find((item) => item.id === itemId);
        const updatedItem = { ...itemToUpdate, done: !itemToUpdate.done, didChange: true };
        updateItem(itemId, updatedItem);
    };

    const handleTitleChange = (itemId, newTitle) => {
        const itemToUpdate = items.find((item) => item.id === itemId);
        const updatedItem = { ...itemToUpdate, title: newTitle };
        updateItem(itemId, updatedItem);
    };

    const handleDeleteItem = (itemId) => {
        deleteItem(itemId);
    };




    const handleSaveChanges = async () => {

        let semaphore = 0;
        let maxSemaphore = 5;

        const waitUntilSemaphoreAvailable = () => {
            return new Promise(resolve => {
                const checkSemaphore = () => {
                    if (semaphore < maxSemaphore) {
                        resolve();
                    } else {
                        maxSemaphore=maxSemaphore+5;
                        setTimeout(checkSemaphore, 10000); // Retry after 100ms
                    }
                };
                checkSemaphore();
            });
        };

        try {
            // Filter items with didChange = true
            const changedItems = items.filter(item => item.didChange);

            // Iterate over changedItems and send PUT requests to update each item
            await Promise.all(changedItems.map(async item => {
                semaphore++;
                await waitUntilSemaphoreAvailable();
                  // Increment semaphore before making the request
                const response = await fetch(`https://good-monday-js-test.vercel.app/to-do-items/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify({
                        title: item.title,
                        done: item.done
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to update item with ID ${item.id}`);
                }
            }));



        } catch (error) {
            console.error('Error saving changed items:', error);
        }
        setChangesMade(false);
        setUndoStack([]);
        setRedoStack([]);

    

    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            const lastChange = undoStack.pop();
            setRedoStack([...redoStack, { action: 'REDO', items }]);
            console.log("lastChange",lastChange)
            undoAction(lastChange);
        }
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const lastChange = redoStack.pop();
            setUndoStack([...undoStack, { action: 'UNDO', items }]);
            redoAction(lastChange);
        }
    };

    const undoAction = (change) => {
        setItems(change.items)
    };

    const redoAction = (change) => {
        setItems(change.items)
    };

    const handleInputChange = (e, itemId) => {
        const newTitle = e.target.value;
        const change = { action: 'UPDATE', items };

        setUndoStack([...undoStack,{ action: 'UPDATE', items }]);
        setItems(items.map((item) => (item.id === itemId ? { ...item, title: newTitle, didChange: true } : item)));
        setChangesMade(true);
    };

    const handleLogoutClick = () => {
        logout()
    

        
          navigate('/login'); 
       
      };

    return (
        <div className="containe mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">To-Do List</h1>
            <div className="flex items-center justify-between mb-4">
                <p className="text-lg">Welcome, {user}</p>
                <button
                    onClick={handleLogoutClick}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                    Logout
                </button>
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
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                    Add
                </button>
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between border-b py-2">
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
                                className="border border-gray-300 px-2 py-1"
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
                        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                        disabled={!(undoStack.length>0)}
                    >
                        Undo
                    </button>
                    <button
                        onClick={handleRedo}
                        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                        disabled={!(redoStack.length>0)}
                    >
                        Redo
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
