import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import "../css/ListingPage.css";

function ListingPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch product categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if product data is already cached
        const cachedProducts = localStorage.getItem("products");
        if (cachedProducts) {
          // Use cached product data if available
          const data = JSON.parse(cachedProducts);
          setProducts(data);
          setFilteredProducts(data);

          const uniqueCategories = [
            ...new Set(data.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          // Fetch product data if not cached
          const response = await fetch("/products");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();

          setProducts(data);
          setFilteredProducts(data); // Initialize filtered products to all products
          localStorage.setItem("products", JSON.stringify(data)); // Cache the product data

          // Extract unique categories from the products
          const uniqueCategories = [
            ...new Set(data.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle category selection
  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);

    // Filter products based on selected category
    if (selectedCategory === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="container">
      {/* Category Filter Dropdown */}
      <Box className="filter-box">
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Category"
            onChange={handleChange}
          >
            {/* Default option to show all products */}
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>

            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Product Listing */}
      <div className="listing-page">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.image}
                alt={product.title}
              />
            </div>
            <div className="product-row">
              <div className="product-name">{product.title}</div>
              <div className="product-price">RM {product.price}</div>
            </div>
            <div className="rating">
              <Rating
                defaultValue={product.rating.rate}
                precision={0.5}
                readOnly
              />
              <span className="rating-count">({product.rating.count})</span>
            </div>
            <div className="view-button">
              <Link to={`/product/${product.id}`} className="view-details-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingPage;
