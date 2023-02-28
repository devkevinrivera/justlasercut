
import React, { useState, useEffect } from 'react';
import { Grid, Container, Button } from 'semantic-ui-react';
import Filters from '../Filters/Filters';
import Material from "../Material";


const MaterialGit = ({ list: { result } }) => {
    const [listFiltered, setListFiltered] = useState([]);

    const [categorieFilterList, setCategoryFilterList] = useState([]);
    const [plateSize, setPlateSize] = useState();
    const [rangeval, setRangeval] = useState(null);

    useEffect(() => {
        filterList();
    }, [categorieFilterList, plateSize, rangeval]);

    const filterList = () => {
        let allMaterials = result;
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
        <Container fluid className="material-git">
            <Grid columns="16" padded>
                <Grid.Row>
                    <Grid.Column computer={3} tablet={4} mobile={16}>
                        <Filters
                            plateSize={plateSize}
                            setPlateSize={setPlateSize}
                            categorieFilterList={categorieFilterList}
                            setCategoryFilterList={setCategoryFilterList}
                            setList={setListFiltered}
                            list={result}
                            rangeval={rangeval}
                            setRangeval={setRangeval}
                        />
                    </Grid.Column>
                    <Grid.Column computer={13} tablet={12} mobile={16}>
                        <Grid columns="16" className="material-git__list" padded relaxed>
                            {
                                listFiltered?.map(material => (
                                    <Material material={material} name={material.title.es} image={material.image} />
                                ))
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

const HelpCard = () => {
    return (
        <Grid.Column width="3" className="help-card" style={{ height: '20rem' }}>
            <Grid columns="16">
                <Grid.Row>
                    <Grid.Column width="16" className="help-card__bg">
                        <p style={{ height: '80px', overflow: 'hidden' }}>
                            Usa los filtros para encontrar el material que necesites y
                            elige el tamaño de plancha y grosor que necesites.
                        </p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width="16" textAlign="right">
                        <Button className="help-card__button">Contacto</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    )
}

export default MaterialGit;