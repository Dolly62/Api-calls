import React, { useCallback, useEffect, useState } from "react";
import Form from "./components/Form";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryInterval, setRetryInterval] = useState(null);
  // const [movieList, setMovieList] = useState([]);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-7f6ba-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].Title,
          openingText: data[key].OpeningText,
          releaseDate: data[key].date,
        });
      }
      console.log(loadedMovies);
      setMovies(loadedMovies);

      // const transformMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
    } catch (error) {
      setError(error.message);

      startRetry();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
    // console.log("useEffect");
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    // console.log(movie);
    const response = await fetch(
      "https://react-http-7f6ba-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
  }

  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];

  // Cancel or Retry Movie
  const startRetry = () => {
    setRetrying(true);
    const intervalId = setInterval(() => {
      fetchMoviesHandler();
    }, 5000);
    setRetryInterval(intervalId);
  };

  const cancelRetry = () => {
    setRetrying(false);
    if (retryInterval) {
      clearInterval(retryInterval);
    }
  };

  //Delete Movie
  const deleteMovieHandler = async (movieId) => {
    try {
      const response = await fetch(
        `https://react-http-7f6ba-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong while deleting movie");
      }

      setMovies((prevLists) => {
        const updatedLists = prevLists.filter((movie) => movie.id !== movieId);
        return updatedLists;
      });
    } catch (error) {
      setError(error.message);
      console.log("Error deleting movies:", error);
    }
  };

  return (
    <React.Fragment>
      <section>
        <Form onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && (
          <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />
        )}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && (
          <p>
            {error} {retrying && <button onClick={cancelRetry}>Cancel</button>}
          </p>
        )}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
