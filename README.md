# GDSC FSC | Links API

This repository contains the source code for the GDSC Farmingdale State College Links API, designed to provide an efficient solution for GDSC communities to keep their members informed. The project includes features for event management, a web API, and a user-friendly front-end interface.

## Major Parts of the Code

### 1. **Husky Configuration**
The Husky configuration ensures that code is linted before it is committed. The relevant script is located in the `husky.sh` file and it runs `yarn lint` to check for code quality.

### 2. **CSS Processing**
The CSS files are processed using PostCSS to transform the styles. The command to process the CSS is:
```bash
npx postcss input.css > output.css
```

### 3. **HTML Structure**
The main HTML file sets up the basic structure of the application:
- It includes meta tags for SEO, viewport settings, and links to the PWA icons.
- The `service-worker.js` is registered to enable PWA capabilities.
- The root application element is defined with `<div id="app"></div>`.

### 4. **Sitemap Configuration**
The sitemap is defined in XML format to help search engines index the API's pages efficiently, with various entries for different endpoints and their update frequencies.

### 5. **GitHub Actions for CI/CD**
The repository includes a GitHub Actions workflow (`.github/workflows/pr.yml`) to automate the build and deployment process on each pull request to the main branch. The process includes:
- Checking out the code.
- Setting up the Bun package manager.
- Installing dependencies and running tests.
- Compiling the application and preparing it for deployment.

### 6. **CSS Styling**
The CSS files employ a variety of styles, including responsive design elements, custom fonts, and animations. They define styles for navigation, main content, and footer elements.

### 7. **API Data Structure**
The API returns data in JSON format, outlining details about upcoming events, including titles, thumbnail links, and detail links.

## Installation Instructions

To set up the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/gdsc-links-api.git
   cd gdsc-links-api
   ```

2. **Install Dependencies:**
   Make sure you have [Bun](https://bun.sh/) installed. Then run:
   ```bash
   bun install
   ```

3. **Run the Application:**
   Start the development server with:
   ```bash
   bun run dev
   ```

4. **Build the Application:**
   To compile and bundle the application for production, run:
   ```bash
   bun run build
   ```

5. **Lint the Code:**
   Before committing any changes, ensure the code is linted:
   ```bash
   yarn lint
   ```

## Usage Instructions

Once the application is running, you can access the API by navigating to the relevant endpoints in your web browser or using tools like Postman. The primary endpoints include:
- `/api` - Main API endpoint.
- `/api/past-events` - Retrieve past events.
- `/api/upcoming-events` - Retrieve upcoming events.

For further customization, you can modify the CSS and HTML files to fit your design needs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

This README provides a comprehensive overview of the GDSC FSC Links API project, outlining its structure, installation, and usage instructions. Adjust the repository URL and other specifics as necessary for your project.