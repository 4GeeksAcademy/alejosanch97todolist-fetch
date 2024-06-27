import React, { useState, useEffect } from "react";

const List = () => {
    const [inputValue, setInputValue] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null); //para ocultar la X
    const [placeholder, setPlaceholder] = useState("Añadir nueva tarea");
    const [numTodos, setNumTodos] = useState(todoList.length);
    const [nameTarea, setNameTarea] = useState('tareas');

    function addTodo() {
        if (inputValue.trim()) { // Ensure input is not empty
            setTodoList([...todoList, inputValue]);
            setInputValue('');
          } else {
            alert('Please write a valid task.'); // Display alert on empty input
          }
    }

    function eraseTodo(index) {
        const updatedTodoList = todoList.filter((_, i) => i !== index);
        setTodoList(updatedTodoList);
    }

    useEffect(() => {
        todoList.length === 0 ? setNumTodos('Sin') : setNumTodos(todoList.length);
        todoList.length === 1 ? setNameTarea('tarea') : setNameTarea('tareas');
        todoList.length === 0 ? setPlaceholder('What needs to be done?') : setPlaceholder('Añade otra tarea');
    }, [todoList]);

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
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTodo();
                    }
                  }}
                />
              </div>
              <ul className="list-group list-group-flush">
                {todoList.map((toDo, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${
                      hoverIndex === index && 'bg-light'
                    }`}
                    onMouseOver={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <span className="d-flex justify-content-between align-items-center delete">
                      {toDo}
                      {hoverIndex === index && (
                        <span
                          onClick={() => eraseTodo(index)}
                          className="badge bg-danger rounded-pill"
                        >
                          X
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="card-footer">
                <p className="text-muted">
                  {numTodos} {nameTarea} por hacer
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
};

export default List;