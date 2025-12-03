// Update.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Update = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: "",
        cover: "",
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const bookId = location.pathname.split("/")[2];

    useEffect(() => {
        // fetch the existing book by id and fill the form
        const fetchBook = async () => {
            try {
                const res = await axios.get("http://localhost:8800/books/" + bookId);
                // if API returns array or object, handle both:
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                if (data) {
                    setBook({
                        title: data.title || "",
                        desc: data.desc || "",
                        price: data.price !== undefined ? data.price : "",
                        cover: data.cover || "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            // convert price to number if it's not empty
            const payload = {
                ...book,
                price: book.price === "" ? null : Number(book.price),
            };
            await axios.put("http://localhost:8800/books/" + bookId, payload);
            navigate("/");
        } catch (err) {
            console.log("Update failed:", err);
        }
    };

    if (loading) return <div className="form"><h2>Loading...</h2></div>;

    return (
        <div className="form">
            <h1>Update book</h1>
            <input
                type="text"
                placeholder="title"
                onChange={handleChange}
                name="title"
                value={book.title}
            />
            <input
                type="text"
                placeholder="decs"
                onChange={handleChange}
                name="desc"
                value={book.desc}
            />
            <input
                type="number"
                placeholder="price"
                onChange={handleChange}
                name="price"
                value={book.price}
            />
            <input
                type="text"
                placeholder="cover"
                onChange={handleChange}
                name="cover"
                value={book.cover}
            />
            <button className="formButton" onClick={handleClick}>
                Update
            </button>
        </div>
    );
};

export default Update;
