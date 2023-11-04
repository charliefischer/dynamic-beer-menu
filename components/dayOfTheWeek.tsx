export default function DayOfTheWeek({day, setDay, days}){
  return (
    <div>
      <label htmlFor="dayOfWeek">Day of the Week:</label>
          <select
            onChange={(e) => setDay(parseInt(e.target.value))}
            value={day}
            id="dayOfWeek"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <option value={n} key={n}>
                {days[n]}day
              </option>
            ))}
          </select>
    </div>
  )
}