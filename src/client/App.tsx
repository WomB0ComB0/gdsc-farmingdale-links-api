import React from "react";
import { Nav, Header, Footer } from "./components/index";

const App = (): JSX.Element => {
  React.useEffect(() => {
    const accordion = document.querySelectorAll("details[name='accordion']");
    accordion.forEach((element) => {
      element.addEventListener("click", () => {
        accordion.forEach((element) => {
          element.removeAttribute("open");
        });
      });
    });
  }, []);
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
          </article>
          <section role="group">
            <details name="accordion">
              <summary>Past Events</summary>
              <ul className="card">
                <li>
                  <p>
                    <strong>
                      title:&nbsp;
                    </strong>
                    string
                  </p>
                </li>
                <li>
                  <p>
                    <strong>
                      thumbnailLink:&nbsp;
                    </strong>
                    string
                  </p>
                </li>
                <li>
                  <p>
                    <strong>
                      detailsLink:&nbsp;
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
                      title:&nbsp;
                    </strong>
                    string
                  </p>
                </li>
                <li>
                  <p>
                    <strong>
                      thumbnailLink:&nbsp;
                    </strong>
                    string
                  </p>
                </li>
                <li>
                  <p>
                    <strong>
                      detailsLink:&nbsp;
                    </strong>
                    string
                  </p>
                </li>
              </ul>
            </details>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};
export default App
