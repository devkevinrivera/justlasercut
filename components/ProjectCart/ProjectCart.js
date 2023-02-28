import axios from 'axios';
import React , { useEffect, useState } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { addExtra } from '../../redux/reducers/cartSlice';
import { extras } from '../../constants/extras';
import { deleteItem , checkMaterialClient, setMaterial, setGrosor, deleteExtra, modifyCopias,setPrice } from '../../redux/reducers/cartSlice';
import { Button, Popup, Checkbox, Grid, Modal, Header, Icon, Input, Select, Image, Search } from "semantic-ui-react";
import { useMaterial } from "../../hooks/useMaterial";

const ProjectCart = () => {
    //Obtener lista de proyectos subidos desde redux;
    const cart = useSelector(state => state.cart.items)

    return (
        <Grid columns={16} className='project-cart-view'>
            <Grid.Row>
                <Grid.Column width={16}>
                    {
                        !cart?.length && (
                            <div>
                                <p className='empty-message'>
                                    No tienes ningun proyecto pendiente. Crea uno aquí.
                                </p>
                            </div>
                        )   
                    }
                    {
                        cart.map(item => <ProjectItem item={item} />)
                    }
                    
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const ModalImageProject = ({ urlImage }) => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            open={open}
            size='fullscreen'
            trigger={<Image fluid src={urlImage} />}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Modal.Content>
                <Image src={urlImage} fluid />
            </Modal.Content>
        </Modal>
    )
}

const ProjectItem = ({ item }) => {
    const [show,setShow] = useState(true);
    const [categories,setCategories] = useState([]);
    const [materiales,setMateriales] = useState([]);
    const [anchos,setAnchos] = useState([]);
    const [copias,setCopias] = useState(item.copias || 0);

    const dispatch = useDispatch();
    const [products,setProducts] = useState([]);
    const [searchMaterial,setSearchMaterial] = useState([]);
    const { file } = item;
    const [categorySelected,setCategorySelected] = useState(false);
    const [productSelected,setProductSelected] = useState(false);
    const [weightSelected,setWeightSelected] = useState(false);

    const [priceTotal,setPriceTotal] = useState();
    const { list : materialList } = useMaterial();
    
    useEffect(() => {
        handlerPrice();
    },[productSelected,copias,item.extras])
    
    const getDetectedCapas = () => {
        let auxCapas = [] 
        file?.planchas?.forEach((plancha,aux) => {
            plancha.capas.forEach((capa) => {
                auxCapas.push(capa.type)
            });
        })
        let result = auxCapas.filter((item,index) => {
            return auxCapas.indexOf(item) === index
        })
        return result
    }   
    
    const getMateriales = async () => {
        try {
            const { data : { result }} = await axios(`/api/materials`);
            const categoryList = result.map(material => ({
                key: material.id,
                value: material.id,
                text: material.title.es,
                ...material
            }))
            setMateriales(categoryList);
            setProducts(categoryList);
        } catch (err) {
            console.error('Error al obtener materiales')
        }
    };
    
    const getCategories = async () => {
        try {
            const { data: { steps } } = await axios(`/api/material-category`);
            const materialList = steps.map((category) => ({
                key: category.id,
                value: category.id,
                text: category.category.name.es
            }))
            setCategories(materialList);
        } catch (err) {
            console.error('Error al obtener categirr')
        }
    };

    useEffect(() => {
        if (categorySelected !== false) {
            const filtered = materiales.filter(material => {
                return material.materialCategory === categorySelected
            });
            if (filtered.length) {
                setMateriales(filtered);
            } else {
                getMateriales();
            }
        } else {
            getCategories();
        }
    },[categorySelected]);

    useEffect(async () => {
        try {
            const { data : { result }} = await axios(`/api/materials`);
            const productSelect = result?.filter(material => material.id === productSelected)
            if (productSelect) {
                const product = productSelect[0];
                const { weightList } = product;
                const weights = weightList.map((ancho) => ({
                    key: ancho.id,
                    value: ancho.weight,
                    text: ancho.weight + ' mm'
                }));
                dispatch(setMaterial({
                    itemId: item.idProjectItem,
                    material: product.id
                }))
                setAnchos(weights);
            };
        } catch (err) {
            console.error('Error al obtener materiales')
        }
    },[productSelected]);
    
    useEffect(() => {
        dispatch(setGrosor({
            itemId: item.idProjectItem,
            weight: weightSelected
        }))
    },[weightSelected])
    
    const resRender = ({ text }) => (text);

    const deleteItemFromCart = () => {
        dispatch(deleteItem(item.idProjectItem))
    };
    
    const getColor = (capa = '') => {
        let color = '';
        if (capa.includes('exterior')) {
            color = '#FF0000'
        }
        if (capa.includes('interior')) {
            color = '#0000FF'
        }
        if (capa.includes('superficie')) {
            color = '#FF00FF'
        }
        if (capa.includes('Comentarios')) {
            color = '#999999'
        }

        return color;
    }

    useEffect(() => {
        getCategories();
        getMateriales();
    },[show]);
    
    const getNameMaterial = () => {
        const material = materiales.find((obj) => obj.id === item.material);
        return material?.text
    };

    const exportListadoExtraSeleccionado = () => {
        const element = (
            <div>
                <h4>Extras seleccionados</h4>
                {item.extras.map((extra) => (<p>- {extra.text}: <b>{extra.price}</b></p>))}
            </div>
        )
        return element;
    };
    
    const exportListadoErroresSeleccionado = () => {
        const element = (
            <div>
                <h4>Errores detectados</h4>
                <p style={{display: 'flex',}}>
                    <span style={{
                        marginRight: '30px',
                        minWidth: '170px'
                    }}>Grabado relleno cerrado</span>
                    <Icon name="x" color="red"/>
                 </p>
            </div>
        )
        return element;
    };

    const getMaterial = () => materiales.find(el => el.id === productSelected); 
    
    const getMaterialCutData = (cutType = '') => {
        const material = materiales.find(el => el.id === productSelected)
        //Provisional... se tendra que escoger el valor en base al type.
        return material?.cuttingReport?.outsideCut;
    }
    
    const calculateTimeCutting = (longitud, velocity) => {
        const TIME_MINUTE = 60;
        const cuttingTime = parseInt(longitud) / parseInt(velocity);

        return cuttingTime / TIME_MINUTE; 
    } 
    
    const handlerPrice = () => {
        const { file : { planchas = [] }} = item;
        let auxTotallyProject = 0;
        planchas?.map(({ capas }) => {
            capas?.map(({ longitud = '', type = '' }) => {
                const data = getMaterialCutData();
                if(data?.velocity) {
                    const minutesTotally = calculateTimeCutting(longitud, data?.velocity);

                    const { prices } = getMaterial();
                    auxTotallyProject += minutesTotally * parseInt(prices.priceMinuteSmallMachine); 
                }
            })
        });

        dispatch(setPrice({
            itemId: item.idProjectItem,
            total: (auxTotallyProject * parseInt(item.copias)) + calculateExtras()
        }))
    }

    const calculateExtras = () => {
        const { file : { planchas = [] }} = item;
        let total = 0;

        item.extras.map(extra => {
            total += parseInt(extra.price);
        })

        return (total * planchas.length) * item?.copias;
    };
    
    const getMaterialName = (id) => {
        const find = materialList?.find(material => material?.id === id);
        return find?.title?.es
    }
    
    return(
        <Grid columns={16} className='project-view'>
            <Grid.Row>
                <Grid.Column 
                    verticalAlign='center' 
                    computer={16} 
                    mobile={16} 
                    className='boton-plus-local project-view__actions'>
                    <div className="content">
                        <p className='price-span'>
                            Precio: <b>{item.total &&  (`${parseInt(item.total)} €`) }</b>
                        </p>
                        <Icon onClick={() => setShow(!show)} size="large" className="boton-plus" name='plus' />
                    </div>
                </Grid.Column>
                <Grid.Column computer={4} tablet={6} mobile={16}>
                    <div className='project-view__svg'>
                        {
                            file && (
                                <ModalImageProject urlImage={file.previsualization || file.file.previsualization} />
                            )
                        }
                    </div>
                </Grid.Column>
                <Grid.Column computer={10} tablet={10} mobile={16}>
                    <Grid columns={16}>
                        {
                            !show && (
                                <Grid.Row>
                                    <Grid.Column computer={8}>
                                        <p><b>Material:</b> {getNameMaterial()}</p>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <p>
                                            <b>Extras seleccionados:</b>
                                            <Popup content={
                                                exportListadoExtraSeleccionado()
                                            } trigger={<Icon color='blue' name='info circle' />} />
                                        </p>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <p><b>Cantidad de planchas: </b><span>{file?.planchas?.length}</span></p>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <p>
                                            <b>Errores en archivo:</b> 
                                            <Popup content={
                                                exportListadoErroresSeleccionado()
                                            } trigger={<Icon color='blue' name='info circle' />} />
                                        </p>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <p><b>Calidad de grabado relleno:</b> 0.1/1.5/0.2</p>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            show && (
                                <Grid.Row>
                                    <Grid.Column computer={16} mobile={16}>
                                        <h5 className='title-dashed'>Errores detectados: </h5>
                                        <section style={{ display: 'flex'}} className="errors-box">
                                            <div className="error-item">
                                                {
                                                    file.errorList.map(error => (
                                                        <p>
                                                            <span>
                                                                - {
                                                                    error.split('] -')[1]
                                                                }
                                                            </span>
                                                            <Icon
                                                                color="red" 
                                                                name="x" 
                                                                className="error-item__icon"/>
                                                        </p>
                                                    ))
                                                }
                                            </div>
                                        </section>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                    </Grid>          
                </Grid.Column>
            </Grid.Row> 
            {
                show && (
                    <>
                    <Grid.Row className='even-pad'>
                        <Grid.Column computer={16} mobile={16} >
                            <Header >Datos de archivo</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column computer={4} tablet={16} mobile={16}>
                                <span><b>Copias:</b></span>
                                <Input
                                    value={copias} 
                                    style={{ marginLeft: '10px' ,width: '50%'}}
                                    onChange={(ev) => {
                                        setCopias(ev.target.value);
                                        dispatch(modifyCopias({
                                            itemId: item.idProjectItem,
                                            copias: ev.target.value
                                        }))
                                    }} type='number' 
                                />
                                <Icon 
                                    className='trash alternate outline delete-icon' onClick={deleteItemFromCart} />
                            <h5 className='title-dashed'>Número y Tamaño de planchas</h5>
                            <div>
                                <ul>
                                    {
                                        file?.planchas?.map((plancha,index) => (
                                            <li>{`- Plancha ${index+1}  -  ${plancha.board.width} X ${plancha.board.height}mm`}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <h5 className='title-dashed'>Capas detectadas</h5>
                            <div>
                                <ul>
                                    {
                                        getDetectedCapas().map((capa) => (
                                            <li>
                                                <Icon name='circle outline' style={{
                                                    color: getColor(capa)
                                                }} />
                                                {`- ${capa}`}
                                            </li>
                                        ))
                                    }
                                    
                                </ul>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={12} mobile={16}>
                            <h5 className='title-dashed'>Selección de material</h5>
                            <div className='select-material-options'>
                                <Select 
                                    className='select-material-options__type' 
                                    options={categories} 
                                    onChange={(e,{ value }) => {
                                        setCategorySelected(value);
                                    }} />
                                <Select 
                                    className='select-material-options__material' 
                                    options={materiales} 
                                    defaultValue={item.material}
                                    value={productSelected}
                                    onChange={(e,{ value }) => {
                                        console.log(value)
                                        setProductSelected(value);
                                    }}
                                />
                                <Select 
                                    className='select-material-options__weight' 
                                    options={anchos} 
                                    defaultValue={item.weight}
                                    onChange={(e,{ value }) => {
                                        setWeightSelected(value);
                                    }}
                                />
                            </div>
                            <div className='search-material-section'>
                            <Search
                                fluid
                                icon="search"
                                placeholder="Buscar material..."
                                results={products}
                                onResultSelect={(ev,x) => {
                                    setProductSelected(x.result.value);
                                    console.log(x)
                                }}
                                resultRenderer={resRender}
                            />
                                <div className="search-material-autocomplete">
                                    <p>
                                        Llevo mi propio material(contacta con justlasercut antes) 
                                        <Checkbox 
                                            defaultChecked={item.materialClient}
                                            onChange={(ev,{ checked }) => {
                                                dispatch(checkMaterialClient({
                                                    itemId: item.idProjectItem,
                                                    check: checked
                                                }))
                                            }}
                                        />
                                    </p>
                                </div>
                            </div>
                            <h5 className='title-dashed'>Extras:</h5>
                            <div>
                                {
                                    extras.map(extra => {
                                        const existChecked = item.extras.some(ev => parseInt(ev.id) === parseInt(extra.id) )
                                        return (
                                            <div style={{ display: 'flex' , alignItems: 'center', justifyContent: 'space-between'}}>
                                                <p>
                                                    - {extra?.text}
                                                </p>
                                                <div className='flex center'>
                                                    <p>{extra?.price}/plancha</p>
                                                    <Checkbox 
                                                        defaultChecked={existChecked}
                                                        onChange={(ev,data) => {
                                                        const { checked } = data;
                                                        if(checked) {
                                                            dispatch(addExtra({ itemId: item.idProjectItem, extras : extra }))
                                                        } else {
                                                            dispatch(deleteExtra({ itemId: item.idProjectItem, id : extra.id }))
                                                        }
                                                    }}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    </>
                )
            }
        </Grid>
    )
};

export default ProjectCart;