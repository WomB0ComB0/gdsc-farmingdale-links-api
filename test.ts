(async() => console.log(
  (await
    (await import('open-graph-scraper')
    .then(t => t.default))(
      {
        url: "https://gdg.community.dev/events/details/google-gdg-on-campus-farmingdale-state-college-farmingdale-united-states-presents-gdg-on-campus-farmingdale-state-college-google-cloud-learning-2025-06-21/",
        fetchOptions: {
          headers: {
            'use-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
          },
        }
      }
    )
  )
  .result.ogTitle
))()