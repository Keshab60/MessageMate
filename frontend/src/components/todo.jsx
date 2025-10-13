import React from 'react'
import { useState, useRef } from 'react';

const todo = () => {
    const [change, setChange] = useState({ text: "keshab", date: "" });
    const [remove, setRemove] = useState(1);
    const [items, setItems] = useState([])
    const text = useRef()
    const date = useRef()
    const additem = useRef()

    const changetheinput = (e) => {
        setChange({ ...change, [e.target.name]: e.target.value })
    }
    const add = () => {
        // alert("added")
        // const message = text.current.value;
        // const Date = date.current.value;
        // { console.log(message, Date) }
        // {additem.current.firstElementChild.innerHTML=message}
        // {additem.current.children[1].innerHTML=Date}
        //  const btn=document.createElement('button')
        // btn.innerText="Remove"
        // {additem.current.appendChild(btn)}
        // btn.onclick=()=>{
        //     setRemove(false)

        // }
        const message = text.current.value;
        const Date = date.current.value;

        // add new item to array
        setItems([...items, { message, Date }]);

    }
    const Remove = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    }
    return (
        <>
            <input type="text" ref={text} name="text" value={change.text} onChange={changetheinput} />
            <input type="date" ref={date} name="date" value={change.date} onChange={changetheinput} />
            <button onClick={add}>Add</button>
            <div>
                {items.map((item, index) => (
                    <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <p>{item.message}</p>
                        <p>{item.Date}</p>
                        <button onClick={() => Remove(index)} style={{
                            padding: "0px 20px",
                            height: "45px",
                            marginTop: "7px"
                        }}>Remove</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default todo
