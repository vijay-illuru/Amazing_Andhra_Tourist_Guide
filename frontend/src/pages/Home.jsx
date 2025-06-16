import React from "react";

import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import tirupathi from "../assets/images/Tirupathi-temple3.webp";
import heroImg02 from "../assets/images/hero-img02.jpg";
import worldImg from "../assets/images/world.png";
import vizagVideo from "../assets/images/vizag_video.mp4";
import Subtitle from "./../shared/Subtitle";
// import experienceImg from "../assets/images/experience.png";

import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedToursList from "../components/Featured-tours/FeaturedToursList";
import MasonryImagesGallery from "../components/Image-gallery/MasonryImagesGallery";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="6">
              <div className="hero__content">
                <div className="hero_subtitle d-flex align-items-center mb-3">
                  <Subtitle subtitle={"Know before You Go"} />
                  <img
                    src={worldImg}
                    alt=""
                    style={{ width: 40, marginLeft: 10 }}
                  />
                </div>
                <h1 className="mb-3">
                  Traveling opens the door to creating{" "}
                  <span className="highlight">memories</span>
                </h1>
                <p className="lead text-muted">
                  Discover the hidden gems of Andhra Pradesh — from serene
                  beaches to ancient temples, from scenic hills to vibrant
                  culture. Your journey to explore, connect, and cherish starts
                  here.
                </p>
              </div>
            </Col>
            <Col lg="2" className="text-center">
              <div className="hero__img-box mb-3">
                <img src={tirupathi} alt="" />
              </div>
            </Col>
            <Col lg="2" className="text-center">
              <div className="hero__img-box hero__video-box mt-4 mb-3">
                <video
                  src={vizagVideo}
                  alt=""
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              </div>
            </Col>
            <Col lg="2" className="text-center">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>

      {/* What We Offer Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col
              lg="5"
              className="mb-4 mb-lg-0 d-flex flex-column justify-content-center"
            >
              <h5 className="services__subtitle mb-2">What We Offer</h5>
              <h2 className="services__title mb-4">Our Best Services</h2>
              <p className="text-muted">
                From curated tours to personalized recommendations, we ensure
                your journey is seamless and memorable.
              </p>
            </Col>
            <Col lg="7" className="d-flex flex-column gap-4">
              <ServiceList />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Tours Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title">Our Featured Tours</h2>
            </Col>
            <FeaturedToursList />
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-4">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Check our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
