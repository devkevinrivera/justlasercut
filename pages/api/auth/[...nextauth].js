import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook';
import { MongoClient } from "mongodb";
import axios from "axios";
import { BASE_URL } from "../../../constants/config";
const bcrypt = require('bcrypt');
const url =  'mongodb+srv://administrador:administrador@cluster0.fwkm6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const GOOGLE_ID = '609436379660-fd9dl73hpi615bd21jhl40b846bkvale.apps.googleusercontent.com';
const GOOGLE_SECRET = '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';

const FACEBOOK_ID = '198061489043891';
const FACEBOOK_SECRET = 'b9be9c30db57fa7b6453e76eaa5f2e69';

export default NextAuth({
    providers: [
        FacebookProvider({
            clientId: FACEBOOK_ID,
            clientSecret: FACEBOOK_SECRET
        }),
        GoogleProvider({
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET
        }),
        CredentialsProvider({
            name: 'Inicio de Sesión',
            credentials: {
                username: { label: "Usuario" , type : "text", placeholder: "Juanito..."},
                password: { label: "Clave" , type : "password", placeholder: "******"},
            },
            async authorize(credentials = {}, req) {
                const { username , password } = req.body;
                let user;
                try {
                    const client = await MongoClient.connect(url);
                    const db = client.db();
                    const collection = db.collection("customers");
                    const request = await collection.findOne({email: username })

                    if (request.password) {
                        if (bcrypt.compareSync(password,request.password)) {
                           user = request;
                        }
                    } else {
                        user = null;
                    }
                } catch (err) {
                    console.log(err);
                }
                if (user) {
                    return user;
                } else {
                    return null
                }
            },
        }),
    ],

    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 26 * 60 * 60
    },
    callbacks: {
        async signIn({ user , account, profile, email, crendetials}) {
            if (account.provider === 'google' || account.provider === 'facebook') {
                const fetchUserAndCreate = async () => {
                    try {
                        
                        const client = await MongoClient.connect(url);
                        const db = client.db();
                        const collection = db.collection("customers");
                        const request = await collection.findOne({ email : profile.email})
                        if (request === null) {
                            await axios.post(`${BASE_URL}api/customers`,{
                                email: profile.email,
                                password: 'google',
                                name: profile.name,
                            });
                            
                        }
                        client.close();
                        return user;
                    } catch (err) {
                        console.error(`Error registro google: ${err}`)
                    }
                };
                fetchUserAndCreate();
            }
            return true;
        },
        async jwt({ token, user, account, profile, isNewUser}) {
            return token;
        },
    },
});