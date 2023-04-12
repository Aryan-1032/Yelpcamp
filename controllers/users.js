const User = require('../models/user');
module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
};
module.exports.createUser = async(req,res)=>{
    try
    {
      const {username,email,password}=req.body;
     const user = new User({email,username});
     const registerUser = await User.register(user,password);
     req.login(registerUser,(err)=>{
       if(err){
         return next(err);
       }
       req.flash('success',"welcomw to yelpcamp");
       res.redirect('/campgrounds');
     })
   
    }
    catch(e){
         req.flash('error',e.message);
         res.redirect('register');
    
    }
 };
 module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
  };
  module.exports.login = (req,res)=>{
    req.flash('success','welcome back!!');
    const returnTo = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(returnTo);
   };
 
  module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err)
      {
        return next(err);
      }
    });
    req.flash('success','successfully log you out!')
    res.redirect('/login')
  };