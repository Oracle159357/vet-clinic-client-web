import { Outlet, Link } from 'react-router-dom';
import './Layout.css';
import React from 'react';

function Layout() {
  return (
    <div className="Layout" id="container">
      <div className="menu">
        <ul>
          <li>
            <Link to="/TableWithRT">React Table + api</Link>
          </li>
          <li>
            <Link to="/TableWithNoRT">My Custom Table + api</Link>
          </li>
        </ul>
      </div>
      <div id="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
