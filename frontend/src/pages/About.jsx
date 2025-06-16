import React from "react";
import { Container, Row, Col } from "reactstrap";
import Subtitle from "./../shared/Subtitle";
import "./../styles/about.css";
import worldImg from "../assets/images/world.png";
import logo1 from "./../assets/images/hero-img01.jpg";
import visionImg from "./../assets/images/tour.jpg";
import whyImg from "./../assets/images/why.png";
import OfferList from "../services/OfferList";

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="about py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="6" className="mb-4 mb-lg-0">
              <div className="hero__content">
                <div className="hero_subtitle d-flex align-items-center mb-3">
                  <Subtitle subtitle={"About Us"} />
                  <img src={worldImg} alt="globe icon" style={{ width: 40, marginLeft: 10 }} />
                </div>
                <h1 className="mb-3">
                  Discover Andhra Pradesh Like Never <span className="highlight">Before</span>
                </h1>
                <p className="lead text-muted">
                  At Amazing Andhra, we believe travel is more than just visiting places — it's about experiencing the culture, the people, the food, and the soul of a destination. Our mission is to help you explore the true essence of Andhra Pradesh, one unforgettable journey at a time.
                </p>
              </div>
            </Col>
            <Col lg="6" className="text-center">
              <img
                src={logo1}
                alt="Andhra tourism"
                className="rounded shadow-lg img-fluid"
                style={{ maxHeight: 350, objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* What We Offer Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg="4" className="mb-4 mb-lg-0">
              <h5 className="services__subtitle mb-2">What We Offer</h5>
              <h2 className="services__title mb-4">Our Best Services</h2>
              <p className="text-muted">
                From curated tours to personalized recommendations, we ensure your journey is seamless and memorable.
              </p>
            </Col>
            <Col lg="8">
              <OfferList />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why We Built This Platform Section */}
      <section className="about py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5 flex-column-reverse flex-lg-row">
            <Col lg="6">
              <Subtitle subtitle={"Why We Built This Platform"} />
              <p className="lead text-muted">
                Andhra Pradesh is a land of hidden gems — from ancient temples and coastal retreats to serene hill stations and rich heritage. Amazing Andhra was created to help travelers discover these treasures and experience the real magic of our state.
              </p>
            </Col>
            <Col lg="6" className="text-center">
              <img
                src={whyImg}
                alt="Why we built it"
                className="rounded shadow img-fluid"
                style={{ maxHeight: 300, objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Vision Section */}
      <section className="about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="6">
              <Subtitle subtitle={"Our Vision"} />
              <p className="lead text-muted">
                We aim to empower travelers to go beyond the usual tourist routes and uncover the soul of Andhra Pradesh through authentic experiences. Whether you're an adventurer, a heritage lover, or someone seeking peace — there's something here for everyone.
              </p>
            </Col>
            <Col lg="6" className="text-center">
              <img
                src={visionImg}
                alt="Our Vision"
                className="rounded shadow img-fluid"
                style={{ maxHeight: 300, objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;
