import express from 'express';
import bodyParser from 'body-parser';
import path from "node:path";
import mongoose from "mongoose";
import articleSchema from "../models/article";

export class WS {
    app: express.Application;
    port: number;
    DBLINK: string;

    constructor(app: express.Application, port: any, DBLINK: string){
        this.app = app
        this.port = Number(port)
        this.DBLINK = DBLINK
        // init config
        this.app.use(express.static(path.resolve('./public')));
        this.app.listen(this.port, () => console.log(`this.app listening at http://localhost:${this.port}`));
        this.app.use(bodyParser.urlencoded({extended : true}));
        this.app.use(bodyParser.json());
        this.app.set('trust proxy', true);
    
    }

    init(){
        this.app.get('/', async (req:any, response:any) => {
            return response.render('index.hbs', {root:'.'})
        })
        
        this.app.post('/search', async(req:any, response:any) =>{
            let search = req.body.search
            let article:any = await this.getArticle({title: search})
            let title = article.title
            let content = article.content
            return response.render('article.hbs', {title, content})

        })
    }

    connect(){
        const mongOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false, // Don't build indexes
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        }
        
		mongoose.connect(this.DBLINK as string, mongOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => {
            console.log("BotDiscoin : Mongoose est connecté !")
        });
    }


    async registerArticle(article: any){
        console.log(article)
        const newArticle = new articleSchema(Object.assign({ _id: new mongoose.Types.ObjectId(),  title: article.title, createdAt: article.createdAt, updatedAt: article.updatedAt, content: article.content, author: article.author}));
        newArticle.save().then((u:any) =>{
            console.log(`Nouvel article (BDD) -> ${article.title}`)
       });
    }

    async getArticle(article: any){
        const data = await articleSchema.findOne({ title: article.title });
        if (data) return data;
        else return;
    }
}