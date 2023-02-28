import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form"
import router, { useRouter } from 'next/router';
import { Button, Header, Image, Modal, Divider, Checkbox } from 'semantic-ui-react'
import { addItem } from '../../redux/reducers/cartSlice';
import axios from "axios";
import { changeName } from "../../redux/reducers/cartSlice";
import { extras } from '../../constants/extras';
const { v4: uuidv4 } = require('uuid');
import {useDropzone} from 'react-dropzone'

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
    paddingLeft: '1rem',
    paddingRight: '1rem',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    outline: 'none',
    transition: 'border .12s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: 'rgb(162 67 67)',
    backgroundColor: '#F1F2F3',
  };
  
  const acceptStyle = {
    borderColor: 'rgb(162 67 67)'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

const ModalMaterial = ({ material }) => {
    const { weightList, plateSizes } = material;
    const [fileData,setFileData] = useState({});
    const [fileDataCharged, setFileDataCharged] = useState();
    const { locale } = useRouter();
    const { title, image } = material;
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = useState({});
    const t = languages[locale];
    const { register, handleSubmit } = useForm();
    const fileInputField = useRef(null);
    const [extraList,setExtraList] = useState([]);
    const dispatch = useDispatch();
    const [weightItem, setWeight] = useState(0);

    const addProjectToCart = () => {
        if(!fileDataCharged.file) return
        const item = createBodyItemProject();
        item.file = fileDataCharged.file;
        item.name = 'NuevoArchivo.dxf';
        item.extras = extraList;
        item.weight = weightItem;
        item.material = material.id;
        dispatch(addItem(item));
        router.push('/proyectos');
    };
    
    const onDrop = useCallback(acceptedFiles => {
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
                    let defaultProjectStructure = {};
                    defaultProjectStructure.file = res.data;
                    
                    setFileDataCharged(defaultProjectStructure)
                }
            } catch (error) {
                console.error(`Error al subir fichero al servidor`, error);
            }
        };
        startProject();
    }, []);

    const {getRootProps, getInputProps, isDragAccept , isDragActive, isDragReject, isFocused } = useDropzone({onDrop})

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
                copias: 1,
                materialClient: false,
            }
        )
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Image src='/+.png' alt='' style={{ width: '1rem', height: '1rem' }} />}
        >
            <Modal.Header>{title.es}</Modal.Header>
            <Modal.Content image>
                <Image size='medium' src={`/${image}`} wrapped style={{ width: '40%' }} />
                <div style={{ width: '100%', padding: '1.5rem' }}>
                    <h5>1.Elige tu material</h5>
                    <Divider />
                    <div>
                        <p><b>Grosor</b></p>
                        {
                            weightList.map(({ weight }) => (
                                <>
                                    <p className="mb-0">
                                        <input
                                            className="mr-5"
                                            type="radio"
                                            value={weight}
                                            onChange={() => setWeight(weight)}
                                            name="weight" />
                                            {weight}mm
                                    </p>
                                </>
                            ))
                        }
                    </div>
                    <h5><b>2. Consulta los tamaños de plancha para preparar tu archivo</b></h5>
                    <Divider />
                    <div>
                        <p>Tamaños de plancha disponibles:</p>
                        {
                            plateSizes.map(({ width, height }) => <p className="mb-0">
                                - {width}x{height}mm
                            </p>)
                        }
                    </div>
                    <h5><b>3. Añade los extras que necesites en este archivo.</b></h5>
                    <Divider />
                    <div>
                                {
                                    extras.map(extra => {
                                        return (
                                            <div style={{ display: 'flex' , alignItems: 'center', justifyContent: 'space-between'}}>
                                                <p>
                                                    - {extra?.text}
                                                </p>
                                                <div className='flex center'>
                                                    <p>{extra?.price}/plancha</p>
                                                    <Checkbox 
                                                        onChange={(ev,data) => {
                                                        const { checked } = data;
                                                        if(checked) {
                                                            setExtraList([...extraList, extra]);
                                                        } else {
                                                            setExtraList(extraList.filter(extraNow => extraNow.id !== extra.id))
                                                        }
                                                    }}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                    </div>
                    <h5><b>4. Sube tu archivo aquí para calcular tu presupuesto.</b></h5>
                    <Divider />
                    <div {...getRootProps({ style })} className="upload-box">
                            <input {...getInputProps()} />
                            {
                                isDragActive ? <p>Suelta tu archivo</p> :
                                <p>{t.subirdxf}</p>
                            }
                    </div>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Cancelar
                </Button>
                <Button
                    content="Añadir"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        addProjectToCart();
                        setOpen(false)
                    }}
                    style={{ backgroundColor: '#CC555F', color: 'white' }}
                />
            </Modal.Actions>
        </Modal>
    )
};

export default ModalMaterial;