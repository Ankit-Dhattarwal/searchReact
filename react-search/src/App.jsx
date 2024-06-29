import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

let timer;
function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastElement = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((enties) => {
      if (enties[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  useEffect(() => {
    setData([]);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const getSearchItems = async () => {
      const books = await axios.get(
        `http://openlibrary.org/search.json?title=${query}&page=${page}`
      );
      setLoading(false);
      setHasMore(books.data.docs.length > 0);
      setData((prev) => {
        return [
          ...new Set([...prev, ...books.data.docs.map((book) => book.title)]),
        ];
      });
    };

    getSearchItems();
  }, [query, page]);

  const handleChange = (e) => {
    if (timer) {
      clearTimeout();
    }

    timer = setTimeout(() => {
      setQuery(e.target.value);
      setPage(1);
    }, 1000);
  };
  return (
    <div className="SearchContainer">
      <input type="text" onChange={(e) => handleChange(e)} />
      {data.map((book, index) => {
        if (data.length === index + 1) {
          return (
            <div key={index} ref={lastElement} className="searchTitle">
              {book}
            </div>
          );
        } else {
          return (
            <div key={index} className="searchTitle">
              {book}
            </div>
          );
        }
      })}
      <div className="loading">{loading && "Loading..."}</div>
    </div>
  );
}

export default App;
