import React from "react";
import { useRouter } from "next/router";
import PageBanner from "../components/PageBanner";
import MaterialGit from "../components/MaterialGit/MaterialGit";
import axios from "axios";
import { BASE_URL } from "../constants/config";

const languages = {
  en: require('../locale/en/commons.json'),
  es: require('../locale/es/commons.json'),
}

export async function getServerSideProps(context) {
  const res = await axios(`${BASE_URL}/api/materials`)
  if (!res) {
    return {
      notFound: true,
    }
  }
  return {
    props: { servicesData: res.data }, // will be passed to the page component as props
  }
}

export default function Materials({ servicesData }) {
  const router = useRouter();
  const title = 'Lo que necesitas es amor. Y contrachapado, que quema doradito.';
  return (
    <>
      <PageBanner title={title} />
      <MaterialGit list={servicesData} />
    </>
  );
}
