import React , { useState , useEffect, useRef, useCallback, useMemo } from 'react';
import { Container, Grid, Header, Button, Icon, Form, Input, Divider } from "semantic-ui-react";
import ProjectCart from '../components/ProjectCart/ProjectCart';
import { useDispatch , useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FileUploader } from "react-drag-drop-files";
import { addItem, modifyCopias, setNameProject } from '../redux/reducers/cartSlice';
import axios from 'axios';
import {useDropzone} from 'react-dropzone'

const { v4: uuidv4 } = require('uuid');

const languages = {
    'es': require('../locale/es/commons.json'),
    'en': require('../locale/en/commons.json'),
};

const proyectos = () => {
    const [isUploadView,setUploadView] = useState(false);

    return (
        <Container className='proyectos'>
            { !isUploadView && (<MainApp setUploadView={setUploadView} />) }
            { isUploadView && (<UploadProject setUploadView={setUploadView} />)}
        </Container>
    );
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

const UploadProject = ({ setUploadView }) => {
    const fileInputField = useRef(null)
    const [files, setFiles] = useState({});
    const [fileData,setFileData] = useState({});
    const { locale } = useRouter();
    const dispatch = useDispatch();
    const t = languages[locale];
    const [name,setName] = useState('');
    
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
    
    const updateItemProject = (ev) => {
        setFiles([0]);
        const startProject = async () => {
            try {   
                const data = new FormData();
                data.append('file',ev.target.files[0]);
                const originalName = ev.target.files[0].name;
                const uploadMedia = await axios.post(`/api/dfx`, data, {
                    params: {
                        id: uuidv4()
                    }
                });
                const fileName = uploadMedia.data.message;
                const res = await axios.post(`/api/project`, {
                    fileName: fileName,
                    originalName: originalName
                });
                setFileData(res.data);
                
            } catch (err) {
                console.error(`Error al subir fichero al servidor:`,err);
            }
        };
        startProject();
    };
    
    const handlerCreateProject = () => {
        let defaultProjectStructure = createBodyItemProject();
        defaultProjectStructure.file = fileData;
        defaultProjectStructure.name = name;
        dispatch(addItem(defaultProjectStructure));
        setUploadView(false);
    };
    
    return (
        <Grid columns={16} className='upload-project'>
            <Grid.Row>
                <Grid.Column computer={16}>
                    <p className='name'>
                        <b>Nombre de tu proyecto: </b>
                        <Input value={name} onChange={(ev) => setName(ev.target.value)} type='text' />
                    </p>
                </Grid.Column>
            </Grid.Row>
           
            <Grid.Row>
                <Grid.Column computer={16}>
                        <div className="upload-box">
                            <div className="inputfile-box">
                                <input onChange={(ev) => { updateItemProject(ev) }} type="file" id="file" ref={fileInputField} />
                                <label htmlFor="file">
                                    <span id="file-name" className="file-box"></span>
                                    <span className="file-button">
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                        <p>{t.subirdxf}</p>
                                    </span>
                                </label>
                            </div>
                        </div>
                        
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Button onClick={() => handlerCreateProject()} positive>Continuar</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

const MainApp = ({setUploadView}) => {
    const nameSaved = useSelector(state => state.cart.name);
    const [name,setName] = useState(nameSaved);
    const { locale } = useRouter();
    const fileInputField = useRef(null);
    
    const t = languages[locale];
    const [totalPrice,setTotalPrice] = useState(0);
    const [fileData,setFileData] = useState({});
    const [files, setFiles] = useState({});
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

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

    useEffect(() => {
        console.log(cart.items)
        let calculateTotalCart = 0;

        cart.items.map((item) => {
            if(item.total) {
                calculateTotalCart += item.total;
            }
        });

        setTotalPrice(parseInt(calculateTotalCart));
    },[cart])
    
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFiles(file);
    };

    const handlerCreateProject = () => {
        let defaultProjectStructure = createBodyItemProject();
        defaultProjectStructure.file = fileData;
        defaultProjectStructure.name = name;
        dispatch(addItem(defaultProjectStructure));
        setUploadView(false);
    };

    const updateItemProject = (ev) => {
        setFiles([0]);
        const startProject = async () => {
            try {   
                const data = new FormData();
                data.append('file',ev.target.files[0]);
                const originalName = ev.target.files[0].name;
                const uploadMedia = await axios.post(`/api/dfx`, data, {
                    params: {
                        id: uuidv4()
                    }
                });
                const fileName = uploadMedia.data.message;
                const res = await axios.post(`/api/project`, {
                    fileName: fileName,
                    originalName: originalName
                });
                setFileData(res.data);
                handlerCreateProject();
            } catch (err) {
                console.error(`Error al subir fichero al servidor:`,err);
            }
        };
        startProject();
    };
    const history = useRouter()

    const handleCreatePedido = async () => {
        const user =  JSON.parse(localStorage.getItem('session'))
        const pedido = {
            ...cart,
            user: 'keivn'
        };
        try {
            localStorage.setItem('cart',JSON.stringify(pedido));
            history.push('/carrito');
            console.log(res);
        } catch (e) {
            console.error(e)
        }
    };

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
        <Grid columns={16}>
            <Grid.Row >
                <Grid.Column computer={16}>
                    <Header as='h1'>Tu presupuesto:</Header>
                </Grid.Column>
                <Grid.Column 
                    computer={16}  
                    className='dashed title-project' 
                    style={{ marginTop: '1.5rem', 
                    marginTop: '1.5rem'}}
                >
                    <p className='name'>
                        <b>Nombre de tu proyecto: </b>
                        <Input 
                            value={name} 
                            onChange={(ev) => {
                                setName(ev.target.value)
                                dispatch(setNameProject({name: ev.target.value}))
                            }} 
                            className='mg-2 input-project' 
                            type='text' 
                        />
                    </p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column computer={16} className='project-cart'>
                    <ProjectCart />
                </Grid.Column>
            </Grid.Row>
           
            <Grid.Row>
                <Grid.Column computer={16}>
                    <div {...getRootProps({ style })} className="upload-box">
                            <input {...getInputProps()} />
                            {
                                isDragActive ? <p>Suelta tu archivo</p> :
                                <p>{t.subirdxf}</p>
                            }
                    </div>
                    {/* <FileUploader handleChange={handleChange} name="file"  /> */}
                </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row>
                <Grid.Column computer={16} className='jf-right' style={{ marginBottom: '1rem !important'}}>
                    <Header as='h3'>Total:  {totalPrice} €</Header>
                </Grid.Column>
                <Grid.Column computer={16} className='jf-right'>
                    <Button className='button-buy' positive onClick={handleCreatePedido}>
                        <Icon corner size='large' name='plus' />
                        CREAR
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default proyectos;