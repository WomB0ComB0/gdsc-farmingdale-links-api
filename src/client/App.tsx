import React from "react";
import { Nav, Header, Footer } from "./components/index";
const App: React.FC = () => {
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
          <section role="group">
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
          </section>
      </article>
    </section>
  </main>
  <Footer />
    </>
  );
};
export default App;
