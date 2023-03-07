import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Container, Grid, Image } from "semantic-ui-react";
import { BASE_URL } from '../../constants/config';
import axios from "axios";
import { useDispatch } from 'react-redux';
import router, { useRouter } from 'next/router';
import parse from "html-react-parser";
import { addItem } from '../../redux/reducers/cartSlice';
const { v4: uuidv4 } = require('uuid');
import { useDropzone } from 'react-dropzone'

const languages = {
    'es': require('../../locale/es/commons.json'),
    'en': require('../../locale/en/commons.json'),
};


const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '6rem',
    paddingBottom: '6rem',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#CC555F',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .12s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: 'rgb(162 67 67)'
  };
  
  const acceptStyle = {
    borderColor: 'rgb(162 67 67)'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

const Banner = ({ info }) => {
    const [files, setFiles] = useState({});
    const fileInputField = useRef(null)
    const dispatch = useDispatch();
    const { locale } = useRouter();
    const [bannerInfo, setBannerInfo] = useState();
    const t = languages[locale];
    useEffect(() => {
        let titleSelected; 
        if (locale === 'es') {
            titleSelected = info.find(element => element.languageId === 0);
        } else {
            titleSelected = info.find(element => element.languageId === 1);
        }
        setBannerInfo(titleSelected);
    }, [info, locale]);

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        const fileDropped = acceptedFiles[0];

        const startProject = async () => {
            try {
                if (files) {
                    const data = new FormData();
                    data.append('file', fileDropped);
                    const uploadMedia = await axios.post(`/api/dfx`, data, {
                        params: {
                            id: uuidv4(),
                        }
                    });
                    const fileName = uploadMedia.data.message;
                    const res = await axios.post('/api/project', {
                        fileName: fileName
                    });
                    let defaultProjectStructure = createBodyItemProject();
                    defaultProjectStructure.file = res.data;
                    dispatch(addItem(defaultProjectStructure));
                    router.push('/proyectos');
                }
            } catch (error) {
                console.error(`Error al subir fichero al servidor`, error);
            }


        };
        startProject();
    }, []);

    const {getRootProps, getInputProps, isDragAccept , isDragActive, isDragReject, isFocused } = useDropzone({onDrop})

    const createBodyItemProject = () => {
        return (
            {
                idProjectItem: uuidv4(),
                name: '',
                file: null,
                material: null,
                extras: [],
                previsualizacion: '',
                weight: '',
                materialClient: false,
                copias: 1,
            }
        )
    }
    
    const updateItemProject = (ev) => {
        setFiles([0]);
        const startProject = async () => {
            try {
                if (files) {
                    const data = new FormData();
                    data.append('file', ev.target.files[0]);
                    const uploadMedia = await axios.post(`/api/dfx`, data, {
                        params: {
                            id: uuidv4(),
                        }
                    });
                    const fileName = uploadMedia.data.message;
                    const res = await axios.post('/api/project', {
                        fileName: fileName
                    });
                    let defaultProjectStructure = createBodyItemProject();
                    defaultProjectStructure.file = res.data;
                    dispatch(addItem(defaultProjectStructure));
                    router.push('/proyectos');
                }
            } catch (error) {
                console.error(`Error al subir fichero al servidor`, error);
            }


        };
        startProject();

    }

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <Container fluid={true} className="banner">
            <Container className="banner__container">
                <Grid columns="16" className="banner__grid">
                    <Grid.Column computer="8" tablet={8} mobile={16} className="banner__manual">
                        {bannerInfo?.title && (parse(bannerInfo?.title))}
                    </Grid.Column>
                    <Grid.Column computer="8" tablet={8} mobile={16} className="banner__start-shop">
                        <div
                            {...getRootProps({style})} 
                            className={` ${isDragActive ? ('upload-box-active') : ''}`}>
                            <input {...getInputProps()} />
                            <Image src="/cloud_upload_file.svg" />
                            {
                                isDragActive ? <p>Suelta tus archivos</p> :
                                <p><b>{t.subirdxf}</b></p>
                            }
                        </div>
                    </Grid.Column>
                </Grid>
            </Container>
        </Container>
    );
};

export default Banner;