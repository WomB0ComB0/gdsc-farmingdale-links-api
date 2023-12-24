import React, { useLayoutEffect } from "react";
import { Nav, Header, Footer } from "./components/index";
const App: React.FC = () => {
  useLayoutEffect(() => {
    window.addEventListener("DOMContentLoaded", () => {
      if (window.innerWidth < 600) {
        alert("Please rotate your device to landscape mode for the best experience. Why are you even on mobile lol?");
      }
    });

    // @ts-ignore
    const updateCursor = ({ x, y }) => {
      document.documentElement.style.setProperty('--x', x);
      document.documentElement.style.setProperty('--y', y);
    };

    document.body.addEventListener('pointermove', updateCursor);

    // Anchor logic
    const anchorRepository = document.getElementById("repository");
    if (anchorRepository) {
      const anchorRepository = document.getElementById("repository")! as HTMLAnchorElement;
      if (anchorRepository) {
        anchorRepository.href = "https://github.com/GDSC-FSC/gdsc-farmingdale-links";
      }
    }

    const anchorOrganization = document.getElementById("organization")! as HTMLAnchorElement;
    if (anchorOrganization) {
      anchorOrganization.href = "https://gdsc.community.dev/farmingdale-state-college/";
    }

    // Accordion logic
    const accordion = document.querySelectorAll("details[name='accordion']");
    accordion.forEach((element) => {
      element.addEventListener("click", () => {
        accordion.forEach((element) => {
          element.removeAttribute("open");
        });
      });
    });
  }, []);

  const Accordion = `
    <details name="accordion">
      <summary>Past Events</summary>
      <ul className="card">
        <li>
          <p>
            <strong>
              title:
            </strong>
            string
          </p>
        </li>
        <li>
          <p>
            <strong>
              thumbnailLink:
            </strong>
            string
          </p>
        </li>
        <li>
          <p>
            <strong>
              detailsLink:
            </strong>
            string
          </p>
        </li>
      </ul>
    </details>
    <details name="accordion">
      <summary>Upcoming Events</summary>
      <ul className="card">
        <li>
          <p>
            <strong>
              title:
            </strong>
            string
          </p>
        </li>
        <li>
          <p>
            <strong>
              thumbnailLink:
            </strong>
            string
          </p>
        </li>
        <li>
          <p>
            <strong>
              detailsLink:
            </strong>
            string
          </p>
        </li>
      </ul>
    </details>
  `
  return (
    <>
    <Nav />
    <Header />
    <main>
      <section>
        <article>
          <h2>
            GDSC Links API
          </h2>
          <p>
            The purpose of this
            <a href="https://en.wikipedia.org/wiki/API" rel="noopener noreferrer" target="_blank">
              API
            </a>
            &nbsp;is to provide a way for any GDSC {/*Finish later*/}.
            This api returns 2 json objects,
            &nbsp;
            <strong>
              'past-events'
            </strong>
            <sup>

            </sup>
            &nbsp;(found in&nbsp;
            <a href="/api/past-events" target="_self" rel="noopener noreferrer">
              <i>
                {"https://{domain}/api/past-events"}
              </i>
            </a>
            ) and
            <strong>
              'upcoming-events'
            </strong>
            &nbsp;(found in&nbsp;
            <a href="/api/upcoming-events" target="_self" rel="noopener noreferrer">
              <i>
                {"https://{domain}/api/upcoming-events"}
              </i>
            </a>
            ).
          </p>
          <section role="group" dangerouslySetInnerHTML={{ __html: Accordion }}/>
      </article>
    </section>
  </main>
  <Footer />
    </>
  );
};
export default App;
