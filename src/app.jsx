import React, { useState} from 'react'

export default function() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return <div>
    <button onClick={handleClick}>click me {count}times</button>
  </div>
}