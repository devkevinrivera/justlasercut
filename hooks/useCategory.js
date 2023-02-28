import axios from "axios";
import { useState , useCallback , useEffect } from "react";

export const useCategory = () => {
	const [categorySelected,setCategorySelected] = useState([]);

	const getCategoryItem = useCallback(async (id) => {
		const { data : { steps }} = await axios('/api/material-category');
		setCategorySelected(steps);
	},[]);
	
	return {
		categorySelected,
		getCategoryItem
	}
}