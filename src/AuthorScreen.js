import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import AppContext from "./AppContext";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import BookCard from "./BookCard";
import BooksPagination from "./BooksPagination";
import zIndex from "@material-ui/core/styles/zIndex";
const AuthorScreen = () => {
  //Get author name and ID from global state
  const [globalState, setGlobalState] = useContext(AppContext);

  // API key for Good Reads API
  const apiKey = "khW7jdeXSXEe37oDLAEA";

  // State variables
  const [authorData, setAuthorData] = useState({
    name: "",
    fans: "",
    image: "",
    about: "",
    followers: "",
    hometown: "",
  });
  const [bookQuery, setBookQuery] = useState("");
  const [authorBookResults, setAuthorBookResults] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInfo, setSearchInfo] = useState({
    totalResults: 0,
    pages: 0,
  });
  // Variable for HTML parser
  const parseHtml = require("html-react-parser");

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
  // Function to handle author's books display
  const handleAuthorBooks = () => {
    setBookQuery(globalState.authorId);
  };
  // Function to handle pagination
  const handleChange = (event, value) => {
    setPage(value);
  };

  // Using Axios to get author details from Good Reads API.
  // Usign cors-anywhere to bypass cors
  useEffect(() => {
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/author/show/${globalState.authorId}?format=xml&key=${apiKey}`
    ).then((response) => {
      const authorResp = parser.parse(response.data, [options]);
      console.log(authorResp);
      setAuthorData({
        name: authorResp.GoodreadsResponse.author.name,
        fans: authorResp.GoodreadsResponse.author.fans_count,
        image: authorResp.GoodreadsResponse.author.image_url,
        about: parseHtml(authorResp.GoodreadsResponse.author.about),
        followers: authorResp.GoodreadsResponse.author.author_followers_count,
        hometown: authorResp.GoodreadsResponse.author.hometown,
      });
      setSearchInfo({
        totalResults: authorResp.GoodreadsResponse.author.works_count,
        pages: authorResp.GoodreadsResponse.author.works_count / 30 + 1,
      });
    });
  }, [globalState.authorId]);

  // Using Axios to get author's books from Good Reads API.
  // Usign cors-anywhere to bypass cors
  useEffect(() => {
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/author/list/${bookQuery}?format=xml&key=${apiKey}&page=${page}`
    ).then((response) => {
      const authorBooksResp = parser.parse(response.data, [options]);
      console.log(authorBooksResp);
      if (Array.isArray(authorBooksResp.GoodreadsResponse.author.books.book)) {
        const authorBookCard = authorBooksResp.GoodreadsResponse.author.books.book.map(
          (authorBook) => {
            return {
              key: authorBook.id,
              title: authorBook.title,
              isbn: authorBook.isbn13,
              reviewCount: authorBook.text_reviews_count,
              img: authorBook.image_url,
              link: authorBook.link,
              pages: authorBook.num_pages,
              format: authorBook.format,
              published: authorBook.publication_year,
              rating: authorBook.average_rating,
              ratingCount: authorBook.ratings_count,
              desc: parseHtml(authorBook.description),
            };
          }
        );
        setAuthorBookResults(authorBookCard);
      }
    });
  }, [bookQuery, page]);

  return (
    <div>
      <div style={{ display: "grid", justifyItems: "center" }}>
        <div
          style={{
            display: "grid",
            justifySelf: "center",
            justifyItems: "center",
            color: "#e0e0e0",
            minWidth: "30em",
            maxWidth: "80em",
            backgroundColor: "#bdbdbd",
            color: "#212121",
            opacity: "0.95",
            padding: "1em",
          }}
        >
          <img
            src={authorData.image}
            style={{ height: "30em", opacity:'1'}}
          />
          <Typography variant="h5">{authorData.name}</Typography>
          <Typography variant="body1">Fans: {authorData.fans}</Typography>
          <Typography variant="body1">
            Followers: {authorData.followers}{" "}
          </Typography>
          <Typography variant="body1">
            Hometown: {authorData.hometown}{" "}
          </Typography>
          <br />
          <Typography variant="h6">About the author</Typography>
          <br />
          <Typography variant="body2" style={{ textAlign: "justify" }}>
            {authorData.about}
          </Typography>
          <br />
          <Button variant="contained" onClick={handleAuthorBooks}>
            Show author's books
          </Button>
        </div>
      </div>

      {bookQuery.length != "" ? (
        <BooksPagination
          count={searchInfo.pages.toFixed(0)}
          page={page}
          handleChange={handleChange}
        />
      ) : null}
      <div
        className="cardContainer"
        style={{
          display: "grid",
          gridTemplateColumns:'1fr',
          gridRowGap: "1em",
          justifyItems: "center",
        }}
      >
        {Array.isArray(authorBookResults) &&
          authorBookResults.map((authorBookItem) => {
            return (
              <BookCard
                style={{
                  width: "30em",
                  Minheight: "20em",
                  textAlign: "center",
                  backgroundColor: "#bdbdbd",
                  color: "#212121",
                  opacity: "0.95",
                }}
                key={authorBookItem.key}
                img={authorBookItem.img}
                title={authorBookItem.title}
                isbn={"ISBN: " + authorBookItem.isbn}
                reviewCount={"Reviews: " + authorBookItem.reviewCount}
                link={authorBookItem.link}
                pages={"Pages: " + authorBookItem.pages}
                format={"Format: " + authorBookItem.format}
                ratingCount={"Number of ratings: " + authorBookItem.ratingCount}
                rating={"Rating: " + authorBookItem.rating}
                published={"Published: " + authorBookItem.published}
                desc={parseHtml(String(authorBookItem.desc))}
              />
            );
          })}
      </div>
      {bookQuery.length != "" ? (
        <BooksPagination
          count={searchInfo.pages.toFixed(0)}
          page={page}
          handleChange={handleChange}
        />
      ) : null}
    </div>
  );
};

export default AuthorScreen;
