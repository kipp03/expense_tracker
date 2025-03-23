const express =require('express');
const app = express();
const path=require('path');
const fs =require('fs');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get("/",(req,res) => {
    fs.readdir(`./expense`,(err,expenseFiles)=>{
        if (err) return res.send(err);
        res.render("index",{expenseFiles}); 
    })
})

app.get("/create",(req,res)=>{
    res.render("create");
})

app.post("/createExpense",(req,res) => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); 
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    fs.writeFile(`./expense/${formattedDate}.txt`,req.body.content,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })

})

app.get("/edit/:filename",(req,res)=>{
    fs.readFile(`./expense/${req.params.filename}`,"utf-8",function(err,data){
        if (err) return res.sendStatus(500).send(err);
        res.render("edit",{data , filename:req.params.filename});
     })
    
})

app.post("/update/:filename",(req,res) => {
    fs.writeFile(`./expense/${req.params.filename}`, req.body.content, (err)=>{
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
    
})

app.get("/expense/:filename",(req,res)=>{
    fs.readFile(`./expense/${req.params.filename}`,"utf-8",function(err,data){
        if (err) return res.sendStatus(500).send(err);
        res.render("hissab",{data , filename: req.params.filename});
     })
    
})

app.get("/delete/:filename",(req,res)=>{
    fs.rm(`./expense/${req.params.filename}`,function(err,data){
        if (err) return res.sendStatus(500).send(err);
        res.redirect("/");
     })
    
})

app.listen(4000);