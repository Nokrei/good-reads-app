import React, { useState, useEffect } from "react";
import Axios from "axios";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useWindowDimensions from "./useWindowDimensions";
import BookCard from "./BookCard";
import BooksPagination from "./BooksPagination";
import preloader from "./resources/99.gif";
const MainScreen = () => {
  // Custom hook to detect browser width and adjust style accodringly
  const { width } = useWindowDimensions();

  const [gridClass, setGridClass] = useState("");
  useEffect(() => {
    if (width > 1024) {
      setGridClass("main__cardContainer--wide");
    } else {
      setGridClass("main__cardContainer--narrow");
    }
  }, [width]);

  // Variable to capture value of user's search
  let searchField;

  // API key for Good Reads API, not stored in .env but hardcoded
  // Netlify has problems with .env
  const apiKey = "khW7jdeXSXEe37oDLAEA";

  // State variables
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInfo, setSearchInfo] = useState({
    totalResults: 0,
    pages: 0,
  });
  const [query, setQuery] = useState({
    search: "",
    result: "",
  });

  // Variables for Fast Xml Parser
  const parser = require("fast-xml-parser");
  const he = require("he");
  const options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) =>
      he.decode(val, { isAttributeValue: true }), //default is a=>a
    tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"],
  };

  // Function to handle search on click.
  const handleSearch = () => {
    setQuery({
      ...query,
      search: searchField.value,
    });
  };

  // Function to handle search on key down (enter)
  // GoodReads API has a rate limit of 1 per s
  // so do not want to continuously search with every key stroke. 
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      setQuery({
        ...query,
        search: searchField.value,
      });
    }
  };

  // Function to handle pagination.
  const handleChange = (event, value) => {
    setPage(value);
  };

  // Using Axios to get book list from Good Reads API.
  // Usign cors-anywhere as GoodReads does not include
  // the CORS header in ANY of their api calls.
  useEffect(() => {
    if (query.search.length > 0) {
      Axios.get(
        `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search.xml?key=${apiKey}&q=${searchField.value}&page=${page}`
      ).then((response) => {
        const bookResp = parser.parse(response.data, [options]);
        console.log(bookResp);

        // To be executed when user searches by title or author name
        if (Array.isArray(bookResp.GoodreadsResponse.search.results.work)) {
          const card = bookResp.GoodreadsResponse.search.results.work.map(
            (book) => {
              return {
                key: book.id,
                title: book.best_book.title,
                author: book.best_book.author.name,
                authorId: book.best_book.author.id,
                rating: book.average_rating,
                img: book.best_book.image_url,
                day: book.original_publication_day,
                month: book.original_publication_month,
                year: book.original_publication_year,
              };
            }
          );
          // Setting state varable to feed data to pagination
          setSearchInfo({
            totalResults: bookResp.GoodreadsResponse.search["total-results"],
            pages: bookResp.GoodreadsResponse.search["total-results"] / 20 + 1,
          });

          // Setting state variable to feed data to book cards
          setResults(card);

          // Emptying the errors array
          setErrors([]);
        } else if (
          // To be executed when user searches by ISBN (1 result only)
          !Array.isArray(bookResp.GoodreadsResponse.search.results.work) &&
          typeof bookResp.GoodreadsResponse.search.results != "string"
        ) {
          const card = bookResp.GoodreadsResponse.search.results.work;

          // Setting state varable to feed data to pagination,
          // want pagiation to appear only for multiple results
          setSearchInfo({
            totalResults: 1,
            pages: 1,
          });

          // Setting state variable to feed data to book card(s)
          setResults(card);

          // Emptying the errors array
          setErrors([]);
        } else {
          // If no results are found, populate errors with message
          setErrors("No results were found for your query, please try again.");
          setResults([]);
          setSearchInfo({
            totalResults: 0,
            pages: 0,
          });
        }
      });
    }
  }, [query, page]);

  return (
    <div className="main">
      <div
        className="search"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          onKeyDown={handleKeyDown}
          style={{ width: "16em", backgroundColor: "#4e342e" }}
          variant="outlined"
          color="secondary"
          inputRef={(comp) => (searchField = comp)}
          label="Search by title, author or ISBN"
        ></TextField>
        <Button onClick={handleSearch} variant="contained" color="secondary">
          <Typography variant="body2">Search</Typography>
        </Button>
      </div>
      <Typography variant="subtitle2" color="secondary">
        Search powered by Goodreads API
      </Typography>
      <br />
      <div style={{ display: "grid", justifyItems: "center" }}>
        {query.search.length > 0 &&
        errors.length === 0 &&
        searchInfo.totalResults > 1 ? (
          <div
            style={{
              color: "#ede2d1",
              background: "rgba(1, 1, 1, 0.5)",
              Maxwidth: "27em",
              marginBottom: "1em",
            }}
          >
            <Typography variant="body1">
              Found {searchInfo.totalResults} results matching your query:{" "}
              {query.search}
            </Typography>
            <BooksPagination
              count={searchInfo.pages.toFixed(0)}
              page={page}
              handleChange={handleChange}
            />
          </div>
        ) : null}
      </div>

      {query.search.length > 0 && searchInfo.totalResults < 1 ? (
        <img src={preloader} />
      ) : null}
      <div className={gridClass}>
        {Array.isArray(results)
          ? results.map((item) => {
              return (
                <BookCard
                  style={{
                    width: "10em",
                    Minheight: "20em",
                    textAlign: "center",
                    backgroundColor: "#ede2d1",
                    color: "#212121",
                    opacity: "0.95",
                  }}
                  key={item.key}
                  title={item.title.replace(/ *\([^)]*\) */g, "")}
                  author={"By: " + item.author}
                  authorId={item.authorId}
                  img={item.img}
                  rating={"Rating: " + item.rating}
                  published={"Published: " + item.year}
                />
              );
            })
          : null}
        {!Array.isArray(results) && (
          <BookCard
            style={{
              width: "10em",
              Minheight: "20em",
              textAlign: "center",
              backgroundColor: "#ede2d1",
              color: "#212121",
              opacity: "0.95",
            }}
            title={results.best_book.title}
            author={results.best_book.author.name}
            authorId={results.best_book.author.id}
            img={results.best_book.image_url}
            rating={results.average_rating}
            published={
              results.original_publication_day +
              "." +
              results.original_publication_month +
              "." +
              results.original_publication_year
            }
          />
        )}
      </div>
      {query.search.length > 0 &&
      errors.length === 0 &&
      searchInfo.totalResults > 1 ? (
        <div>
          <BooksPagination
            count={searchInfo.pages.toFixed(0)}
            page={page}
            handleChange={handleChange}
          />
        </div>
      ) : null}
      {errors.length > 0 ? (
        <div
          style={{ display: "grid", justifyItems: "center", opacity: "0.7" }}
        >
          <Typography
            variant="body1"
            color="error"
            style={{ backgroundColor: "white", width: "30em" }}
          >
            {errors}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default MainScreen;
