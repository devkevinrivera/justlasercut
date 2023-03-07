import React, { useState, useEffect } from 'react';
import { Button, Grid, Header, Divider, Table, Image, Icon } from 'semantic-ui-react';
import CreationCategoryModal from './CreationCategoryModal';
import CreationMaterialModal from "./CreationMaterialModal";
import CreationSubtitleModal from "./CreationSubCategoryModa";
import CreationTagModal from "./CreationTagModal";
import CreationTerminationModal from "./CreationTerminationsModal";
import { getMaterials } from "../../../services/material";
import CardMaterial from "./CardMaterial";
import { useCategory } from "../../../hooks/useCategory";
import { BASE_URL } from "../../../constants/config";
import { deleteMaterial } from "../../../services/material";
import Filters from "../../Filters/Filters";

const Material = () => {
    const [materialList, setMaterialList] = useState([]);
    const { getCategoryItem , categorySelected } = useCategory();

    const [listFiltered, setListFiltered] = useState([]);

    const [categorieFilterList, setCategoryFilterList] = useState([]);
    const [plateSize, setPlateSize] = useState();
    const [rangeval, setRangeval] = useState(null);

    useEffect(() => {
        filterList();
    }, [categorieFilterList, plateSize, rangeval]);

    useEffect(() => {
        getCategoryItem();
    },[])
    const getMaterialList = () => {
        const handler = async () => {
            try {
                const { data } = await getMaterials();
                setMaterialList(data.result);
            } catch (e) {
                console.error('Error al obtener lista de materiales:', e)
            }
        };
        handler();
    };

    useEffect(() => {
        getMaterialList();
    }, []);

    const getMaterialName = (id) => {
        const item = categorySelected?.find(category => category.id === id)
        return item?.category?.name?.es
    }
    
    
    const filterList = () => {
        let allMaterials = materialList;
        if (categorieFilterList.length) {
            allMaterials = allMaterials.filter(material => {
                return categorieFilterList.some((subcategory) => subcategory.id === material.materialSubCategory);
            })
        };
        if (plateSize) {
            if (plateSize === 1) {
                allMaterials = allMaterials.filter(material => parseInt(material.plateSizes[0].width) < 600 && parseInt(material.plateSizes[0].width) < 600)
            }
            if (plateSize === 2) {
                allMaterials = allMaterials.filter(material => {
                    allMaterials = allMaterials.filter(material => parseInt(material.plateSizes[0].width) < 1200 && parseInt(material.plateSizes[0].width) < 900)
                })
            }
        };
        if (rangeval !== null) {
            let auxMaterial = allMaterials.map(material => {
                let isgood = material.weightList.every(({ weight }) => weight < rangeval)
                if (isgood) {
                    return material
                }
            });
            auxMaterial = auxMaterial.filter(material => typeof material !== 'undefined')
            allMaterials = auxMaterial;
        };
        setListFiltered(allMaterials);
    };

    return (
        <Grid columns="16" padded={true}>
            <Grid.Row>
                <Grid.Column computer="16" style={{ paddingTop: '2rem' }}>
                    <Header>Administración de materiales</Header>
                </Grid.Column>
                <Divider />
                <Grid.Column computer="16" style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CreationMaterialModal />
                    <CreationTagModal />
                    <CreationTerminationModal />
                    <CreationCategoryModal />
                    <CreationSubtitleModal />
                </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row >
                <Grid.Column computer={4}>
                <Filters
                    plateSize={plateSize}
                    setPlateSize={setPlateSize}
                    categorieFilterList={categorieFilterList}
                    setCategoryFilterList={setCategoryFilterList}
                    setList={setListFiltered}
                    list={categorySelected}
                    rangeval={rangeval}
                    setRangeval={setRangeval}
                />
            </Grid.Column>
            <Grid.Column computer={12}>
            <Table>
				    <Table.Header>
						<Table.Row>
							<Table.HeaderCell>Imagen</Table.HeaderCell>
							<Table.HeaderCell>Nombre</Table.HeaderCell>
							<Table.HeaderCell>Categoria</Table.HeaderCell>
							<Table.HeaderCell>Acciones</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
                    <Table.Body>
                        {
                            listFiltered.map((material) => (
                                <Table.Row>
                                    <Table.HeaderCell>
                                        <div style={{ display: 'flex' , justifyContent: 'center' }}>
                                            <Image size="mini" src={`${BASE_URL}/${material.image}`} />
                                        </div>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>{material?.title?.es}</Table.HeaderCell>
                                    <Table.HeaderCell>{getMaterialName(material.materialCategory)}</Table.HeaderCell>
                                    <Table.HeaderCell>
                                        <Button color="red" onClick={async (ev) => {
                                            ev.preventDefault();
                                            await deleteMaterial(material.id);
                                            getMaterialList();
                                        }}>
                                            <Icon name="trash" />
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </Grid.Column>
                {/* {
                    materialList.map((material) => (
                        <Grid.Column computer="4" style={{ marginBottom: '2.5rem' }}>
                            <CardMaterial material={material} />
                        </Grid.Column>
                    ))
                } */}
                
            </Grid.Row>
        </Grid>
    );
};

export default Material;