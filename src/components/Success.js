import React from 'react'



const Success = (props) => {
    if (props.completed === null) {
        return null
    }

    return (
        <div className="success">
            {props.completed}
        </div>
    )

}
export default Success