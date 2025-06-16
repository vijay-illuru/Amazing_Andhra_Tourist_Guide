import React from "react";
import { Container, Row, Col } from "reactstrap";
import OfferCard from "./OfferCard";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";

const servicesData = [
  {
    imgUrl: <GiPathDistance className="service-icon" />,
    title: "Curated Tours",
    desc: "Handpicked travel packages that cover iconic landmarks and hidden gems of Andhra Pradesh.",
  },
  {
    imgUrl: <MdOutlineTravelExplore className="service-icon" />,
    title: "Travel Planning Tools",
    desc: "Plan your journey effortlessly based on location, distance, and group size.",
  },
  {
    imgUrl: <FaPhotoVideo className="service-icon" />,
    title: "Visual Experiences",
    desc: "Stunning visuals and videos that bring your travel inspiration to life.",
  },
  {
    imgUrl: <AiFillStar className="service-icon" />,
    title: "Reviews & Ratings",
    desc: "See what fellow travelers are saying and make the best choice for your trip.",
  },
];

const ServiceList = () => {
  return (
    <section className="services-section">
      <Container>
        <Row className="justify-content-center">
          {servicesData.map((item, index) => (
            <Col lg="3" md="6" sm="12" className="mb-4 d-flex" key={index}>
              <OfferCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceList;
