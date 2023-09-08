const Layout = ( {children} ) => {
    return (
      <div className="wrapper">
          <header>
              <div className="container">
                  <h1>Задание №4</h1>
              </div>
          </header>
          <main>
              <div className="container">
                  <div className="content">
                      {children}
                  </div>
              </div>
          </main>
          <footer>
              <div className="container"></div>
          </footer>
      </div>
    )
  }
  
  export default Layout