const http = require('http');
const express = require("express");
const fs = require('fs');
const path = require('path');
const e = require('express');

//generar el bojeto principal
const app = express();
app.set('view engine','ejs');

//usar direcciones publicas
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//declarar array de objetos
let datos = JSON.parse(fs.readFileSync('datos.json' , 'utf8'));

//declarar un array de objetos

//primer peticion por el metodo get
app.get('/',(req,res)=>{

    res.render('index',{titulo:"Listado de alumnos", listado:datos});

})
app.get('/practica1',(req,res)=>{ 
res.render('practica01',{numero:""});

})

app.post('/p01',(req,res)=>{
    // parametros para recibir los datos
    const params ={
        numero: req.body.numero,
    }
    res.render('practica01',params);
    //body : cuando los datos viene de un formulario por el metodo post
})


app.get('/cotizacion',(req,res)=>{ 
    const params ={
        valor: req.query.valor,
        pinicial: req.query.pinicial,
        plazos: req.query.plazos,

    }
    res.render('practica02',params);
    
})

app.post('/cotizacion',(req,res)=>{
    const params ={
        valor: req.body.valor,
        pinicial: req.body.pinicial,
        plazos: req.body.plazos,
        
        }
        res.render('practica02',params);

})

app.get('/preExamen', (req, res) => { 
    const params = {
        numRecibo: req.query.numRecibo,
        nombre: req.query.nombre ,
        puesto: req.query.puesto ,
        nivel: req.query.nivel ,
        dias: req.query.dias ,
        calculoPago: req.query.calculoPago ,
        calculoImpuesto: req.query.calculoImpuesto ,
        totalPagar: req.query.totalPagar 
    };
    res.render('practica03', params);
});

app.post('/preExamen', (req, res) => {
    const params = {
        numRecibo: req.body.numRecibo,
        nombre: req.body.nombre,
        puesto: req.body.puesto,
        nivel: req.body.nivel,
        dias: req.body.dias
    };
    
    let pagoDiario = params.puesto == 1 ? 100 : (params.puesto == 2 ? 200 : 300);
    let totalPago = pagoDiario * (parseInt(params.dias) || 0);
    let impuesto = totalPago * (params.nivel == 1 ? 0.05 : 0.03);
    let totalPagar = totalPago - impuesto;

    params.calculoPago = totalPago.toFixed(2);
    params.calculoImpuesto = impuesto.toFixed(2);
    params.totalPagar = totalPagar.toFixed(2);
    
    res.render('practica03', params);
});


const puerto = 3000;
app.listen(puerto,()=>{
    
    console.log("el puerto esta escuchando");

})