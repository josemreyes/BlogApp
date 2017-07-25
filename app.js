var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser");
    
    
    mongoose.connect("mongodb://localhost/restfull_blog_app");
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
  
  //MONGOOSE/MODEL CONFIG
    var blogSchema = new mongoose.Schema({
        title:String,
        image: String,
        body: String,
        created: {
            type: Date,
            default: Date.now()
        }
    });
var Blog = mongoose.model("Blog", blogSchema);
    
// RESTFUL ROUTES
//Home Page
app.get("/",function(req,res){
   res.redirect("blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    //get all campground from db
    Blog.find({},function(error,blogs){
        if (error) {
            console.log(error);
        }else{
            res.render("index",{blogs: blogs});
        }
   
    });
});
//NEW ROUTE
app.get("/blogs/new",function(req,res){
   res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(error, newBlog){
            if (error) {
                res.render("new");                
            } else{
                res.redirect("/blogs");
            }       
    });
});


//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
   //inserting the data to the db from the form
   Blog.findById(req.params.id,function(error,foundBlog){
       if (error) {
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   });
});



app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running");
});



