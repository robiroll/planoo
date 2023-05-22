import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Home = () => {
  const [pin, setPin] = useState('')
  const navigate = useNavigate()

  const handleChangePin = (event) => {
    if (event.target.value.length > 6) return
    setPin(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(`/${pin}`)
  }

  return (
    <div>
      <header className="App-header">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Welcome!</h1>

        <div className="flex justify-center mb-4">
          <Link
            to="/create-event"
            className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white font-bold py-4 px-8 text-xl border-b-4 border-solid border-blue-700 hover:border-blue-600 inline-block rounded-md"
          >
            Create an Event
          </Link>
        </div>

        <div className="mb-4 font-light text-center">– OR –</div>

        <div className="mb-4 text-center text-xl text-purple-100">Enter a pin:</div>

        <form onSubmit={handleSubmit} className="flex justify-center items-center mb-8">
          <span className="text-purple-400 font-bold italic text-4xl mr-4 w-14 text-right">#</span>

          <input
            type="number"
            value={pin}
            onChange={handleChangePin}
            className="bg-white rounded-lg p-2 text-indigo-800 text-lg h-14 border-purple-300 border-4 p-2 font-black w-32 text-center mr-4"
          />

          <button
            type="submit"
            className="leading-none w-14 h-14 bg-purple-600 p-4 text-white rounded-md font-bold border-b-4 border-purple-700 cursor-pointer hover:bg-purple-500 hover:border-purple-600"
          >
            GO
          </button>
        </form>
      </header>
    </div>
  )
}
