import React, { useContext, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../Utils/auth-context";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import image1 from "../../images/headphones.png";
import image2 from "../../images/micPC.jpeg";

import image3 from "../../images/signupBackground.png";

const Account = () => {
  const { pathname } = useLocation();

  const authContext = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if(authContext.isLoggedIn()){
      navigate("/home");
    }
  
  }, [authContext, navigate]);

  return (
    <div className="row container-fluid p-0 m-0">
      <div className="col-8 p-0">
        <Carousel
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay
        >
          <div>
            <img src={image1} className="vh-100 w-100" />
            <p className="legend fs-1">
              Da tu opinión acerca de los temas de tu interés
            </p>
          </div>
          <div>
            <img src={image2} className="vh-100 w-100" />
            <p className="legend fs-1">
              Escucha qué es lo que opinan las demás personas
            </p>
          </div>
          <div>
            <img src={image3} className="vh-100 w-100" />
            <p className="legend fs-1">
              Inicia sesión ahora y comienza a navegar por la página
            </p>
          </div>
        </Carousel>
      </div>
      <div className="col-4 bg-dark vh-100 p-0">
        <ul className="nav nav-pills h-25 w-100 p-5 col-3" id="pills-tab">
          <li className="nav-item w-50">
            <Link
              to="/account/login"
              className="text-white text-decoration-none"
            >
              <button
                className={`w-100 nav-link ${
                  "/account/login" === pathname && "active"
                }`}
                id="pillsLoginTab"
                type="button"
              >
                Log in
              </button>
            </Link>
          </li>
          <li className="nav-item w-50">
            <Link
              to="/account/register"
              className="text-white text-decoration-none"
            >
              <button
                className={`w-100 nav-link ${
                  "/account/register" === pathname && "active"
                }`}
                id="pillsRegisterTab"
                type="button"
              >
                Registro
              </button>
            </Link>
          </li>
        </ul>
        <div
          className="d-flex align-items-center justify-content-center pt-2 tab-content"
          id="pills-tabContent"
        >
          <div
            className="w-75 text-white tab-pane fade show active"
            id="pillsLogin"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
