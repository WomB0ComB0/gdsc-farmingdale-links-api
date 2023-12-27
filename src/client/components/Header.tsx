import { FC, useState, useEffect} from 'react'
const Header: FC<{ name?: string }> = ({ name = 'SUNY Farmingdale' }): JSX.Element => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  useEffect(() => {
    if (width < 600) {
      alert("Please rotate your device to landscape mode for the best experience. Why are you even on mobile lol?");
    }
    if (height < 870) {
      alert("This developer was too lazy to make this website responsive. Please use a device with a height of at least 870px (anything above).");
    }
  }, []);
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100dvw",
        height: "30dvh",
        backgroundColor: "#1d1d1d",
        color: "white",
        userSelect: "none",
        padding: "1rem",
      }}
    >
      <article
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          userSelect: "none",
          color: "#747474",
          backgroundColor: "transparent",
          overflowY: "hidden",
          overflowX: "hidden",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 900,
            margin: 0,
            padding: 0,
            userSelect: "none",
          }}
        >
          Google Student Developer Clubs
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 400,
            margin: 0,
            padding: 0,
            userSelect: "none",
          }}
        >
          {name}
        </p>
      </article>
    </header>
  )
}
export default Header
