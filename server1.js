  /*Invoice App*/ 
import { createTransport } from 'nodemailer';
import express from 'express';                          //using express.js
import bodyParser from 'body-parser';

var transport = createTransport({
    host: "smtp.mailtrap.io",                    //using mailtrap to send email from nodejs
    port: 2525,
// login to mailtrap and get user and pass from there

//or else gmail service can also be used: enter email and password of your gmail account and Allow less secure apps to turn ON from 
//Less secure app access
 /*service:'gmail',  */
    auth: {
      user:"64e508db4664c6",
      pass:"bb746b852d1d1e"
    }
  });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;
import { getList } from './example.js'
const InvoiceList = getList();


app.get('/',(req,res)=>{

    return res.status(200).send({
        success: 'true',
        Invoices: InvoiceList
    })                                      //getting data of all invoices at localhost 3000
});

//----------------------------------------------*******************---------------------------------------------------

app.get('/email/:id',(req,res)=>
{
  var value;
  var flag=0;
  for (var x in InvoiceList){
      if(InvoiceList[x]["id"]==req.params["id"]){
          value=x;
          console.log(x);
          flag=1;
      }}
      console.log(value);
const message = {
     from: "clientinvoice@email.com",
     to: InvoiceList[value].email,
     subject: "Invoice Details",
     text: "Dear"+" "+InvoiceList[value].first_name+","+"\nPlease view the details of the invoice below.\n\nInvoice: "+InvoiceList[value].id+"/2060\n\
Issue Date:"+InvoiceList[value].dateIssued+"\n\
Invoice Subject:"+InvoiceList[value].workExpense+"\n\
Due Date:"+InvoiceList[value].dueDate+"\n\n\
To view invoice online click VIEW ONLINE INVOICE\n\n\
Thank you for your time.\n\
Demo Company"
}
         transport.sendMail(message, function(err, info) {
  
        if (err) {
          console.log(err)
        } else {
          console.log('mail has sent')
          return res.status(200).send({
            success: 'true'
        })
        }}
    );
    })

//----------------------------------------------*******************---------------------------------------------------

app.get('/invoice/:id',(req,res)=>{
    var value;
    var flag=0;
    for (var x in InvoiceList){
        if(InvoiceList[x]["id"]==req.params["id"]){
            value=x;
            flag=1;
        } 
    }
    if (flag==0){
        return res.status(400).send({
            error: 'Invoice ID not available',  
        })
      }
      else return res.status(200).send({
        success: 'true',
        Invoices: InvoiceList[value]
    }) 
        
    });                                                      //getting data by id
    
    //----------------------------------------------*******************---------------------------------------------------

app.post('/newInvoice', (req, res) => {
    res.sendStatus(200);
    console.log(req.body["id"]);
    InvoiceList.push(
        {
            id: req.body["id"],
            first_name:req.body["first_name"],
            last_name:req.body["last_name"],
            email: req.body["email"],
            dateIssued:req.body["dateIssued"],
            dueDate:req.body["dueDate"],
            workHours: req.body["workHours"],
            workExpense: req.body["workExpense"],
            materials: req.body["materials"],
            labour: req.body["labour"],
            notes: req.body["notes"],
            cheque: req.body["cheque"],
            status: req.body["status"]
        }
    );                                                     //adding new data
});

//----------------------------------------------*******************---------------------------------------------------

app.put('/update',(req,res)=>{
    
    var flag=0;
    for (var x in InvoiceList) {
        if(InvoiceList[x]["id"]==req.body["id"]){
        InvoiceList[x]["status"]=req.body["status"];
        flag=1;
      }}
      if (flag==0){
        return res.status(400).send({
            error: 'Invoice ID not available',  
        })
      }                                                     //updating status manually from body 
      else res.sendStatus(200);
});   

//----------------------------------------------*******************---------------------------------------------------

app.put('/updateLate/:id',(req,res)=>{
    var index=-1;
    var flag=0;
    for (var x in InvoiceList) {
        if(InvoiceList[x]["id"]==req.params["id"]) {
            index=x;
            flag=1;
        }
      }
    let timestamp=InvoiceList[index].dueDate;
    function formatDate(timestamp){
        var x=new Date(timestamp);
        var dd = x.getDate();
        if (dd%10==0){
          dd="0"+dd;
        }
        var mm = x.getMonth()+1;
        if (mm%10==0){
          mm="0"+mm;
        }
        var yy = x.getFullYear();
        return yy +"-" + mm+"-" + dd;
     }
    var flag=0;
    for (var x in InvoiceList) {
        if(InvoiceList[x]["id"]==req.params["id"]){
        console.log(InvoiceList[x]["status"]=req.body["status"]);
        flag=1;
      }}
      if (flag==0){
        return res.status(400).send({
            error: 'Invoice ID not available',  
        })
      }
      else {
        var today = new Date();
        const todaysDate= formatDate(today);
        var d1=Date.parse(todaysDate);
        var d2=Date.parse(timestamp);
        if(d1>d2){
          InvoiceList[x]["status"]="Unpaid";
            return res.status(200).send({
             success:'Pay your bill',  
          })
        }
        else {
          InvoiceList[x]["status"]="Late";
          return res.status(400).send({
            error: 'Due Date is passed.',  
        })
        }
      }
});                                                              //updating status manually depending on due date

//----------------------------------------------*******************---------------------------------------------------

app.delete('/delete/:id', (req, res) => {
    var index=-1;
    var flag=0;
    for (var x in InvoiceList) {
        if(InvoiceList[x]["id"]==req.params["id"]) {
            index=x;
            flag=1;
        }
      }
    if (flag) InvoiceList.splice(index,1);
    if (flag==0){
        return res.status(400).send({
            error: 'Invoice ID not available',  
        })
      }                                                                  //deleting Invoice bY ID
      else res.sendStatus(200);
}); 

//----------------------------------------------*******************---------------------------------------------------

app.listen(port, () => {
  console.log(`Invoice app listening at http://localhost:${port}`);
});
/* End of Project*/