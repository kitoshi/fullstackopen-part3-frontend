import React, { useState, useEffect } from 'react';
import Add from './components/Add';
import Filter from './components/Filter';
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'
import Success from './components/Success'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ successMessage, setSuccessMessage ] = useState(null)
  
  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addAll = (event) =>{
      addPerson(event)
      addNumber(event)
  }
    
  
    const addPerson = (event) => {
    event.preventDefault()
    const personsObject = {
        name: newName,
        id: persons.length + 1,
      }
      const isDuplicate = persons.map(person => person.name)
      if (isDuplicate.includes(newName)) {
          return (
              window.alert(`${newName} is already added to phonebook`)
            )
        }
      else {
    setPersons(persons.concat(personsObject))
    setNewName('')
      }
    }

    const addNumber = (event) => {
      event.preventDefault()
      const numberObject = {
          name: newName,
          number: newNumber,
          id: persons.length,
        }
        const isDuplicate = persons.map(person => person.name)
        const putID = isDuplicate.indexOf(newName) + 1
        if (isDuplicate.includes(newName)) {
          window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
          personsService
          .update(putID, numberObject)
          .then(response => {
            setTimeout(() => {}, 100000)
            setPersons(persons.map(person => person.id !== putID ? person : response.data))
            setNewNumber('')
          })
          }
        else {
          const numberObject = {
            name: newName,
            number: newNumber,
            id: persons.length + 1,
          }
          personsService
          .create(numberObject)
          .then(response => {
            setPersons(persons.concat(response.data))
            setNewNumber('')
            setSuccessMessage(
              `'${numberObject.name}' was added`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
        }
      }

      

  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const filterItems = persons.filter(person => person.name.toLowerCase().indexOf(newFilter.toLowerCase()) !== -1)
  
  

  const filterList = (filterItems) => {
    const removeNumber = () => {
      if (window.confirm("Remove Number?"))
      personsService
        .remove(filterItems.id)
        .catch(() => {
          setErrorMessage(
            `Note '${filterItems.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)})
      .then(
        setTimeout(() => {}, 100000),
        personsService
          .getAll()
          .then(response => {
            setPersons(response.data)
            console.log(response.data)
          })
          
          )
    }
    return (
      <ul key={filterItems.id}>{filterItems.name} {filterItems.number} <button onClick={removeNumber} id={filterItems.id}>Remove</button></ul>
    )
  }
  
  

  return (
    <div>
      <Notification message={errorMessage}/>
      <Success completed={successMessage}/>
      <h1>Phonebook</h1>
      <Filter
      handleFilterChange={handleFilterChange} newFilter={newFilter}
      />
      <h2>Add a New</h2>
      <Add 
      handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addAll={addAll}
      />
      <h2>Numbers</h2>
      <Persons
      filterList={filterList} filterItems={filterItems}
      />
    </div>
  )
  }

export default App