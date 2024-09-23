import 'reflect-metadata'
import express from 'express'
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from './config'
import { Routes } from './interface/routes.interface'
import { AppDataSource } from './database'
import morgan, { FormatFn } from 'morgan'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session';
import passport from 'passport';
import { ErrorMiddleware } from './middlewares/error.middleware'
import PassportAuth from './middlewares/passport.middleware'

export class App {
    public app: express.Application
    public env: string
    public port: string | number
    public format: string

    constructor(routes: Routes[]) {
        this.app = express()
        this.env = NODE_ENV || 'development'
        this.port = PORT || 3000
        this.format = LOG_FORMAT || 'combined' 

        this.connectToDatabase()
        this.initializeMiddlewares()
        this.initializePassport();
        this.initializeRoutes(routes)
        this.initializeErrorHandling()
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`)
        })
    }

    public getServer() {
        return this.app
    }

    private async connectToDatabase() {
        try {
            // const connection = await createConnection(dbConfig)
            const connection = await AppDataSource.initialize()
            const recentMigrations = await connection.runMigrations()
            console.log(recentMigrations)
        } catch (error) {
            console.log(error)
        }
    }
    private initializeMiddlewares() {
        this.app.use(morgan(this.format))
        this.app.use(cors({
            origin: ORIGIN,
            credentials: CREDENTIALS,
            methods: "GET,POST,PUT,DELETE"
        }))
        this.app.use(cookieSession({
            name: 'session',
            keys: ['abbey-auth'],
            maxAge: 24 * 60 * 60 * 100,
        }))
      
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())    
    }

    private initializePassport() {
        this.app.use(PassportAuth.initialize()); // Correctly use the instance
        this.app.use(PassportAuth.session());    // Correctly use the instance
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use('/', route.router)
        })
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware)
    }
}