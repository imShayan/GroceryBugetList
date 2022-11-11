import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () =>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }else{
    return []
  }
}
function App() {
  const [name,setName] = useState('');
  const [list,setList] = useState(getLocalStorage());
  const [isEditing,setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!name){
      showAlert(true,'please enter a value','danger')
    }else if(name && isEditing){
          setList(
            list.map((item)=>{
              if(item.id === editID){
                return {...item,title:name}
              }
              return item
            })
          )
          setName('')
          setEditID(null)
          setIsEditing(false)
          showAlert(true,'item updated','success')
    }else{
      showAlert(true,"new item added to the list","success");
      const newItem = {id: new Date().getTime().toString(),title:name};
      setList([...list,newItem])
      setName('')
    }
  }
  const showAlert= (show = false,msg = "",type = "")=> {
    setAlert({show,msg,type})
  }
  const clearList = () =>{
    showAlert(true,'the list is empty',"danger")
    setList([]);
  }
  const removeItem = (id) =>{
          showAlert(true,"item removed",'danger');
          setList(list.filter((item)=> item.id !== id ))
  }
  const editItem = (id) =>{
     const specificItem = list.find((item) => item.id === id)
        setEditID(id)
        setIsEditing(true);
        setName(specificItem.title);
  }
  useEffect(()=>{
        localStorage.setItem('list',JSON.stringify(list))
  },[list])
  return <>
  <section className='section-center'>
    <form onSubmit={handleSubmit} className='grocery-form'>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
      <h3>Grocery Items List</h3>
      <div className='form-control'>
      <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs,butter,bread'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        <button className='submit-btn' type='submit'>{isEditing?'Edit':'submit'}</button>
      </div>
    </form>
    {list.length > 0 && (
            <div className='grocery-container'>
            <List items ={list} removeItem ={removeItem} editItem={editItem}/>
            <button className='clear-btn' onClick={clearList}>
              clear items
            </button>
          </div>
    )}
  </section>
  </>
}

export default App
