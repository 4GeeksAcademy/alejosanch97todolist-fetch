import React, { useState, useEffect } from "react";

const List = () => {
    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const host = 'https://playground.4geeks.com/todo';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${host}/users/alejosanch97`);
        if (response.ok) {
            const data = await response.json();
            setTodos(data.todos.map(todo => ({ id: todo.id, label: todo.label })));
        } else {
            console.error('Error al traer datos:', response.statusText);
        }
    };

    const addTodo = async () => {
        try {
            const response = await fetch(`${host}/todos/alejosanch97`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    label: inputValue,
                    is_done: false
                })
            });
            if (response.ok) {
                const data = await response.json();
                setTodos([...todos, { id: data.id, label: inputValue }]);
                setInputValue('');
                alert("Task added");
            } else {
                console.error('Error al añadir tarea:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const editTodo = async (id) => {
            const response = await fetch(`${host}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    label: editValue,
                    is_done: false
                })
            });
            if (response.ok) {
                const data = await response.json();
                setTodos(todos.map(todo => (todo.id === id ? { ...todo, label: data.label } : todo)));
                setEditMode(false);
                setEditId(null);
                setEditValue('');
                alert("Task edited");
            } else {
                console.error('Error al editar tarea:', response.statusText);
            }
    };

    const handleEdit = (id, currentLabel) => {
        setEditMode(true);
        setEditId(id);
        setEditValue(currentLabel);
    };

    const eraseTodo = async (id) => {
        try {
            const response = await fetch(`${host}/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTodos(todos.filter(todo => todo.id !== id));
                alert("Task deleted");
            } else {
                console.error('Error al borrar tarea:', response.statusText);
            }
        } catch (error) {
            console.error('Error al borrar tarea:', error);
        }
    };

    const eraseAll = async () => {
        for (const todo of todos) {
            const response = await fetch(`${host}/todos/${todo.id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                console.error('Error al borrar todo:', response.statusText);
            }
        }
        setTodos([]);
        alert("Todas las tareas han sido borradas también de Playground");
    };

    return (
        <div className="container-fluid listTodo">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                 <form>
                    <div className="card">
                        <div className="card-body">
                            <input
                                type="text"
                                className="form-control"
                                onChange={e => setInputValue(e.target.value)}
                                value={inputValue}
                                placeholder="What needs to be done?"
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTodo();
                                    }
                                }}
                            />
                        </div>
                        <ul className="list-group list-group-flush">
                        {todos.map(todo => (
                            <div key={todo.id} className="list-group-item">
                                {editMode && editId === todo.id ? (
                                        <div className="d-flex justify-content-between align-items-center">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm me-2"
                                          value={editValue}
                                          onChange={e => setEditValue(e.target.value)}
                                        />
                                        <div className="d-flex">
                                          <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => editTodo(todo.id)}
                                          >
                                            Guardar
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm ms-2"
                                            onClick={() => {
                                              setEditMode(false);
                                              setEditId(null);
                                              setEditValue('');
                                            }}
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                ) : (
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                        <p className="m-0">{todo.label}</p>
                                        <div className="d-flex">
                                            <span
                                            type="button"
                                            className="btn btn-sm btn-danger me-2"
                                            onClick={() => eraseTodo(todo.id)}
                                            >
                                            <i className="fas fa-trash"></i>
                                            </span>
                                            <span
                                            type="button"
                                            className="btn btn-sm btn-warning"
                                            onClick={() => handleEdit(todo.id, todo.label)}
                                            >
                                            <i className="far fa-edit"></i>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        </ul>
                        <div className="card-footer">
                            <p className="text-muted">{todos.length} {todos.length === 1 ? 'tarea' : 'tareas'} por hacer</p>
                        </div>
                        </div>
                    </form>
                    
                    <div className="d-flex justify-content-end mt-3">
                        <button type="button" onClick={eraseAll} className="btn btn-danger">Borrar todo</button>
                    </div>
            
                </div>
            </div>
        </div>
    );
    
};    
export default List;