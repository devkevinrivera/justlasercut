import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useTag = () => {
	const [list,setList] = useState([]);

	useEffect(() => {
		getTags();
	},[])
	
	const getTags = useCallback(async () => {
		const { data : { list } } = await axios(`/api/tags`);
		setList(list);
	},[]);

	const createTag = useCallback(async (tag) => {
		const res = await axios.post(`/api/tags`,{
			...tag
		});
	},[]);
	
	const deleteTag = useCallback(async (tag) => {
		const res = await axios.delete(`/api/tags`,{
			params: {
				idTag: tag
			}
		});
	},[]);

	return {
		list,
		createTag,
		getTags,
		deleteTag
	}
};