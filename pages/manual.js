import React from "react";
import { useRouter } from "next/router";
import DropDownJust from "../components/DropDownJust";
import axios from "axios";
import { BASE_URL } from "../constants/config";

const languages = {
  en: require('../locale/en/commons.json'),
  es: require('../locale/es/commons.json'),
}

export async function getServerSideProps(context) {
  const res = await axios(`${BASE_URL}api/manual`, {
    params: {
      language: 'all'
    }
  })
  if (!res) {
    return {
      notFound: true,
    }
  }
  return {
    props: { manualData: res.data }, // will be passed to the page component as props
  }
}

export default function Manual({ manualData = [] }) {
  const router = useRouter();
  const { locale } = router;
  const t = languages[locale];

  return (
    <>
      <DropDownJust list={manualData.steps.filter(({ language }) => language === locale)} title={t.manual} folder={'manual'} />
    </>
  );
}
