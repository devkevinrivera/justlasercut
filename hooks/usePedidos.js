import axios from "axios";
import { useState, useEffect , useCallback } from "react";

export const usePedidos = () => {
	const [list,setList] = useState([]);
	const [materialDelivery,setMaterial] = useState({});

	const getMaterial = useCallback(async (idMaterial) => {
		const { data : { result }} = await axios.get('/api/materials');
		const material = result.find(item => item.id === idMaterial);

		setMaterial(material);
	},[])
	
	const getMaterialList = async () => {
		const { data } = await axios.get(`/api/pedidos`);
		setList(data);
	}

	const getListPedidos = useCallback(async () => {
		const { data } = await axios.get(`/api/pedidos`);
		setList(data);
	},[]);

	const validatePedido = useCallback(async (item) => {
		const { data } = await axios.post(`/api/verification`,{
			...item
		});
	},[]);
	
	const completePedido = useCallback(async (id) => {
		const { data } = await axios.put(`/api/verification`,{
			id
		});
		await getMaterialList();
	},[]);
	

	return {
		list,
		materialDelivery,
		getListPedidos,
		getMaterial,
		validatePedido,
		completePedido
	}
}