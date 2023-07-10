import { Link } from 'react-router-dom'

import './NotFound.css'
import { useEffect, useState } from 'react'

export const NotFound = () => {
  const [pageX, setPageX] = useState(0)
  const [pageY, setPageY] = useState(0)
  const [mousePos, setMousePos] = useState({})

  useEffect(() => {
    const pageX = document.body.clientWidth
    const pageY = document.body.clientHeight
    setPageX(pageX)
    setPageY(pageY)

    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const mouseY = mousePos.y
  const yAxis = Math.max(((pageY / 2 - mouseY) / pageY) * 300, 0)

  const mouseX = mousePos.x / -pageX
  const xAxis = -mouseX * 100 - 100

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {/* <h1 className="text-6xl font-bold mb-8">404</h1>

      <p className="text-2xl font-semibold mb-8">Page not found</p> */}

      <div className="box">
        <div className="box__ghost">
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>
          <div className="symbol"></div>

          <div className="box__ghost-container">
            <div
              className="box__ghost-eyes"
              style={{ transform: 'translate(' + xAxis + '%,-' + yAxis + '%)' }}
              // style={{ left: `${xAxis}%`, top: `-${yAxis}%` }}
            >
              <div className="box__eye-left"></div>
              <div className="box__eye-right"></div>
            </div>
            <div className="box__ghost-bottom">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="box__ghost-shadow"></div>
        </div>

        <div className="box__description">
          <div className="box__description-container">
            <div className="box__description-title">Whoops!</div>
            <div className="box__description-text mb-8 text-gray-300">
              It seems like we couldn’t find the page you were looking for
            </div>
          </div>

          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white font-bold py-4 px-8 text-xl border-b-4 border-solid border-blue-700 hover:border-blue-600 inline-block rounded-md"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
