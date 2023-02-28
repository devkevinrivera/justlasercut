import React, { useState, useEffect , useRef } from 'react';
import { Button, Header, Divider, Image, Modal, Form, Table, Input, Checkbox, Icon} from 'semantic-ui-react'
import { useForm } from "react-hook-form";
import { useMachine } from "../../../hooks/useMachine";
import { createMaterial } from "../../../services/material";
import { useTag } from "../../../hooks/useTags";
import { useTermination } from "../../../hooks/useTermination";

import axios from "axios";
const { v4: uuidv4 } = require('uuid');

const CreationMaterialModal = () => {
    const [open, setOpen] = React.useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const {
        list : listTags,
		createTag,
		getTags,
		deleteTag
    } = useTag();
    
    const [machines,setMachines] = useState([]);
    const [listFinishes,setListFinishes] = useState([]);
    const [recommendUses,setRecommendUses] = useState([]);
    const [plateSizes, setPlateSizes] = useState([]);
    const [weightList, setWeightList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [subcategoryList, setSubcategoryList] = useState([]);

    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [stock, setStock] = useState();

    const [filename, setFilename] = useState();
    const [media, setMedia] = useState();

    const { list } = useMachine();
    const { list : listTerminations, getTermination } = useTermination();

    console.log(list)
    
    useEffect(async () => {
        getTags();
        getTermination();

        try {
            const { data: { steps } } = await axios(`/api/material-category`);
            const subcategory = await axios(`/api/material-subcategory`);
            setSubcategoryList(subcategory.data.steps);
            setCategoryList(steps)
        } catch (err) {
            console.error(`Error al obtener lista de categorias: ${err}`)
        }
    }, []);

    const handlerSelectCategory = (id) => {
        const handler = async () => {
            const subcategory = await axios(`/api/material-subcategory`);
            setSubcategoryList(subcategory?.data?.steps.filter(category => category.subcategory.categoryId === id));
        };
        handler();
    };

    const onSubmit = data => {
        try {
            const handler = async () => {
                const id = uuidv4();
                const extension = filename?.split('.').pop();
                const post = await createMaterial({
                    ...data,
                    plateSizes,
                    weightList,
                    machines,
                    id: id,
                    recommendUses: recommendUses,
                    terminations: listFinishes,
                    image: `${id}.${extension}`
                });
                if (media) {
                    const data = new FormData();
                    data.append('file', media);
                    await axios.post('/api/multimedia', data, {
                        params: {
                            id: id
                        }
                    });
                }
            };
            handler();
            setOpen(false)
        } catch (err) {
            setOpen(false)
        }
    };

    const handlerPlateSizes = (typeOperation, id = null) => {
        if (typeOperation === true) {
            setPlateSizes([...plateSizes, { id: uuidv4(), width: width, height: height, stock: stock }]);
            reset();
            return;
        }
        setPlateSizes(plateSizes.filter(plate => plate.id !== id));
        reset();
    };

    const handlerWeightSizes = (typeOperation, id = null) => {
        if (typeOperation === true) {
            setWeightList([...weightList, { id: uuidv4(), weight: weight }]);
            reset();
            return;
        }
        setWeightList(weightList.filter(plate => plate.id !== id));
    }

    const reset = () => {
        setWidth('');
        setHeight('');
        setStock('')
    };

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='fullscreen'
            trigger={<Button primary>+ Añadir material</Button>}
        >
            <Modal.Header></Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <Header>Formulario de creación de material</Header>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between' }}>
                                <div style={{ width: '48%' }}>
                                    <label>Nombre (ES)</label>
                                    <input {...register("title.es", { required: true })} type="text" />
                                    {errors?.title?.es && <span>El campo es obligatorio</span>}
                                </div>
                                <div style={{ width: '48%' }}>
                                    <label>Nombre (EN)</label>
                                    <input {...register("title.en", { required: true })} type="text" />
                                    {errors?.title?.en && <span>El campo es obligatorio</span>}
                                </div>
                            </div>
                            <span>Seleccione la imagen del material:</span>
                            <input
                                name="mediaManual"
                                style={{ marginBottom: '1rem' }}
                                onChange={ev => {
                                    setFilename(ev.target.files[0].name)
                                    setMedia(ev.target.files[0])
                                }
                                }
                                type="file"
                            />
                            <span>Seleccione la categoria:</span>
                            <select style={{ marginBottom: '1rem' }} {...register("materialCategory", {
                                onChange: (ev) => handlerSelectCategory(ev.target.value)
                            })}>
                                {
                                    categoryList.map(({ category, id }) => (
                                        <option value={id} selected>{category?.name?.es}</option>
                                    ))
                                }
                            </select>
                            <span>Seleccione la subcategoria:</span>
                            <select style={{ marginBottom: '1rem' }} {...register("materialSubCategory", { required: true })}>
                                {
                                    subcategoryList.map(({ subcategory, id }) => (
                                        <option value={id} selected>{subcategory?.name?.es}</option>
                                    ))
                                }
                            </select>
                            <span>Seleccione las caras del material:</span>
                            <select style={{ marginBottom: '1rem' }} {...register("surfacePainting", { required: true })}>
                                <option value="value2" selected>1</option>
                                <option value="value2" selected>2</option>
                                <option value="value2" selected>Ninguno</option>
                            </select>
                            <section className="material-machines">
                                <div style={{ border: '1px solid gray', padding: '.5rem' }}>
                                    <Header> Seleccione las maquinas en las que esta disponible:</Header>
                                    <Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>Titulo</Table.HeaderCell>
												<Table.HeaderCell>Acciones</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
                                        {
                                            list?.map((item) => {
                                                let isAdd = machines.find((machine) => machine.idMachine === item.idMachine);
                                                return  (
                                                    <Table.Body key={item._id}>
                                                        <Table.Cell>{item.name}</Table.Cell>
                                                        <Table.Cell>
                                                            <Input type="checkbox" onClick={(ev) => {
                                                                ev.preventDefault();
                                                                console.log(item.minutePrice)
                                                                setMachines([...machines , {
                                                                    ...item,
                                                                    priceMinute: parseInt(item.minutePrice),                                                                }])
                                                            }} />
                                                            <Input type="currency" 
                                                                id={`machine-${item.idMachine}`} 
                                                                placeholder='Precio por min.'
                                                            />
                                                            <Button onClick={(ev) => {
                                                                ev.preventDefault();
                                                                setMachines([...machines , {
                                                                    ...item,
                                                                    priceMinute: document.getElementById(`machine-${item.idMachine}`).value
                                                                }])
                                                            }}
                                                                primary
                                                            >
                                                                <Icon name="plus" />
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Body>
                                                )
                                            })
                                        }
                                    </Table>

                                    <Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>Titulo</Table.HeaderCell>
												<Table.HeaderCell>Precio por minuto</Table.HeaderCell>
												<Table.HeaderCell>Acciones</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
                                        {
                                            machines?.map((item) => {
                                                return  (
                                                    <Table.Body>
                                                        <Table.Cell>{item.name}</Table.Cell>
                                                        <Table.Cell>
                                                            {item?.priceMinute} €
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    setMachines(
                                                                        machines.filter(({ idMachine }) => idMachine !== item.idMachine)
                                                                    )
                                                                }} 
                                                                color="red">
                                                                <Icon name="trash" />
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Body>
                                                )
                                            })
                                        }
                                    </Table>
                                </div>
                            </section>
                            <section>
                                <div style={{ border: '1px solid gray', padding: '.5rem', marginTop: '1rem' }}>
                                    <Header>Seleccione los acabados</Header>
                                    <Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>Titulo</Table.HeaderCell>
												<Table.HeaderCell>Acciones</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
                                        <Table.Body>
                                            {
                                                listTerminations?.map(termination => (
                                                    <Table.Row>
                                                        <Table.Cell>{termination.titleEs}</Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    setListFinishes([ ...listFinishes, termination ])
                                                                }} 
                                                                color="blue">
                                                                <Icon name="plus" />
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))
                                            }
                                        </Table.Body>
                                    </Table>
                                    
                                    <Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>Titulo</Table.HeaderCell>
												<Table.HeaderCell>Acciones</Table.HeaderCell>
											</Table.Row>
										</Table.Header>

                                        <Table.Body>
                                            {
                                                listFinishes?.map(termination => (
                                                    <Table.Row>
                                                        <Table.Cell>{termination.titleEs}</Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    setListFinishes(
                                                                        listFinishes.filter(({ idTerminations }) => idTerminations !== termination.idTerminations)
                                                                    )
                                                                }} 
                                                                color="red">
                                                                <Icon name="trash" />
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))
                                            }
                                        </Table.Body>
                                    </Table>
                                </div>
                            </section>
                            <section>
                                <div style={{ border: '1px solid gray', padding: '.5rem', marginTop: '1rem' }}>
                                    <div>
                                        <p>Seleccione los usos recomendados:</p>

                                        <div>
                                            {
                                                listTags?.map((tag) => (
                                                    <Button color="blue" onClick={(ev) => {
                                                        ev.preventDefault();
                                                        setRecommendUses([...recommendUses, {
                                                            ...tag
                                                        }])
                                                    }}>
                                                        {tag.titleEs}
                                                    </Button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>Titulo</Table.HeaderCell>
												<Table.HeaderCell></Table.HeaderCell>
											</Table.Row>
										</Table.Header>
                                        <Table.Body>
                                            {
                                                recommendUses.map((item) => (
                                                    <Table.Row>
                                                        <Table.Cell>{item.titleEs}</Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    setRecommendUses(recommendUses.filter((itemTag) => itemTag.idTag !== item.idTag))
                                                                }}  
                                                                color="red" >
                                                                <Icon name="trash"/>
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))
                                            }
                                        </Table.Body>
                                    </Table>
                                </div>
                            </section>
                            <span>Configure los tamaños de las planchas:</span>
                            <div style={{ border: '1px solid gray', padding: '.5rem' }}>
                                <div style={{ display: 'flex' }}>
                                    <input type="number" placeholder="Ancho" value={width} onChange={(ev) => setWidth(ev.target.value)} />
                                    <input type="number" placeholder="Alto" value={height} onChange={(ev) => setHeight(ev.target.value)} />
                                    <input type="number" placeholder="Stock" value={stock} onChange={(ev) => setStock(ev.target.value)} />
                                    <Button content='+' primary onClick={(ev) => {
                                        ev.preventDefault();
                                        handlerPlateSizes(true)
                                    }} />
                                </div>
                                <p>Lista de tamaños:</p>
                                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                                    {
                                        plateSizes.map(({ width, height, id, stock }) => (
                                            <div style={{ display: 'flex', marginRight: '.5rem', border: '1px solid gray', width: 'fit-content', padding: '.7rem' }}>
                                                <p style={{ marginRight: '1rem' }}>- {width}x{height}mm - Stock: {stock}</p>
                                                <Button color='red' content="-" size="tiny" onClick={(e) => {
                                                    e.preventDefault();
                                                    handlerPlateSizes(false, id)
                                                }} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            
                            <div style={{ border: '1px solid gray', padding: '.5rem', marginTop: '1rem' }}>
                                <span>Configure los grosores de las planchas:</span>
                                <div style={{ display: 'flex' }}>
                                    <input type="number" placeholder="Ancho" value={weight} onChange={(ev) => setWeight(ev.target.value)} />
                                    <Button content='+' primary onClick={(ev) => {
                                        ev.preventDefault();
                                        handlerWeightSizes(true)
                                    }} />
                                </div>
                                <p>Lista de grosores:</p>
                                <div style={{ display: 'flex' }}>
                                    {
                                        weightList.map(({ weight, id }) => (
                                            <div style={{ display: 'flex', marginRight: '.5rem', border: '1px solid gray', width: 'fit-content', padding: '.7rem' }}>
                                                <p style={{ marginRight: '1rem' }}>- {weight}mm</p>
                                                <Button color='red' content="-" onClick={(e) => {
                                                    e.preventDefault();
                                                    handlerWeightSizes(false, id)
                                                }} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div style={{ display: 'flex', border: '1px solid gray', padding: '1rem', marginTop: '1rem' }}>
                                <div>
                                    Corte interior:
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.insideCut.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.insideCut.power")} />
                                    </div>
                                </div>
                                <div>
                                    Corte exterior:
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.outsideCut.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.outsideCut.power")} />
                                    </div>
                                </div>
                                <Divider />
                                <div>
                                    Grabado linea(Bajo):
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.lowEngraving.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.lowEngraving.power")} />
                                    </div>
                                </div>
                                <div>
                                    Grabado linea(Medio):
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.mediumEngraving.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.mediumEngraving.power")} />
                                    </div>
                                </div>
                                <div>
                                    Grabado linea(Alto):
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.hightEngraving.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.hightEngraving.power")} />
                                    </div>
                                </div>
                                <Divider />
                                <div>
                                    Grabado Relleno (Bajo):
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.lowFillEngraving.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.lowFillEngraving.power")} />
                                        <input type="number" placeholder="Resolución" {...register("cuttingReport.lowFillEngraving.resolution")} />
                                    </div>
                                </div>
                                <div>
                                    Grabado Relleno (Medio):
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.mediumFillEngraving.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.mediumFillEngraving.power")} />
                                        <input type="number" placeholder="Resolución" {...register("cuttingReport.mediumFillEngraving.resolution")} />
                                    </div>
                                </div>
                                <div>
                                    Grabado Relleno (Alto):
                                    <div>
                                        <input type="number" placeholder="Velocidad" {...register("cuttingReport.hightFillEngraving.velocity")} />
                                        <input type="number" placeholder="Potencia" {...register("cuttingReport.hightFillEngraving.power")} />
                                        <input type="number" placeholder="Resolución" {...register("cuttingReport.lowFillEngraving.resolution")} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', border: '1px solid gray', padding: '1rem', marginTop: '1rem' }}>
                                <label style={{ width: '50%' }}>
                                    Precio por minuto maquina grande:
                                    <input type="number" {...register("prices.priceMinuteLargeMachine")} />
                                </label>
                                <label style={{ width: '50%' }}>
                                    Precio por minuto maquina pequeña:
                                    <input type="number" {...register("prices.priceMinuteSmallMachine")} />
                                </label>
                                <label>
                                    Precio minimo maquina grande:
                                    <input type="number" {...register("prices.largeMinimumPrice")} />
                                </label>
                                <label>
                                    Precio minimo maquina pequeña:
                                    <input type="number" {...register("prices.smallMinimumPrice")} />
                                </label>
                                <label>
                                    Precio m2 revestimiento
                                    <input type="number" {...register("prices.priceM2backing")} />
                                </label>
                                <label>
                                    Precio m2 de pintura:
                                    <input type="number" {...register("prices.priceM2painting")} />
                                </label>
                                <label>
                                    Precio minimo por pintura:
                                    <input type="number" {...register("prices.minimumPricePaint")} />
                                </label>
                            </div>
                            <input style={{ backgroundColor: 'blue', color: 'white', width: '120px', height: '40px', marginTop: '1rem' }} type="submit" />
                        </div>
                    </Form>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
};

export default CreationMaterialModal;