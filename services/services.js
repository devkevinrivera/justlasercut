import axios from "axios";

export const getServices = async () => {
    try {
      const fetch = await axios(`/api/services`);
      const { data : { services }} = fetch;
      return services;
    } catch (error) {
      console.error(`Error al obtenes ficheros: ${error}`)
    };
}