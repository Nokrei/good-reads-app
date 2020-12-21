This project was part of a coding assignment for Veeqo. 
The requirements were as follows:
-	Use React (with react-dom)
-	Use router
-	Pick a state management solution – I chose the context API
-	The app is to interact with the GoodReads API
-	The app needs to run in browser without page refresh
-	The app must have following: home page with search bar to search for different entities (books titles, author or ISBN) and author details page.
-	Search page (home): shows an input field where the user will enter what he/she is searching for (book title, author or ISBN), after the user has finished typing the request to query the API should be triggered. The search results should appear below the block with the search bar. Results should contain the following info: count of found items, a list of items, each item should show the book’s title, book’s ratings, book’s author, book’s publication date and book’s image. Author’s field from the item should be clickable and should lead to the author details page.
-	The app must be runnable from a single command on a command-line

I set my own deadline for this project to three days as I am familiar and frequently use the tech stack required. I have run into three problems while creating the app:
-	The GoodReads API response was in XML format – I used fast-xml-parser to convert it to JSON, this was a very minor issue
-	CORS headers were not included in any API calls – I had to resolve to routing the request through https://cors-anywhere.herokuapp.com/, this was a bit more problematic as I’m not convinced about the reliability of this solution – I was unsure if the occasional long loading time of the app was caused by this or by the API itself
-	The API rate limit – the GoodReads API has a rate limit of one request per second, which proved to be problematic when I was testing API calls. I ended up receiving the 429 error status constantly and being forced to wait until the API would cooperate with me again. Resetting the API key was not a reliable way to solve this issue. This was a major problem for me in this project, as it led to a significant waste of development time.
Overall I delivered the application with all the functionality requested, with aesthetic, theme-appropriate styling, smooth user experience and responsive design. 
Majority of the styling was done with the use of Material UI, with CSS written mostly inline, leaving few lines of code for the App.css file – mostly used to handle style changes upon widow resize.  The resize itself was handled by a custom hook – useWindowDimensions. 
