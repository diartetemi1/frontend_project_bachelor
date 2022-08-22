import classes from './HeaderComponent.css';


const HeaderComponent = () => {
  return (
    <div className="header-container" >
      <header>
        <nav className="navbar navbar-expand-lg bg-secondary">
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item text-center">
                <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  Startseite
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active text-light text-center"
                  aria-current="page"
                  href="#"
                >
                  Kundenübersicht
                </a>
              </li>
              <li className="nav-item">
              <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  Kurierfahrerübersicht
                </a>
              </li>
              <li className="nav-item">
              <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  Tourenübersicht
                </a>
              </li>
              <li className="nav-item">
              <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  Rechnungsübersicht
                </a>
              </li>
              <li className="nav-item">
              <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  FAQ
                </a>
              </li>
              <li className="nav-item">
              <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  Mehr
                </a>
              </li>
              <li className="nav-item">
              <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
};
export default HeaderComponent;
