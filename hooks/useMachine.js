import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useMachine = () => {

	const [list,setList] = useState();
	
	useEffect(() => {
		getList();
	},[]);
	
	const getList = async () => {
		const { data: { lista } } = await axios(`/api/machines`);
		setList(lista)
	}

	const getAllMachines = useCallback(async () => {
		const { data: { lista } } = await axios(`/api/machines`);
		setList(lista)
	},[]);

	const editMachine = async (values) => {
		const response = await axios.put(`/api/machines`, {
			...values
		});
	};
	
	const deleteMachine = async (idMachine) => {
		const response = await axios.delete(`/api/machines`, {
			params: {
				idMachine: idMachine
			}
		});
		getList();
	};

	const createMachine = async (machineInfo) => {
		await axios.post('/api/machines' , {
			...machineInfo
		});
		
	}
	
	return {	
		list,
		createMachine,
		editMachine,
		getAllMachines,
		deleteMachine
	}
}