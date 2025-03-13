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

app.get('/examen1', (req, res) => {
    fs.readFile('productos.json', 'utf8', (err, data) => {
        const productos = JSON.parse(data);
        let tiposUnicos = [...new Set(productos.map(p => p.tipo))];
        res.render('practica04', { productos: [], totalCostoCantidad: 0, totalVentaCantidad: 0, totalProductos: 0, ganancia: 0, tiposUnicos });
    });
});
app.post('/examen1', (req, res) => {
    const tipoSeleccionado = parseInt(req.body.tipo);

    fs.readFile('productos.json', 'utf8', (err, data) => {

        const productos = JSON.parse(data);
        let productosFiltrados = productos.filter(p => p.tipo === tipoSeleccionado);

        let totalCostoCantidad = 0;
        let totalVentaCantidad = 0;
        let totalProductos = 0;
        let costoVenta = 1.15;

        productosFiltrados.forEach(producto => {
            let costoCantidad = producto.costo * producto.cantidad;
            let ventaCantidad = (producto.costo * costoVenta) * producto.cantidad;
            
            totalCostoCantidad += costoCantidad;
            totalVentaCantidad += ventaCantidad;
            totalProductos += producto.cantidad;
        });

        let ganancia = totalVentaCantidad - totalCostoCantidad;
        let tiposUnicos = [...new Set(productos.map(p => p.tipo))];

        res.render('practica04', {
            productos: productosFiltrados,
            totalCostoCantidad: totalCostoCantidad.toFixed(2),
            totalVentaCantidad: totalVentaCantidad.toFixed(2),
            totalProductos,
            ganancia: ganancia.toFixed(2),
            tiposUnicos
        });
    });
});

app.post('/limpiar', (req, res) => {
    res.redirect('/examen1');
});

const puerto = 3000;
app.listen(puerto,()=>{
    
    console.log("el puerto esta escuchando");

})