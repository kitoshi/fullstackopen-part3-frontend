import React from 'react'


const Filter = (props) => {



    return (
        <div>
            <form>
                filter name with: <input value={props.newFilter} onChange={props.handleFilterChange} type='text' />
            </form>
        </div>
    )
}


export default Filter