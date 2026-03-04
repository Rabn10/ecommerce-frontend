import React from 'react'

const NoState = ({ text = "No data found" }) => {
    return (
        <div className='text-center py-5'>{text}</div>
    )
}

export default NoState
