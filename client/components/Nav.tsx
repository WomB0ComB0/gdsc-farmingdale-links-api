import React from 'react'
const Nav: React.FC = () => {
  return (
    <nav>
      <menu>
        <li>
          <img src="/assets/images/Logo.png" alt="Logo" width="40" height="40" aria-hidden="true" />
          <a id="organization" target="_blank" rel="noopener noreferrer">
            <span>GDSC</span> Farmingdale
          </a>
        </li>
      </menu>
      <menu>
        <li>
          <i className="fa-brands fa-github" aria-hidden="true"></i>
          <a id="repository" target="_blank" rel="noopener noreferrer">GitHub</a>
        </li>
      </menu>
    </nav>
  )
}
export default Nav
