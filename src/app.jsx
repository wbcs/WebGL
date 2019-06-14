import * as React from 'react'
import { useState, useEffect } from 'react'

const fn = () => console.log('child')
function Test() {
  useEffect(() => {

  }, [])

  return <div onClick={fn}>
    <span>123</span>
  </div>
}

const test = (e) => {console.log('react')}

function App() {
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    const hehe = document.querySelector('#hehe');
    hehe.addEventListener('click', () => {
      setCounter(counter + 1)
      console.log('native')
    }, false);
  }, [])
  console.log('?')
  return (
    <div onClick={test} id="hehe">
      counter {counter} times!
      <Test />
    </div>
  )
}

export default App