import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [book, setBook] = useState({ title: "", desc: "", price: "" });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("desc", book.desc);
      formData.append("price", book.price);
      if (file) formData.append("cover", file); // key must match multer middleware

      await axios.post("http://localhost:8800/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input type="text" placeholder="Title" name="title" onChange={handleChange} />
      <input type="text" placeholder="Description" name="desc" onChange={handleChange} />
      <input type="number" placeholder="Price" name="price" onChange={handleChange} />
      <input type="file" onChange={handleFileChange} />
      <button className="formButton" onClick={handleClick}>Add</button>
    </div>
  );
};

export default Add;
