import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import FooterPage from "./components/footer/FooterPage";
import Header from "./components/headers/Header";
import Pages from "./components/mainPage/Pages";
import {DataProvider} from "./GlobalState";


function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header/>
          <Pages/>
        </div>
      </Router>
      <FooterPage/>
    </DataProvider>
  );
}

export default App;
