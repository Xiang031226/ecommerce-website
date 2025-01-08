import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Rating from "@mui/material/Rating";
import "../css/ProductDetail.css";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const { id } = useParams(); // Get product ID from the URL
  const navigate = useNavigate(); // To navigate to previous page

  // Retrieve cached products and find the specific product by ID
  const [product] = useState(() => {
    const cachedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    return cachedProducts.find((prod) => prod.id === parseInt(id));
  });


  // Render product details
  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowBackIcon className="back-button-icon" />
      </button>

      <div className="product-details">
        <div className="product-img">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-details-box">
          <h1 className="product-details-title">{product.title}</h1>
          <p className="product-details-description">{product.description}</p>
          <p className="product-details-price">Price: RM {product.price}</p>
          <div className="product-details-rating">
            <Rating
              defaultValue={product.rating.rate}
              precision={0.5}
              readOnly
            />
            <span className="rating-count">
              {" "}
              ({product.rating.count} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
