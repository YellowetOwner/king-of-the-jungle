const express = require("express")
const router = express.Router()
const api = require("../api")


function registerPostApiEndpoint(path,name,apiFunc){

  router.post(`/api/${path}/${name}`,async(req,res)=>{
  try{
    let api_call = await apiFunc.main(req);
    res.send(api_call)
  } catch(e){res.send({success:false,error:"Error: "+e});}
});
  
}
function registerGetApiEndpoint(path,name,apiFunc){

  router.get(`/api/${path}/${name}`,async(req,res)=>{
  try{
    let api_call = await apiFunc.main(req);
    res.send(api_call)
  } catch(e){res.send({success:false,error:"Error: "+e});}
});
  
}

router.get("/logout",async(req,res)=>{
 if(req.session && req.session.loggedIn){
   req.session.destroy()
   res.redirect("/")
 }else{
    res.redirect("/")
 }
})

api.forEach(ep=>{
  switch(ep.module.method){
    case "get":
    registerGetApiEndpoint(ep.path,ep.endpoint.replace(".js",""),ep.module);
    break;
    case "post":
    registerPostApiEndpoint(ep.path,ep.endpoint.replace(".js",""),ep.module);
    break;
  }
});

module.exports = router