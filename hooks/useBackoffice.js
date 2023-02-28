import { useState , useEffect , useCallback } from "react";
import axios from "axios";
import { useRouter } from 'next/router';

export const useBackoffice = () => {
	const history = useRouter()
	const [totalGanancias,setTotalEntries] = useState();;
	const [totalPedidos,setTotalSells] = useState();
	const [visitsToday,setVisitsToday] = useState();
	const [totalMaterials,setTotalMaterials] = useState();

	const getTotalPedidos =  async () => {
		const { data : { list }} = await axios(`/api/pedidos`);
		const getVerified = list.filter(item => item.verified );
		let subtotal = 0;

		getVerified.forEach(item => {
			subtotal += item.calculoPrecios.subtotal;
		});
		setTotalSells(list?.length)
		setTotalEntries(subtotal)
	};

	const validateSession = async () => {
		const { data : { valid }} = await axios.post(`/api/token`,{
			token: localStorage.getItem('admin')
		});
		
		if(!valid){
			history.push('/');
		}
	};
	
	const getTotalMaterials = async () => {
		const { data : { result }} = await axios('api/materials');
		setTotalMaterials(result?.length)
	}
	
	return {
		getTotalPedidos,
		getTotalMaterials,
		validateSession,
		totalGanancias,
		totalPedidos,
		totalMaterials
	}
}