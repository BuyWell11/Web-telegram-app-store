import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect} from "react";

import './App.sass';

import StoreAppCatalogue from "./components/StoreAppCatalogue/StoreAppCatalogue";
import MyAccount from "./components/MyAccount/MyAccount";
import AppPage from "./components/AppPage/AppPage";

function App() {

  const [apps, setApps] = useState([]);
  useEffect(() => {
    fetch('http://91.197.3.57:3000/app/all')
      .then(response => response.json())
      .then(json => setApps(json))
      .catch(error => console.log(error.message))
  }, [])

  if (apps) {
    return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path='/' element={<StoreAppCatalogue />} />
            <Route path='user' element={<MyAccount />} />

            {apps.map(app => {
              return (
                <Route path={app.Link} element={<AppPage key={app._id} title={app.Name} text={app.Description} img={app.Icon} />} />
              )
            })}
          </Routes>
        </div>
      </BrowserRouter>
    );
  }



}

export default App;