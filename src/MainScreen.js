import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import Typography from "@material-ui/core/Typography";
import AppContext from "./AppContext";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useWindowDimensions from "./useWindowDimensions";
import BookCard from "./BookCard";
import BooksPagination from "./BooksPagination";
const MainScreen = () => {
  // Custom hook to detect browser width and adjust style accodringly
  const { width } = useWindowDimensions();

  const [gridClass, setGridClass] = useState("");
  useEffect(() => {
    if (width > 500) {
      setGridClass("main__cardContainer--wide");
    } else {
      setGridClass("main__cardContainer--narrow");
    }
  }, [width]);

  let searchField;
  // API key for Good Reads API
  const apiKey = "khW7jdeXSXEe37oDLAEA";

  const [globalState, setGlobalState] = useContext(AppContext);

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

  // Function to handle search
  const handleSearch = () => {
    setQuery({
      ...query,
      search: searchField.value,
    });
    console.log(globalState);
  };

  // Function to handle pagination
  const handleChange = (event, value) => {
    setPage(value);
  };

  // Using Axios to get book list from Good Reads API.
  // Usign cors-anywhere to bypass cors
  useEffect(() => {
    if (query.search.length > 0) {
      Axios.get(
        `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search.xml?key=${apiKey}&q=${searchField.value}&page=${page}`
      ).then((response) => {
        const bookResp = parser.parse(response.data, [options]);
        console.log(bookResp);
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

          setSearchInfo({
            totalResults: bookResp.GoodreadsResponse.search["total-results"],
            pages: bookResp.GoodreadsResponse.search["total-results"] / 20 + 1,
          });

          setResults(card);

          setErrors([]);
        } else if (
          !Array.isArray(bookResp.GoodreadsResponse.search.results.work) &&
          typeof bookResp.GoodreadsResponse.search.results != "string"
        ) {
          const card = bookResp.GoodreadsResponse.search.results.work;
          console.log(card);

          setResults(card);
          setErrors([]);
        } else {
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
  useEffect(() => {
    //console.log(results);
  }, [results]);
  //console.log(errors);
  return (
    <div className="main">
      <div
        className="search"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          style={{ width: "16em", backgroundColor:'#bdbdbd', }}
          variant="outlined"
          color="secondary"
          inputRef={(comp) => (searchField = comp)}
          label="Search by title, author or ISBN"
        ></TextField>
        <Button onClick={handleSearch} variant="contained" color="primary">
          Search
        </Button>
      </div>
      <br />
      {query.search.length > 0 && errors.length === 0 && (
        <div>
          <Typography variant="body1" color="secondary">
            Found {searchInfo.totalResults} results matching your query:{" "}
            {query.search}
          </Typography>
          <BooksPagination
            count={searchInfo.pages.toFixed(0)}
            page={page}
            handleChange={handleChange}
          />
        </div>
      )}
      <div className={gridClass}>
        {Array.isArray(results)
          ? results.map((item) => {
              return (
                <BookCard
                  style={{
                    width: "10em",
                    Minheight: "20em",
                    textAlign: "center",
                    backgroundColor: "#bdbdbd",
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
              backgroundColor: "#bdbdbd",
              color: "#212121",
              opacity: "0.95",
            }}
            title={results.best_book.title}
            author={results.best_book.author.name}
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
      {query.search.length > 0 && errors.length === 0 && (
        <div>
          <BooksPagination
            count={searchInfo.pages.toFixed(0)}
            page={page}
            handleChange={handleChange}
          />
        </div>
      )}
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
