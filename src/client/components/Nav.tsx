import { GdscLogo } from './svgs/index';
const Nav = (): JSX.Element => {
  return (
    <nav>
      <menu
        style={{
          padding: "0",
          display: "flex",
          alignItems: "center",
          width: "80px",
          height: "80px",
          userSelect: "none",
          color: "#747474",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        onClick={() => {
          window.open("https://gdsc.community.dev/farmingdale-state-college/", "_blank", "noopener noreferrer")
        }}
      >
        <GdscLogo/>
      </menu>
      <menu>
        <li>
          <i className="fa-brands fa-github" aria-hidden="true"></i>
          <a href={`https://github.com/GDSC-FSC/gdsc-farmingdale-links`} target="_blank" rel="noopener noreferrer">GitHub</a>
        </li>
      </menu>
    </nav>
  )
};
export default Nav
