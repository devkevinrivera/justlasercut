import React, { useEffect, useState } from 'react';
import { Grid, Header, Input, Divider, Icon } from 'semantic-ui-react';
import { getCategoryMaterials, getSubCategoryMaterials } from "../../services/material";
import useScreen from '../../hooks/useScreen';
import { useForm } from "react-hook-form";
import InputRange from 'react-input-range';
import axios from "axios";

const Filters = ({ list, setList, categorieFilterList, setCategoryFilterList, plateSize, setPlateSize, rangeval, setRangeval }) => {
    const { width , height } = useScreen();
    const [auxListMaterials, setAuxMaterialList] = useState(list);
    const [showFilters,setShowFilters] = useState(true);

    useEffect(() => {
        setList(auxListMaterials);
    }, []);

    return (
        <Grid columns="16">
            <Grid.Row>
                <Grid.Column mobile={16} className="filter-display-mobile">
                    <Divider />
                    <div className="filter-display-mobile__container" onClick={() => setShowFilters(!showFilters)}>
                        <h3>Filtros</h3>
                        {
                            !showFilters ? (
                                <Icon name="arrow circle down" size="large"/>
                            ) : (
                                <Icon name="arrow circle up" size="large"/>
                            )
                        }
                        
                    </div>
                    <Divider />
                </Grid.Column>
                {
                    showFilters && (
                        <>
                            <Grid.Column width="16">
                                <MaterialCategory
                                    categorieFilterList={categorieFilterList}
                                    setCategoryFilterList={setCategoryFilterList}
                                />
                            </Grid.Column>
                            <Grid.Column width="16">
                                <PlateSize
                                    plateSize={plateSize}
                                    setPlateSize={setPlateSize}
                                />
                            </Grid.Column>
                            <Grid.Column width="16">
                                <PlateWeight
                                    rangeval={rangeval}
                                    setRangeval={setRangeval}
                                />
                            </Grid.Column>
                            <Grid.Column width="16">
                                <Finishing />
                            </Grid.Column>
                            <Grid.Column width="16">

                            </Grid.Column>
                        </>
                    )
                }
                
            </Grid.Row>
        </Grid>
    );
};

const MaterialCategory = ({ categorieFilterList, setCategoryFilterList }) => {
    const [isActive, setIsActive] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [subcategoryList, setSubCategoryList] = useState([]);
    const [categoriesSelected, setCategoriesSelected] = useState([]);
    const [subcategoriesSelected, setSubcategoriesSelected] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(async () => {
        try {
            const requestCategories = await getCategoryMaterials();
            const requestSubCategories = await getSubCategoryMaterials();
            setCategoryList(requestCategories.data.steps);
            setSubCategoryList(requestSubCategories.data.steps);
        } catch (err) {
            console.error(`No se pueden obtener las categorias: ${err}`)
        }
    }, [])

    const handleSubcategory = (ev, subcategory) => {
        const isChecked = ev.target.checked;
        const id = subcategory.id;
        if (isChecked) {
            setSubcategoriesSelected([...subcategoriesSelected, ...subcategoryList.filter(({ subcategory }) => subcategory.id === id)]);
            setCategoryFilterList([...categorieFilterList, subcategory])
        } else {
            setSubcategoriesSelected([...subcategoriesSelected.filter(({ subcategory }) => subcategory.id !== id)]);
            setCategoryFilterList([...categorieFilterList.filter((entry) => entry.id !== id)])
        }
    };

    return (
        <Grid columns="16" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
            <Grid.Row>
                <Grid.Column width="16">
                    <Header as='h4' style={{ borderBottom: '1px dashed #131313' }}>
                        Material
                    </Header>
                </Grid.Column>
                <Divider />
                <Grid.Column width="16">
                    <ul style={{ paddingLeft: '15px' }}>
                        {categoryList.map(({ id, category }, index) => (
                            <li style={{ listStyleType: 'none', color: '#0f111b' }} key={index}>
                                <div>
                                    {category.name.es}
                                </div>
                                <div style={{ paddingLeft: '1rem' }}>
                                    {
                                        subcategoryList.map((subcategory) => {
                                            if (subcategory.subcategory.categoryId === id) {
                                                return (
                                                    <li style={{ listStyleType: 'none', color: '#0f111b' }}>
                                                        <input type="checkbox" className="checkbox-round" onClick={(ev) => handleSubcategory(ev, subcategory)} />
                                                        {subcategory.subcategory.name.es}
                                                    </li>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

const PlateSize = ({ plateSize, setPlateSize }) => {
    return (
        <Grid columns="16" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
            <Grid.Row>
                <Grid.Column width="16">
                    <Header as='h4' style={{ borderBottom: '1px dashed #131313' }}>
                        Tamaño de la plancha:
                    </Header>
                </Grid.Column>
                <Grid.Column width="16" style={{ paddingTop: '10px', paddingBottom: '30px' }}>
                    <form>
                        <select style={{ padding: '10px 0px' , width: '100%' }} onChange={(e) => {
                            setPlateSize(e.target.value)
                        }}>
                            <option value="0">Pequeño (Hasta 600x600mm)</option>
                            <option value="1">Mediano (Hasta 1200x900mm)</option>
                            <option value="2" selected>Gran formato</option>
                        </select>
                    </form>
                </Grid.Column>
            </Grid.Row>
        </Grid >
    )
}

const PlateWeight = ({ rangeval, setRangeval }) => {
    const [site,setSite] = useState();
    console.log(site)
    const fetchDataSite = () => {
        const fetchData = async () => {
            try {
                const request = await axios('/api/site');
                const configuration = request?.data?.configurationSite[0];
                console.log(configuration)
                setSite(configuration);
            } catch (error) {
                console.error('Error, al obtener propiedades de la web:',error);
            }
        };
        fetchData();
    };
    
    const getTotalOptions = () => {
        for (var i = site?.minimumThickness; i < site?.maximumThickness; i++) {
            return (
                <option value={i} label={i}></option>
            )
         }
    };
    
    useEffect(() => {
        fetchDataSite();
    },[])
    return (
        <Grid columns="16" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
            <Grid.Row>
                <Grid.Column width="16" >
                    <Header as='h4' style={{ borderBottom: '1px dashed #131313' }}>Grosor de plancha:</Header>
                </Grid.Column>
                <Grid.Column width="16">
                    <input type="range" style={{ width: '100%', margin: '15px 0px' }} list="mydata" className="custom-range" min={site?.minimumThickness} max={site?.maximumThickness}
                        onChange={(event) => setRangeval(event.target.value)} />
                    <datalist id="mydata">
                        {getTotalOptions()}
                    </datalist>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Min: <b>{site?.minimumThickness}</b></span>
                        <span><b>{rangeval}</b></span>
                        <span>Max: <b>{site?.maximumThickness}</b></span>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

const Finishing = ({ }) => {
    const listMaterials = ["Acabados", "Transparente", "Translúcido"];
    const recoommends = ["Maquetas de arquitectura", "Señalitica", "Bisuteria", "Flexible", "Para exteriores"]
    return (
        <Grid columns="16" style={{ paddingTop: '20px', paddingBottom: '30px' }}>
            <Grid.Row>
                <Grid.Column width="16">
                    <Header as='h4' style={{ borderBottom: '1px dashed #131313' }}>Acabados:</Header>
                </Grid.Column>
                <Grid.Column width="16">
                    <ul style={{ paddingLeft: '15px', listStyleType: 'none', color: '#0f111b' }}>
                        {listMaterials.map((material, index) => (
                            <li>
                                <input className="checkbox-round" type="checkbox" value={true} />
                                {material}
                            </li>
                        ))}
                    </ul>
                </Grid.Column>
                <Grid.Column width="16">
                    <Header as='h4' style={{ borderBottom: '1px dashed #131313' }}>Usos recomentados:</Header>
                </Grid.Column>
                <Grid.Column width="16">
                    <ul style={{ paddingLeft: '15px', listStyleType: 'none', color: '#0f111b' }}>
                        {listMaterials.map((material, index) => (
                            <li>
                                <input className="checkbox-round" type="checkbox" value={true} />
                                {material}
                            </li>
                        ))}
                    </ul>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

export default Filters;