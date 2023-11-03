import { useState } from "react"

export default function NumberOfPeople(){
  const [count, setCount] = useState(50);
  const updateCount = (e) => {
    setCount(e.target.value)
  }
  return (
    <div>
      <label htmlFor="nop">Number of People: <span>{count}</span></label>
      <input type="range" id="nop" name="Number of People" min="1" max="500" value={count} onChange={updateCount} />
    </div>
  )
}