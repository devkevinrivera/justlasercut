import { useState , useEffect, useCallback } from "react";
import axios from "axios";
export const useMaterial = () => {
	const [list,setList] = useState();

	const getMaterialList = useCallback(async () => {
		const { data: { result } } = await axios('api/materials');

		setList(result);
	},[]);

	return {
		list,
		getMaterialList
	}
}