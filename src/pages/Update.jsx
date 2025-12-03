import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Update = () => {
    const [book, setBook] = useState({ title: "", desc: "", price: "" });
    const [file, setFile] = useState(null); // new image
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const bookId = location.pathname.split("/")[2];

    // Fetch existing book data
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/books/${bookId}`);
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                if (data) {
                    setBook({
                        title: data.title || "",
                        desc: data.desc || "",
                        price: data.price !== undefined ? data.price : "",
                    });
                }
            } catch (err) {
                console.log("Failed to fetch book:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [bookId]);

    // Handle input change
    const handleChange = (e) => {
        setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle update
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", book.title);
            formData.append("desc", book.desc);
            formData.append("price", book.price === "" ? null : Number(book.price));
            if (file) formData.append("cover", file); // attach new image if selected

            await axios.put(`http://localhost:8800/books/${bookId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/");
        } catch (err) {
            console.log("Update failed:", err);
        }
    };

    if (loading) return <div className="form"><h2>Loading...</h2></div>;

    return (
        <div className="form">
            <h1>Update Book</h1>
            <input type="text" placeholder="Title" name="title" value={book.title} onChange={handleChange} />
            <input type="text" placeholder="Description" name="desc" value={book.desc} onChange={handleChange} />
            <input type="number" placeholder="Price" name="price" value={book.price} onChange={handleChange} />
            <input type="file" onChange={handleFileChange} />
            <button className="formButton" onClick={handleClick}>Update</button>
        </div>
    );
};

export default Update;
