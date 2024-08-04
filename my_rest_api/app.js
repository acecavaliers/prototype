require('dotenv').config({path:`${process.cwd()}/.env`});
const express = require('express');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const supplierRouter = require('./routes/supplierRoutes');
const componentRouter = require('./routes/componentRoutes');
const catchAsync = require('./utils/catchAsync');
const app = express();
const cors = require('cors');




app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status:'success',
        message:'WORKSSS'
    });
});

// Routes
app.use('/api',userRouter);
app.use('/api',productRouter);
app.use('/api',supplierRouter);
app.use('/api',componentRouter);



app.use('*', catchAsync (async (req, res, next)=>{
   throw new Error('Error')
   
}))
;

app.use((err, req, res, next)=>{
    res.status(404).json({
        status:'error',
        message: err.message,
    });
});

const PORT = process.env.APP_PORT || 4000;



app.listen(PORT, () => {
    console.log('SERVER RUNNING', PORT);
});