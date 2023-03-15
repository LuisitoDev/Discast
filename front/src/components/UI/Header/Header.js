import React, { useContext,  useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModalEditProfile from "../../Account/ModalEditProfile/ModalEditProfile";
import AuthContext from "../../Utils/auth-context";
import SearchContext from "../../Utils/search-context";
import Modal from "../Modal/Modal";
import "./Header.css";

const Header = () => {
  const authContext = useContext(AuthContext);


  const modalRef = useRef();
  const contentProps = "p-2";
  const headerProps =
    "flex-column justify-content-center align-items-center pb-0";
  const { pathname } = useLocation();
  let navigate = useNavigate();
  const searchContext = useContext(SearchContext);

  searchContext.hasChanged = false;


  // console.log(searchText);
  const searchTextHandler = (e) => {
    searchContext.updateText(e.target.value);
    searchingControl(pathname, navigate);
  };

  const searchClickHandler = () => {
    // TODO: Hacer que tambien se actualice cuando se hace click en el boton de buscar
    searchingControl(pathname, navigate);
  };

  const deleteTextHandler = () => {
    searchContext.updateText("");
  };

  const searchingControl = (path, navigate) => {
    if (
      path === "/home/followed" ||
      path === "/home/discover" ||
      path === "/home/top" ||
      path === "/home" ||
      path === "/"
    ) {
    } else {
      // Check if
      navigate("/home/discover");
    }
  };
  //  in={this.state.showBlock} timeout={250}>
  //   {(state) => <ModalEditProfile onClose={closeModalHandler} />}
  //;
  return (
    <header>
      <Modal
        headerClasses={headerProps}
        contentClasses={contentProps}
        ref={modalRef}
        header="Perfil"
        type="Profile"
      >
        {<ModalEditProfile></ModalEditProfile>}
      </Modal>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            <i className="fas fa-headset fs-2 me-1"></i>
            <span className="navbar-brand mb-0 h1 fs-3">Discast</span>
          </Link>
          <button className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse mt-4 mt-lg-0"
            id="navbarSupportedContent"
          >
            <div className="d-flex flex-lg-grow-1 flex-grow-0 justify-content-lg-center mx-lg-5">
              <input
                className="form-control inputBuscadorNavbar"
                type="text"
                placeholder="Search"
                style={{
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                  borderRight: "none",
                }}
                aria-label="Search"
                onChange={searchTextHandler}
                value={searchContext.searchText}
                autoFocus
              />
              <button
                className="px-3"
                style={{
                  borderRight: "none",
                  borderLeft: "none",
                  border: "1px solid transparent",
                  background: "#f2f2f2",
                  borderTopRightRadius: "0.25rem",
                  borderBottomRightRadius: "0.25rem",
                }}
                onClick={deleteTextHandler}
              >
                <i className="fa-solid fa-xmark text-secondary"></i>
              </button>
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={searchClickHandler}
              >
                <i className="fas fa-search fs-4 text-white"></i>
              </button>
            </div>
            <ul className="navbar-nav my-2">
              { authContext.isLoggedIn() &&(
              <li className="nav-item px-2">
                <Link to="/upload" className="nav-link fs-5">
                  <i className="fas fa-upload fs-2"></i>
                  <span className="d-lg-none d-inline-block ms-2">Upload</span>
                </Link>
              </li>
              )}
              <li className="nav-item px-2">
                {!authContext.isLoggedIn() && (
                  <Link to="/account/login" className="nav-link fs-5 user-link">
                    <i className="fas fa-user fs-2"></i>
                    <span className="d-lg-none d-inline-block ms-2">
                      Derek Bryan
                    </span>
                  </Link>
                )}
                {authContext.isLoggedIn() && (
                  <div
                    className="nav-link fs-5 user-link"
                    onClick={() => modalRef.current.open()}
                  >
                    <i className="fas fa-user fs-2"></i>
                    <span className="d-lg-none d-inline-block ms-2">
                      Derek Bryan
                    </span>
                  </div>
                )}
              </li>
              {authContext.isLoggedIn() && (
                <li className="nav-item px-2">
                <Link to="/dashboard" className="nav-link fs-5">
                    <i className="fas fs-2 fa-sliders-h"></i>
                    <span className="d-lg-none d-inline-block ms-2">
                      Dashboard
                    </span>
                  </Link>
              </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
