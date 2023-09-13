<div align="center">
    <a href="https://gdsc.community.dev/" target="_blank">
        <img src=".github/img.png" alt="Banner">
    </a>
    <br>
    <h2>GDSC Farmingdale Events API</h2>
    <!-- Repository description -->
    GDSC's link website scraping API
    <br>
This is an API that scrapes the GDSC Farmingdale events from the GDSC website and provides them in a structured JSON format.
</div>




## Features
- Scrapes the GDSC Farmingdale events.
- Stores the events in a local JSON file.
- Provides an endpoint to fetch the stored events.
- Periodically updates the events (every week by default).

## Prerequisites
Before you begin, ensure you have met the following requirements:

- Git: [Download](https://git-scm.com/downloads)
- Node.js: [Download](https://nodejs.org/)
- npm: [Download](https://www.npmjs.com/)

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/GDSC-FSC/gdsc-farmingdale-links-api
```

2. Navigate to the directory:
```bash
cd gdsc-farmingdale-links-api
```

3. Install the required dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

- **GET** `/events`
  - Returns the events stored in the local JSON file.

## Acknowledgements

This repository may utilize packages and dependencies from the following sources:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Cheerio](https://cheerio.js.org/)

Please make sure to review and adhere to the licenses and terms of use of these dependencies.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the terms of the MIT license. For more details, see the [LICENSE](LICENSE) file in the repository.

