import { useState , useEffect, useCallback } from "react";
import axios from "axios";

export const useTermination = () => {

	const [list,setList] = useState();

	const createTermination = useCallback(async (termination) => {
		await axios.post(`/api/terminations`,{
			...termination
		})
	},[]);
	
	const getTermination = useCallback(async () => {
		const { data : { list } } = await axios(`/api/terminations`)
		setList(list);
	},[]);

	
	const deleteTermination = useCallback(async (tag) => {
		const res = await axios.delete(`/api/terminations`,{
			params: {
				idTag: tag
			}
		});
	},[]);
	
	return {
		list,
		createTermination,
		getTermination,
		deleteTermination
	}
}