import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import * as dayjs from 'dayjs'
import { BsPencil, BsPlusCircleFill, BsLink45Deg, BsShare, BsEnvelope, BsCheckCircleFill } from 'react-icons/bs'
import { LoaderContext } from '../utils/context/useLoader'

import './EventPage.css'

export const EventPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoading, setIsLoading } = useContext(LoaderContext)

  const [name, setName] = useState('')
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const timeoutRef = useRef(null)

  const [eventData, setEventData] = useState<{
    id: string
    title: string
    description: string
    start_date: string
    end_date: string
    location: string
  } | null>(null)

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)

    fetch(`/.netlify/functions/getEvent?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEventData(data)
          setIsLoading(false)

          return
        }

        setIsLoading(false)
        navigate('/404')
      })
      .catch((err) => {
        console.error(err)
      })
  }, [id, navigate, setIsLoading])

  const handleAddGuest = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/.netlify/functions/addGuest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name }),
      })

      if (!response.ok) {
        throw new Error('Error adding guest')
      }

      const data = await response.json()

      if (data.success) {
        setEventData((prev) => {
          if (!prev) {
            return null
          }

          return {
            ...prev,
            event: {
              ...prev.event,
              guests: [...(prev.event.guests ?? ''), name].filter(Boolean),
            },
          }
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setName('')
    }
  }

  // const handleRemoveGuest = async (guestId: string) => {
  //   try {
  //     const response = await fetch('http://localhost:8000/api/remove-guest', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ event_id: id, guest_id: guestId }),
  //     })

  //     if (!response.ok) {
  //       throw new Error('Error removing guest')
  //     }

  //     const data = await response.json()

  //     if (data.success) {
  //       setEventData((prev) => {
  //         if (!prev) {
  //           return null
  //         }

  //         return {
  //           ...prev,
  //           guests: prev.guests.filter((guest) => guest.id !== guestId),
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsLinkCopied(true)

    timeoutRef.current = setTimeout(() => {
      setIsLinkCopied(false)
    }, 2000)
  }

  if (!eventData || isLoading) {
    return null
  }

  const { event } = eventData

  const handleShare = () => {
    navigator.share({
      title: event.title,
      text: event.description,
      url: window.location.href,
    })
  }

  console.log(event.guests)

  const eventDescription = event.description?.replace(/\n/g, '<br />') ?? ''

  const formattedDescription = `Planoo link: ${window.location.href}%0A%0A${eventDescription}`
  const location = event.location

  const formattedGoogleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${
    event.title
  }&dates=${dayjs(event.start_date).format('YYYYMMDDTHHmm000Z')}/${dayjs(event.end_date).format(
    'YYYYMMDDTHHmm000Z',
  )}&details=${formattedDescription}&location=${location}&sf=true&output=xml`

  console.log(
    '\n',
    event.start_date.replace(/-/g, ''),
    '\n',
    dayjs(event.start_date).format('YYYYMMDDTHH:mm.000Z'),
    '\n',
    dayjs(event.start_date).format(),
    '\n',
    dayjs(event.start_date).toISOString(),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start mb-2">
        <h1 className="text-4xl font-bold">
          {event.title} <span className="text-indigo-300 italic">#{id}</span>
        </h1>

        <Link to="edit" className="flex hover:text-white text-gray-300 text-lg items-center ml-auto">
          Edit
          <BsPencil className="ml-3" />
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="bg-blue-700 w-12 h-12 flex p-0 items-center justify-center text-2xl rounded-lg text-blue-200 hover:text-blue-100 hover:border-blue-500 border-blue-700 border border-solid"
          >
            <BsLink45Deg />
          </button>

          {navigator.share && (
            <button
              onClick={handleShare}
              className="bg-blue-700 w-12 h-12 flex p-0 items-center justify-center text-2xl rounded-lg text-blue-200 hover:text-blue-100 hover:border-blue-500 border-blue-700 border border-solid"
            >
              <BsShare />
            </button>
          )}

          <a
            href={`mailto:?subject=${event.title}&body=${formattedDescription}`}
            className="bg-blue-700 w-12 h-12 flex p-0 items-center justify-center text-2xl rounded-lg text-blue-200 hover:text-blue-100 hover:border-blue-500 border-blue-700 border border-solid"
          >
            <BsEnvelope />
          </a>

          <div
            id="link-copied"
            className={`bg-white rounded flex border-l-4 border-purple-500 border-solid py-2 px-4 fixed bottom-2 h-10 flex gap-3 text-purple-500 items-center left-1/2 -translate-x-1/2 ${
              isLinkCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            } transition-all duration-500 transition-ease-in-out`}
          >
            <BsCheckCircleFill />

            <span className="text-purple-800 text-sm whitespace-pre-line leading-6">Link copied to clipboard</span>
          </div>
        </div>
      </div>

      <div>
        <div>
          From:{' '}
          <span className="text-gray-300 text-lg mb-8 whitespace-pre-line">
            {dayjs(event.start_date).format('MMMM D, YYYY h:mm A')}
          </span>
        </div>
        <div>
          To:{' '}
          <span className="text-gray-300 text-lg mb-8 whitespace-pre-line">
            {dayjs(event.end_date).format('MMMM D, YYYY h:mm A')}
          </span>
        </div>
      </div>

      <p className="text-gray-300 text-lg mb-8 whitespace-pre-line">
        Where: {event.location ? event.location : <i className="italic">No location set</i>}
      </p>

      <h2 className="text-2xl font-bold mb-4">Description</h2>
      <p className="text-gray-300 text-lg mb-8 whitespace-pre-line">{event.description}</p>

      <div className="text-center mb-8">
        <Link
          to={formattedGoogleCalendarLink}
          target="blank"
          className="inline-block btn bg-blue-600 border-solid hover:bg-blue-500 border-b-4 border-blue-700 hover:border-blue-600 text-white font-bold py-4 px-8 rounded-md text-xl mx-auto block hover:text-white"
          rel="noreferrer"
        >
          Add to my google calendar
        </Link>
        <div className="m-8 center">OR</div>
        <Link
          to={eventData.downloadLink}
          download={`event-${id}`}
          className="font-semibold hover:text-purple-400 py-2 px-4 border border-solid border-blue-500 rounded hover:border-purple-400"
        >
          Download .ics file
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Guest list</h2>
      <div className="text-gray-300 text-lg mb-8 whitespace-pre-line">
        {event.guests?.length ? (
          <ul>
            {event.guests.map((guest: string, i) => (
              <li key={i} className="font-black">
                {guest}
              </li>
            ))}
          </ul>
        ) : (
          <i className="italic">No guests yet</i>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-purple-400">Are you coming?</h2>

      <form className="flex mb-8 items-center" onSubmit={handleAddGuest}>
        <input
          type="text"
          name="guests"
          id="guests"
          className="input-guest max-w-xs flex-1 bg-white rounded-lg p-2 text-indigo-800 text-lg h-12 border-purple-300 border-4 p-2 font-black mr-4"
          value={name}
          onChange={handleChangeName}
          placeholder="Enter your name"
        />
        <button
          type="submit"
          className="bg-purple-900 text-purple-400 hover:text-purple-300 border-purple-500 hover:border-purple-500 cursor-pointer border-4 border-solid rounded-full p-0"
        >
          <BsPlusCircleFill className="text-4xl" />
        </button>
      </form>
    </div>
  )
}
