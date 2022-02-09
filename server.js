const express = require('express');
const mongoose = require('mongoose');
const BrandName = require('./model');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Express MongoDB CRUD Project',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:5000/'
            }
        ]
    },
    apis: ['./server.js']
}
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerSpec));

app.use(express.json());
mongoose.connect('mongodb+srv://vamsiarisetti:India%40123@cluster0.4glgr.mongodb.net/brands?retryWrites=true&w=majority', 
{
    useUnifiedTopology: true,
    useNewURLParser: true
})
.then(() => console.log('DB Connected..'))
.catch(err => console.error(err));

// response body schema
/**
 * @swagger
 *  components:
 *      schema:
 *          Brand:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  brandname:
 *                      type: string
 *                  date:
 *                      type: string
 *                  _v:
 *                      type: integer
 */

// request body schema
/**
 * @swagger
 *  components:
 *      schema:
 *          AddBrand:
 *              type: object
 *              properties:
 *                  brandname:
 *                      type: string
 */

/**
 * @swagger
 * /:
 *  get:
 *      summary: This Endpoint is used to check if get method is working or not
 *      description: This Endoint is like a health check of the application
 *      responses:
 *          200:
 *              description: To test Get method
 * 
 */
app.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});

/**
 * @swagger
 * /addBrands:
 *  post:
 *      summary: This Endpoint is used to add brand to mongo DB collection
 *      description: This Endpoint is used to add brand to mongo DB collection
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/AddBrand'
 *      responses:
 *          200:
 *              description: To add Brand
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Brand'
 */
app.post('/addBrands', async (req, res) => {
    const {brandname} = req.body;
    try {
        const newData = new BrandName({brandname});
        await newData.save();
        return res.json(await BrandName.find());
    } catch (error) {
        console.log("Caught while adding brands : ", error.message);
    }
});

/**
 * @swagger
 * /getallbrands:
 *  get:
 *      summary: This Endpoint is used to retrive all the brands from mongo DB collection
 *      description: This Endpoint is used to retrive all the brands from mongo DB collection
 *      responses:
 *          200:
 *              description: To retreive all Brands
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Brand'
 */
app.get('/getallbrands', async(req, res) => {
    try {
        const allBrands = await BrandName.find();
        return res.json(allBrands);
    } catch (error) {
        console.log('caught in getting all brands : ', error.message);
    }
});

/**
 * @swagger
 * /getallbrands/{id}:
 *  get:
 *      summary: This Endpoint is used to retrive brand by Id from mongo DB collection
 *      description: This Endpoint is used to retrive brand by Id from mongo DB collection
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: id required
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: To retreive Brand by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schema/Brand'
 */
app.get('/getallbrands/:id', async(req, res) => {
    try {
        const filteredBrands = await BrandName.findById(req.params.id);
        return res.json(filteredBrands);
    } catch (error) {
        console.log('caught in getting brands by id : ', error.message);
    }
});

/**
 * @swagger
 * /deletebrand/{id}:
 *  delete:
 *      summary: This Endpoint is used to delete brand by Id from mongo DB collection
 *      description: This Endpoint is used to delete brand by Id from mongo DB collection
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: id required
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: To delete Brand by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Brand'
 */
app.delete('/deletebrand/:id', async(req, res) => {
    try {
        await BrandName.findByIdAndDelete(req.params.id);
        return res.json(await BrandName.find());
    } catch (error) {
        console.log('caught in deleting brands by id : ', error.message);
    }
});

app.listen(5000, () => console.log('Server is running..'));