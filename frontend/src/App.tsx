import { Routes, Route, Outlet, Link } from 'react-router-dom'
import { Home } from './Home/Home'
import { CreateEvent } from './CreateEvent/CreateEvent'
import { EventPage } from './Event/EventPage'
import { EditEvent } from './Event/EditEvent'
import { NotFound } from './NotFound/NotFound'
import LogoIcon from './assets/logo-icon.svg'
import LogoName from './assets/logo-name.svg'

import './App.css'
import { LoaderContext, useLoader } from './utils/context/useLoader'
import { Loader } from './components/Loader/Loader'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route exact path="/create-event" element={<CreateEvent />} />
        <Route exact path="/404" element={<NotFound />} />
        <Route path="/:id" element={<EventPage />} />
        <Route path="/:id/edit" element={<EditEvent />} />
      </Route>

      {/* <Route component={Error404} /> */}
    </Routes>
  )
}

const Layout = () => {
  const [isLoading, setIsLoading] = useLoader()

  const blurStyle = isLoading ? 'blur-sm' : ''

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900 min-h-screen ${blurStyle}`}
      >
        <Link to="/" className="self-center p-3 flex items-center mt-8 mb-8">
          <img src={LogoIcon} alt="" className="h-20 mr-4" />
          <img src={LogoName} alt="" className="h-12" />
        </Link>
        <div className="m-auto w-4/5 max-w-screen-md">
          <Outlet />
        </div>
      </div>

      {isLoading && <Loader />}
    </LoaderContext.Provider>
  )
}

export default App
