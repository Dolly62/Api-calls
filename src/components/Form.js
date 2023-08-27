import React, { useState } from "react";
import classes from "./Form.module.css";

const Form = () => {
  const [title, setTitle] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [date, setDate] = useState("");

  const formInputHandler = (event) => {
    event.preventDefault();
    const newMovieObj = [{
        Title: title,
        OpeningText: openingText,
        date: date,
    }]
    console.log(newMovieObj);
    setTitle("");
    setOpeningText("")
    setDate("")
    
  };

  const titleHandler = (event) => {
    setTitle(event.target.value);
    console.log(event.target.value);
  };
  const textAreaHandler = (event) => {
    setOpeningText(event.target.value);
  };
  const dateHandler = (event) => {
    setDate(event.target.value);
  };

  return (
    <form className={classes.form} onSubmit={formInputHandler}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" value={title} onChange={titleHandler} />
      <label htmlFor="openingText">Opening Text</label>
      <textarea
        id="openingText"
        value={openingText}
        onChange={textAreaHandler}
      />
      <label htmlFor="date">Release Date</label>
      <input type="date" id="date" value={date} onChange={dateHandler} />
      <button type="submit">Add Movies</button>
    </form>
  );
};

export default Form;
