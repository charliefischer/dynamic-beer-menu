export default function NumberOfPeople({count, setCount}){
  
  const updateCount = (e: any) => {
    setCount(e.target.value)
  }
  return (
    <div>
      <label htmlFor="nop">Number of People: <span>{count}</span></label>
      <input type="range" id="nop" name="Number of People" min="1" max="500" value={count} onChange={updateCount} />
    </div>
  )
}