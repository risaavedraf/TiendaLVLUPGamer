// Archivo: Project/src/components/Footer.tsx

function Footer() {
  return (
    <div className="container">
      <footer className="py-5">
        <div className="row">
          <div className="col-md-5 offset-md-7 mb-3">
            <form>
              <h5>Subscribete para recibir las mejores ofertas</h5>
              <p>Recibe las mejores ofertas en tu correo</p>
              <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                <label htmlFor="newsletter1" className="visually-hidden"
                  >Correo electronico</label>
                <input
                  id="newsletter1"
                  type="email"
                  className="form-control"
                  placeholder="Correo electronico"
                />
                <button className="btn btn-primary" type="button">Subscribirse</button>
              </div>
            </form>
          </div>
        </div>
        <div
          className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top"
        >
          <p>© LevelUpGames, Inc. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3">
              <a className="link-body-emphasis" href="#" aria-label="Instagram"
                ><i className="bi bi-instagram icon"></i></a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="#" aria-label="Facebook"
                ><i className="bi bi-facebook icon"></i></a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;