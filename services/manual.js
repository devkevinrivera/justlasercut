import axios from "axios";

export const getManualSteps = async ({ language }) => {
    try {
      const fetch = await axios(`/api/manual`);
      const { data : { steps }} = fetch;
      return steps;
    } catch (error) {
      console.error(`Error al obtenes ficheros: ${error}`)
    };
}