const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const https = require('https')
const fs = require('fs')
const axios = require('axios')
const moment = require('moment')

const app = express();
app.use(morgan(':method :url :status :response-time ms'));
app.use(bodyParser.json());
app.use(cors());

app.listen(4000, () => {
    console.log('Server up at port 4000')
})

function generateIdInvoice() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
}

// POST //

app.post('/api/invoce', async(req, res) => {
    let subtotal = Number(req.body.total)
    let user = req.body.email
    let date = moment(Date.now()).locale('es-do').format('LLL')
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    let total = await Number(subtotal) - (subtotal * 18) / 100
    let tax = await Number(subtotal) * 18 / 100

    // console.log(parseInt(total), (parseInt(tax)))

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: 'valdezdaniel888@gmail.com',
            pass: 'DV1901VG'
        }
    })

    var mailOptions = {
        from: 'PICKAPP',
        to: user,
        subject: 'Factura de su pedido PickApp',
        html: `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
            body {
                background-color: #fc9003;
            }
            /* -------------------------------------
        GLOBAL
        A very basic CSS reset
    ------------------------------------- */

            * {
                margin: 0;
                padding: 0;
                font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
            }

            img {
                max-width: 100%;
            }

            body {
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: none;
                width: 100% !important;
                height: 100%;
                line-height: 1.6;
            }
            /* Let's make sure all tables have defaults */

            table td {
                vertical-align: top;
            }
            /* -------------------------------------
        BODY & CONTAINER
    ------------------------------------- */

            .body-wrap {
                /* background-color: #f6f6f6; */
                width: 100%;
            }

            .container {
                display: block !important;
                max-width: 600px !important;
                margin: 0 auto !important;
                /* makes it centered */
                clear: both !important;
            }

            .content {
                max-width: 600px;
                margin: 0 auto;
                display: block;
                padding: 20px;
            }
            /* -------------------------------------
        HEADER, FOOTER, MAIN
    ------------------------------------- */

            .main {
                background: #fff;
                border: 1px solid #e9e9e9;
                border-radius: 3px;
            }

            .content-wrap {
                padding: 20px;
            }

            .content-block {
                padding: 0 0 20px;
            }

            .header {
                width: 100%;
                margin-bottom: 20px;
            }

            .footer {
                width: 100%;
                clear: both;
                color: #999;
                padding: 20px;
            }

            .footer a {
                color: #999;
            }

            .footer p,
            .footer a,
            .footer unsubscribe,
            .footer td {
                font-size: 12px;
            }
            /* -------------------------------------
        TYPOGRAPHY
    ------------------------------------- */

            h1,
            h2,
            h3 {
                font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
                color: #000;
                margin: 40px 0 0;
                line-height: 1.2;
                font-weight: 400;
            }

            h1 {
                font-size: 32px;
                font-weight: 500;
            }

            h2 {
                font-size: 24px;
            }

            h3 {
                font-size: 18px;
            }

            h4 {
                font-size: 14px;
                font-weight: 600;
            }

            p,
            ul,
            ol {
                margin-bottom: 10px;
                font-weight: normal;
            }

            p li,
            ul li,
            ol li {
                margin-left: 5px;
                list-style-position: inside;
            }
            /* -------------------------------------
        LINKS & BUTTONS
    ------------------------------------- */

            a {
                color: #1ab394;
                text-decoration: underline;
            }

            .btn-primary {
                text-decoration: none;
                color: #FFF;
                background-color: #1ab394;
                border: solid #1ab394;
                border-width: 5px 10px;
                line-height: 2;
                font-weight: bold;
                text-align: center;
                cursor: pointer;
                display: inline-block;
                border-radius: 5px;
                text-transform: capitalize;
            }
            /* -------------------------------------
        OTHER STYLES THAT MIGHT BE USEFUL
    ------------------------------------- */

            .last {
                margin-bottom: 0;
            }

            .first {
                margin-top: 0;
            }

            .aligncenter {
                text-align: center;
            }

            .alignright {
                text-align: right;
            }

            .alignleft {
                text-align: left;
            }

            .clear {
                clear: both;
            }
            /* -------------------------------------
        ALERTS
        Change the class depending on warning email, good email or bad email
    ------------------------------------- */

            .alert {
                font-size: 16px;
                color: #fff;
                font-weight: 500;
                padding: 20px;
                text-align: center;
                border-radius: 3px 3px 0 0;
            }

            .alert a {
                color: #fff;
                text-decoration: none;
                font-weight: 500;
                font-size: 16px;
            }

            .alert.alert-warning {
                background: #f8ac59;
            }

            .alert.alert-bad {
                background: #ed5565;
            }

            .alert.alert-good {
                background: #1ab394;
            }
            /* -------------------------------------
        INVOICE
        Styles for the billing table
    ------------------------------------- */

            .invoice {
                margin: 40px auto;
                text-align: left;
                width: 80%;
            }

            .invoice td {
                padding: 5px 0;
            }

            .invoice .invoice-items {
                width: 100%;
            }

            .invoice .invoice-items td {
                border-top: #eee 1px solid;
            }

            .invoice .invoice-items .total td {
                border-top: 2px solid #333;
                border-bottom: 2px solid #333;
                font-weight: 700;
            }
            /* -------------------------------------
        RESPONSIVE AND MOBILE FRIENDLY STYLES
    ------------------------------------- */

            @media only screen and (max-width: 640px) {
                h1,
                h2,
                h3,
                h4 {
                    font-weight: 600 !important;
                    margin: 20px 0 5px !important;
                }
                h1 {
                    font-size: 22px !important;
                }
                h2 {
                    font-size: 18px !important;
                }
                h3 {
                    font-size: 16px !important;
                }
                .container {
                    width: 100% !important;
                }
                .content,
                .content-wrap {
                    padding: 10px !important;
                }
                .invoice {
                    width: 100% !important;
                }
            }
        </style>
    </head>

    <body>

        <table class="body-wrap">
            <tbody>
                <tr>
                    <td></td>
                    <td class="container" width="600">
                        <div class="content">
                            <table class="main" width="100%" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td class="content-wrap aligncenter">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="content-block">
                                                            <h2>Gracias por utilizar nuestros servicios</h2>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="content-block">
                                                            <table class="invoice">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>Factura #${s4()}<br>${date}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <table class="invoice-items" cellpadding="0" cellspacing="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>Total</td>
                                                                                        <td class="alignright">DOP ${parseInt(total)}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Impuestos</td>
                                                                                        <td class="alignright">DOP ${parseInt(tax)}</td>
                                                                                    </tr>
                                                                                    <tr class="total">
                                                                                        <td class="alignright" width="80%">Subtotal</td>
                                                                                        <td class="alignright">DOP ${parseInt(subtotal)}</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="content-block">
                                                            PickApp
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="footer">
                                <table width="100%">
                                </table>
                            </div>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </body>

    </html>`
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.status(500).json('Error en el intento de enviar mail al destinatario', err);
        } else {
            console.log("Email sent");
            res.status(200).json('Email enviado satisfactoriamente al destinatario')
        }
    })

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