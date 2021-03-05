const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const https = require('https')
const fs = require('fs')
const axios = require('axios')

const app = express();
app.use(morgan(':method :url :status :response-time ms'));
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Server up at port 3000')
})

// POST //

app.post('/api/payment-card', async (req, res) => {
    const { nombre, cardNumber, cvc, expire, amount, email, itbis, articulo, delivery } = req.body;

    var orderNumber = 0

    const body = {
    Channel:"EC",
	Store:"39038540035",
	CardNumber:cardNumber,
	Expiration:expire,
    CVC:cvc,
	TrxType:"Sale",
	PosInputMode:"E-Commerce",
	Amount:amount.toFixed(),
    ITBIS: itbis,
	OrderNumber:"1"
    }

    console.log(req.body)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pickapp.do@gmail.com',
            pass: 'eapmacmd'
        }
    });

    let mailOptions = {
        from: 'pickapp.do@gmail.com',
        to: email,
        subject: 'Factura de Compra - PickApp',
        html: `<div style="width:100%;height:100vh;background-color:#E2E2E2;color:#000;padding-top:40px;"> <img src="https://pickapp.do/wp-content/uploads/2020/10/LOGO-PICK-APP-ORIGINAL-e1603588025771.png" style="margin-top:90px; display: block; margin-left: auto; margin-right: auto;"/> <br/> <h2 style="text-align: center;">Factura PickApp</h2> <br><div style="width: 260px; display: block; margin-right: auto; margin-left: auto;"> <div style="width: 260px; display: block; margin-right: auto; margin-left: auto; text-align: center;"> <p>Facturado a: <br> ${nombre} </p></div></div><div style="width: 40%; height: 50px; background-color: rgb(255, 176, 73); border-radius: 10px; margin-top: 20px; display: block; margin-left: auto; margin-right: auto; padding-right: 20px; padding-left: 20px;"> <p style="text-align: center; padding-top: 15px;">Gracias Por Preferirnos</p></div><div style="width: 40%; height: 230px; background-color: rgb(189, 189, 189); display: block; margin-left: auto; margin-right: auto; margin-top: 20px; border-radius: 10px; padding-top: 20px; padding-right: 20px; padding-left: 20px;"> <table style="border-bottom: rgb(124, 123, 123) 1px solid; width: 100%; margin-top: 15px;"> <tr> <th style="float: left; margin-left: 10px;">Total del Articulo</th> <th style="float: right;">RD$ ${articulo}</th> </tr></table> <table style="border-bottom: rgb(124, 123, 123) 1px solid; width: 100%; margin-top: 30px;"> <tr> <th style="float: left; margin-left: 10px;">Costo Delivery</th> <th style="float: right;">RD$ ${delivery}</th> </tr></table> <table style="border-bottom: rgb(124, 123, 123) 1px solid; width: 100%; margin-top: 30px;"> <tr> <th style="float: left; margin-left: 10px;">Impuestos</th> <th style="float: right;">RD$ ${itbis}</th> </tr></table><table style="border-bottom: rgb(124, 123, 123) 1px solid; width: 100%; margin-top: 30px;"> <tr> <th style="float: left; margin-left: 10px;">Monto Total</th> <th style="float: right;">RD$ ${amount}</th> </tr></table> </div><br><div style="width: 40%; height: 50px; border-radius: 10px; margin-top: 20px; display: block; margin-left: auto; margin-right: auto; padding-right: 20px; padding-left: 20px;"><a href="https://pickapp.do/politica-de-privacidad/">Politicas De Privacidad</a></div></div>`

    }



    axios
        .post('https://pagos.azul.com.do/webservices/JSON/Default.aspx', body, {
            headers: {
                'auth1': 'PICKAPP',
                'auth2': '%QG&TnfUtogx'
            },
            httpsAgent: new https.Agent({
                pfx: fs.readFileSync('./cert/produccion.pfx'),
                passphrase: 'PickApp123'
            }) 
        })
        .then(response => {
            res.status(200).json({ data: response.data })
            console.log(response.data)
            if (response.data.ResponseMessage == 'APROBADA') {
            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log('ERROR MSGMAIL012897', err)
                } else {
                    console.log('EMAIL SEND', data)
                }
            })
            }
        })
        .catch((err) => {
            res.status(400).json({
            error: err
        })
    })
})

app.post('/api/refund', async (req, res) => {
    const { Amount, Itbis, Date, OrderId } = req.body;
    
    const body = {
    Channel:"ECS",
	Store:"39038540035",
	CardNumber:"",
	Expiration:"",
    CVC:"",
	PosInputMode:"E-Commerce",
	TrxType:"Refund",
	Amount: Amount,
	Itbis: Itbis,
	OriginalDate: Date,
	AzulOrderId: OrderId
    }

    console.log(req.body)

    axios
        .post('https://pagos.azul.com.do/webservices/JSON/Default.aspx', body, {
            headers: {
                'auth1': 'PICKAPP',
                'auth2': '%QG&TnfUtogx'
            },
            httpsAgent: new https.Agent({
                pfx: fs.readFileSync('./cert/produccion.pfx'),
                passphrase: 'PickApp123'
            })
        })
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch((err) => {
        res.status(400).json({ error: err })
    })
})