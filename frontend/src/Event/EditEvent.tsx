import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Input } from '../components/form/Input/Input'

dayjs.extend(utc)

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>()

  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/.netlify/functions/getEvent?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.event.title)
        setStartDate(dayjs(data.event.start_date).local().format('YYYY-MM-DDTHH:mm'))
        setEndDate(dayjs(data.event.end_date).local().format('YYYY-MM-DDTHH:mm'))
        setLocation(data.event.location)
        setDescription(data.event.description)
      })
      .catch((err) => console.error(err))
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/.netlify/functions/editEvent', {
        method: 'POST',
        body: JSON.stringify({ id, title, description, startDate, endDate, location }),
      })

      if (!response.ok) {
        throw new Error('Error updating event')
      }

      navigate(`/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Edit event <span className="text-indigo-300 italic">#{id}</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input label="Title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="mb-4 sm:flex">
          <div className="mb-4 sm:mr-2 flex-1 sm:mb-0">
            <Input
              label="Start date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
            className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white font-bold py-4 px-8 text-xl border-b-4 border-solid border-blue-700 hover:border-blue-600 inline-block rounded-md"
            type="submit"
          >
            Update Event
          </button>
        </div>
      </form>

      <div className="flex items-center mt-8">
        <Link to={`/${id}`} className="text-gray-300 hover:text-white text-lg">
          <BsArrowLeft className="inline-block align-middle mr-2" />
          <span className="inline-block align-middle">Back</span>
        </Link>
      </div>
    </div>
  )
}
