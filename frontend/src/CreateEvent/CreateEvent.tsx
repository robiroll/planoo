import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'

import { Input } from '../components/form/Input/Input'
import { formatInputToUtc } from '../utils/temporal'

export const CreateEvent = () => {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const start = formatInputToUtc(startDate)
    const end = formatInputToUtc(endDate)

    try {
      const response = await fetch('/.netlify/functions/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          startDate: start,
          endDate: end,
          location,
        }),
      })

      if (!response.ok) {
        throw new Error('Error creating event')
      }

      const data = await response.json()

      navigate(`/${data.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleStartDate = ({ target: { value } }) => {
    setStartDate(value)
    setEndDate(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Event</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input label="Title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="mb-4 sm:flex">
          <div className="sm:mr-2 flex-1 mb-4 sm:mb-0">
            <Input
              label="Start date"
              id="start-date"
              value={startDate}
              onChange={handleStartDate}
              type="datetime-local"
              required
            />
          </div>

          <div className="flex-1">
            <Input
              label="End date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="datetime-local"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Input label="Location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="mb-8">
          <Input
            label="Description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="textarea"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-md text-xl border-b-4 border-blue-700 hover:border-blue-600"
            type="submit"
          >
            Create Event
          </button>
        </div>
      </form>

      <div className="flex items-center mt-8">
        <Link to="/" className="text-gray-300 hover:text-white text-lg">
          <BsArrowLeft className="inline-block align-middle mr-2" />
          <span className="inline-block align-middle">Back</span>
        </Link>
      </div>
    </div>
  )
}
