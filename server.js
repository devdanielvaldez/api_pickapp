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

app.listen(4000, () => {
    console.log('Server up at port 4000')
})

// POST //

app.post('/api/invoce', async(req, res) => {
    console.log(req.body)
})

app.post('/api/payment-card', async(req, res) => {

    console.log(req.body)
    axios
        .post('https://pagos.azul.com.do/webservices/JSON/Default.aspx', req.body, {
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
            console.log(response)
            if (response.data.ResponseMessage == 'APROBADA') {
                res.status(200).json({ data: "APROBADA" })
            }

            if (response.data.ErrorDescription == 'SGS-002303: Invalid credit card number') {
                res.status(200).json({ data: "NM-01" })
            }

            if (response.data.ErrorDescription == 'VALIDATION_ERROR:CVC') {
                res.status(200).json({ data: "CVC-02" })
            }

            if (response.data.ErrorDescription == 'VALIDATION_ERROR:Expiration') {
                res.status(200).json({ data: "F-03" })
            }

            if (response.data.ResponseMessage == 'ERROR') {
                res.status(200).json({ data: "ERROR" })
            }

            if (response.data.ResponseMessage == 'DECLINADA') {
                res.status(200).json({ data: "DECLINADA" })
            }
            if (response.data.ResponseMessage == '3D_SECURE_CHALLENGE') {
                res.status(200).json({ data: "ERROR AL PROCESAR PAGO, POR FAVOR CONTACTE AL ADMINISTRADOR O A SU BANCO" })
            }
        })
})

app.post('/api/refund', async(req, res) => {
    const { Amount, Itbis, Date, OrderId } = req.body;

    const body = {
        Channel: "ECS",
        Store: "39435780010",
        CardNumber: "",
        Expiration: "",
        CVC: "",
        PosInputMode: "E-Commerce",
        TrxType: "Refund",
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
            res.status(200).json({ data: res.data })
        })
        .catch((err) => {
            res.status(400).json({ error: err })
        })
})