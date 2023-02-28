import React, { useState, useEffect } from 'react';
import { Grid, Header, Divider, Icon, Image, Modal, Button, Form, Table, GridColumn } from 'semantic-ui-react';
import axios from "axios";
import { useRouter } from "next/router";
const { v4: uuidv4 } = require('uuid');
import { CKEditor } from 'ckeditor4-react';
import parse from 'html-react-parser';
import { getBlog } from "../../../services/blog";
import BlogModal from "./BlogModal";
import BlogEditModal from "./BlogEditModal";
import { deleteBlog } from "../../../services/blog";

const Blog = () => {
    //Recuperar entradas de blog.
    const [blog, setBlog] = useState([]);
    const [updater, setUpdater] = useState([]);
    useEffect(() => getEntriesBlog(), []);
    useEffect(() => getEntriesBlog(), [updater]);

    const getEntriesBlog = async () => {
        try {
            const { data: { blog } } = await getBlog();
            setBlog(blog);
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <Grid columns={16} style={{ paddingTop: '50px' }}>
            <Grid.Row>
                <Grid.Column width={13}>
                    <Header>Edición de blog</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                    <BlogModal />
                </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row style={{ padding: '.8rem', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
                {
                    blog?.map(entry => (
                        <Grid.Column width={16} style={{ border: '1px solid gray', marginBottom: '0.25rem', backgroundColor: 'white' }}>
                            <Grid columns="16">
                                <Grid.Row>
                                    <Grid.Column width={3} style={{ padding: '0px' }}>
                                        <Image src={entry.image} style={{ height: '7rem', width: '100%' }} />
                                    </Grid.Column>
                                    <Grid.Column width={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h4>{entry.title}</h4>
                                        <p>{entry.subtitle}</p>
                                    </Grid.Column>
                                    <Grid.Column width={5} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}>
                                        <BlogEditModal setUpdater={setUpdater} entry={entry} />
                                        <Button content='Eliminar' onClick={async () => {
                                            await deleteBlog(entry.id);
                                            getEntriesBlog();
                                        }} color='red' />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    ))
                }

            </Grid.Row>
        </Grid >
    );
};

export default Blog;