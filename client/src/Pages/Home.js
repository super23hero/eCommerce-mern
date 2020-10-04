import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import * as productAction from "../Actions/productAction";
import Product from "../Components/Product/Product";
import Filter from "../Components/Filter/Filter";

const Home = () => {
  const [sort, setSort] = useState([]);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [ltORgt, setLtORgt] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);

  const productData = useSelector((state) => state.productList);

  const { loading, products, count, error, success } = productData;

  const queryParams = new URLSearchParams(window.location.search);
  const searchProductKey = queryParams.get("search")
    ? queryParams.get("search").trim()
    : "";

  const dispatch = useDispatch();

  useEffect(() => {
    fetchProductList();
  }, [dispatch, searchProductKey, sort, category]);

  const fetchProductList = () => {
    dispatch(
      productAction.listProducts(
        searchProductKey,
        sort,
        category,
        priceRange,
        initialLoading,
        ltORgt
      )
    );
  };

  useEffect(() => {
    if (success && initialLoading) {
      setInitialLoading(false);
    }
  }, [dispatch, success]);

  const handleSort = (value) => {
    sort.includes(value)
      ? setSort(sort.filter((s) => s !== value))
      : setSort((sort) => sort.concat(value));
  };

  const handlePriceRange = () => {
    if (priceRange === "" || ltORgt === "") {
      return;
    }
    fetchProductList();
  };
  return (
    <>
      {searchProductKey ? (
        <>
          <Link to="/" className="btn btn-light">
            Go Back
          </Link>
          <h1>
            Search Products for {searchProductKey}({count})
          </h1>
        </>
      ) : (
        <div class="clearfix">
          <span class="float-left">
            <h1>Latest Products({count})</h1>
          </span>
          <span class="float-right">
            {" "}
            <Filter
              sort={sort}
              handleSort={handleSort}
              setCategory={setCategory}
              setPriceRange={setPriceRange}
              setLtORgt={setLtORgt}
              ltORgt={ltORgt}
              handlePriceRange={handlePriceRange}
            />
          </span>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : // <Loader />
      error ? (
        <p>{error}</p>
      ) : (
        // <Message variant='danger'>{error}</Message>
        <>
          {products.length === 0 && <h4>No Products</h4>}
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};
export default Home;