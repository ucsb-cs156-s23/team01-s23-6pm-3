import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import AvilaBeachPage from "main/pages/Towns/AvilaBeachPage";
import LosAlamosPage from "main/pages/Towns/LosAlamosPage";
import ArroyoGrandePage from "main/pages/Towns/ArroyoGrandePage";

import "bootstrap/dist/css/bootstrap.css";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import SongCreatePage from "main/pages/Songs/SongCreatePage";
import SongEditPage from "main/pages/Songs/SongEditPage";
import SongIndexPage from "main/pages/Songs/SongIndexPage";
import SongDetailsPage from "main/pages/Songs/SongDetailsPage";


function App() {

  const reload = () => window.location.reload();

  return (
    <BrowserRouter basename="team01-s23-6pm-3">
      <Routes>
        <Route path="/storybook-static" onEnter={reload}/>
        <Route exact path="/" element={<HomePage />} />

        <Route exact path="/towns/AvilaBeach" element={<AvilaBeachPage />} />
        <Route exact path="/towns/LosAlamos" element={<LosAlamosPage />} />
        <Route exact path="/towns/ArroyoGrande" element={<ArroyoGrandePage />} />
        
        <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
        <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
        <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
        <Route exact path="/restaurants/" element={<RestaurantIndexPage />} />

        <Route exact path="/songs/create" element={<SongCreatePage />} />
        <Route exact path="/songs/edit/:id" element={<SongEditPage />} />
        <Route exact path="/songs/details/:id" element={<SongDetailsPage />} />
        <Route exact path="/songs/" element={<SongIndexPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
