import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, singOut, getSession, signOut } from "next-auth/react";
import Banner from "../components/Banner";
import Steps from "../components/Steps/Steps";
import Services from "../components/Services";
import Reviews from "../components/Reviews/Reviews";
import ContactForm from "../components/ContactForm/ContactForm";
import axios from "axios";
import { BASE_URL } from "../constants/config";
import ButtonTop from "../components/ButtonTop/ButtonTop";
import Advantages from "../components/Advantages/Advantages";
import Technologies from "../components/Technologies/Technologies";
import Aplications from "../components/Aplications/Aplications";
import Offers from "../components/Offers";

const languages = {
  en: require('../locale/en/commons.json'),
  es: require('../locale/es/commons.json'),
}

function Home(props) {
  const { banner = [], promotions = [], aplications = [],technologies = [], steps = [], reviews = [], services = [], advantages = [] } = props;
  const [user, setUser] = useState();
  const { locale } = useRouter();
  const t = languages[locale];

  useEffect(() => {
    const session = async (req, res) => {
      const user = await getSession({ req });
      if (user?.user) {
        setUser(user.user);
      } else {
        setUser(false);
      }
    }
    session();
  }, [])
  return (
    <div className="">
      <Banner info={banner} />
      <Steps t={t} steps={steps.filter(step => step.language === locale)} />
      <Advantages t={t} advantages={advantages} />
      <Technologies t={t} list={technologies.filter(review => review.language === locale)}/>
      <Aplications t={t} list={aplications.filter(review => review.language === locale)} />
      <Offers t={t} list={promotions.filter(review => review.language === locale)}/>
      <Services t={t} list={services.filter(step => step.language === locale)} />
      <Reviews t={t} list={reviews.filter(review => review.language === locale)} />
      <ContactForm t={t} />
      <ButtonTop />
    </div>
  );
}

export async function getServerSideProps() {
  let reviews = [];
  let steps = [];
  let bannerSend = {};
  let advantagesSend = [];
  let technologiesGallery = [];
  let aplicationsList = [];
  let promotionsList = [];
  const data = await axios(`${BASE_URL}/api/steps`);
  const listReviews = await axios(`${BASE_URL}/api/reviews`);
  const listServices = await axios(`${BASE_URL}/api/resources`);
  const banner = await axios(`${BASE_URL}/api/banner`);
  const advantages = await axios(`${BASE_URL}/api/advantages`);
  const gallery = await axios(`${BASE_URL}/api/technologies`);
  const aplications = await axios(`${BASE_URL}/api/aplications`);
  const promotions = await axios(`${BASE_URL}/api/promotions`);

  advantagesSend = advantages.data.steps;
  const { data: { list } } = listReviews;
  reviews = list;
  steps = data.data.steps
  technologiesGallery = gallery.data.steps;
  bannerSend = banner.data.response;
  aplicationsList = aplications.data.steps;
  promotionsList = promotions.data.resources
  return {
    props: {
      reviews: list,
      steps: data.data.steps,
      services: listServices.data.resources,
      banner: bannerSend,
      advantages: advantagesSend,
      technologies: technologiesGallery,
      aplications: aplicationsList,
      promotions: promotionsList
    }
  }
}


export default Home

