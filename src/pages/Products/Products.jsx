import { NavLink } from "react-router-dom";

<li className="nav-item dropdown">
  <span className="nav-link dropdown-toggle">
    Products
  </span>

  <ul className="dropdown-menu">
    <li>
      <NavLink className="dropdown-item" to="./AutomobileProduct.jsx">
        Automobile Products
      </NavLink>
    </li>

    <li>
      <NavLink className="dropdown-item" to="./MotorParts.jsx">
        Rubber Parts for Motorcycle
      </NavLink>
    </li>
  </ul>
</li>
