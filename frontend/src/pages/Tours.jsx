import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";

import "../styles/tour.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import { Container, Row, Col } from "reactstrap";

import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  const {
    data: tours,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours?page=${page}`);
  const { data: tourCount } = useFetch(`${BASE_URL}/tours/search/getTourCount`);

  useEffect(() => {
    // Calculate page count from total tours
    if (tourCount && tourCount > 0) {
      const pages = Math.ceil(tourCount / 8);
      setPageCount(pages);
    } else if (tours && tours.length > 0) {
      // If tourCount not loaded yet but we have tours, show at least 1 page
      // Or if exactly 8 tours, there might be more pages
      if (tours.length === 8) {
        setPageCount((prevPageCount) => Math.max(prevPageCount, 1));
      } else {
        setPageCount(1);
      }
    }
    window.scrollTo(0, 0);
  }, [page, tourCount, tours]);

  return (
    <>
      <CommonSection title={"All Tours"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          {loading && <h4 className="text-center pt-5">Loading.....</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              {tours && tours.length > 0 ? (
                <>
                  {tours.map((tour) => (
                    <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                      <TourCard tour={tour} />
                    </Col>
                  ))}
                </>
              ) : (
                !loading && (
                  <Col lg="12">
                    <h4 className="text-center pt-5">No tours found</h4>
                  </Col>
                )
              )}

              {/* Pagination - Show when there are tours */}
              {!loading && !error && tours && tours.length > 0 && pageCount >= 1 && (
                <Col lg="12" className="mt-5">
                  <div className="pagination d-flex align-items-center justify-content-center mb-4 gap-3">
                    {Array.from({ length: pageCount }, (_, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setPage(index);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={page === index ? "active__page" : ""}
                        style={{ cursor: 'pointer' }}
                      >
                        {index + 1}
                      </span>
                    ))}
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Container>
      </section>
      {/* <Newsletter /> */}
    </>
  );
};

export default Tours;
