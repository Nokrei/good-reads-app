import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import AppContext from "./AppContext";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import BookCard from "./BookCard";

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
  // Using Axios to get author details from Good Reads API.
  // Usign cors-anywhere to bypass cors
  useEffect(() => {
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/author/show/${globalState.authorId}?format=xml&key=${apiKey}`
    ).then((response) => {
      const authorResp = parser.parse(response.data, [options]);
      //console.log(authorResp);
      setAuthorData({
        name: authorResp.GoodreadsResponse.author.name,
        fans: authorResp.GoodreadsResponse.author.fans_count,
        image: authorResp.GoodreadsResponse.author.image_url,
        about: authorResp.GoodreadsResponse.author.about,
        followers: authorResp.GoodreadsResponse.author.author_followers_count,
        hometown: authorResp.GoodreadsResponse.author.hometown,
      });
    });
  }, [globalState.authorId]);

  // Using Axios to get author's books from Good Reads API.
  // Usign cors-anywhere to bypass cors
  useEffect(() => {
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/author/list/${bookQuery}?format=xml&key=${apiKey}`
    ).then((response) => {
      const authorBooksResp = parser.parse(response.data, [options]);
      console.log(authorBooksResp);
      if (Array.isArray(authorBooksResp.GoodreadsResponse.author.books.book)) {
        const authorBookCard = authorBooksResp.GoodreadsResponse.author.books.book.map(
          (authorBook) => {
            return {
              key: authorBook.id,
              title: authorBook.title,
              isbn: authorBook.isbn,
              reviewCount: authorBook.text_reviews_count,
              img: authorBook.image_url,
              link: authorBook.link,
              pages: authorBook.num_pages,
              format: authorBook.format,
              published: authorBook.publication_year,
              rating: authorBook.average_rating,
              ratingCount: authorBook.ratings_count,
              desc: authorBook.description,
            };
          }
        );
        setAuthorBookResults(authorBookCard);
      }
    });
  }, [bookQuery]);

  return (
    <div>
      <Typography variant="h6">Author: {globalState.author}</Typography>
      <Typography variant="h6">ID: {globalState.authorId}</Typography>
      <ul>
        <li>{authorData.name}</li>
        <li>{authorData.fans}</li>
        <li>{authorData.image}</li>
        <li>{authorData.about}</li>
        <li>{authorData.followers}</li>
        <li>{authorData.hometown}</li>
      </ul>
      <Button variant="contained" onClick={handleAuthorBooks}>
        Show books
      </Button>
      <div
        className="cardContainer"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridRowGap: "1em",
          justifyItems:'center'
        }}
      >
            {Array.isArray(authorBookResults)&& (
          authorBookResults.map((authorBookItem)=>{
              return (
                  <BookCard
                  key={authorBookItem.key}
                  img={authorBookItem.img}
                  title={authorBookItem.title}
                  isbn={authorBookItem.isbn}
                  reviewCount={authorBookItem.reviewCount}
                  link={authorBookItem.link}
                  pages={authorBookItem.pages}
                  format={authorBookItem.format}
                  ratingCount={authorBookItem.ratingCount}
                  rating={authorBookItem.rating}
                  published={authorBookItem.published}
                  desc={authorBookItem.desc}
                  />
              )
          })
      )}
      </div>
      
    </div>
  );
};

export default AuthorScreen;
