var express             = require("express"),
    app                 = express(),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    bodyParser          = require("body-parser");
    
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/restfull_blog_app", {useMongoClient: true});
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());  //sanitizethe page only requirement need to be after bodyParser
    app.use(methodOverride("_method"));
  
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
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
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

//EDIT ROUTE    

app.get("/blogs/:id/edit",function(req,res){
   //inserting the data to the db from the form
  
  Blog.findById(req.params.id,function(error,foundBlog){
      if (error) {
          res.redirect("/blogs");
      } else {
          res.render("edit", {blog: foundBlog});
      }
  });
});


//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error,updatedBlog){
      if (error) {
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);//, {blog: updatedBlog});
      }
  });
});

//DELETE Route
app.delete("/blogs/:id", function(req, res){
//destroy blog 
 Blog.findByIdAndRemove(req.params.id, function(error){
      if (error) {
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs")
      }
 });
//redirect womewhere
    
});
app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running");
});



