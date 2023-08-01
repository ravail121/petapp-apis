const router = require("express").Router();
const { categoryController } = require("../controllers");
const {authMiddleware} = require("../middlewares");
const fs = require("fs")
let multer = require('multer');

// Create a storage object with custom filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let dirpath = `${process.env.STATIC_DIR}/${process.env.CATEGORY_ASSETS_DIR}`;

      // Make the destination folder if not found
      if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath, { recursive: true })
      }

      // Set the destination folder where the file will be saved
      cb(null, dirpath);
    },
    filename: function (req, file, cb) {
      // Generate a custom filename

      let flag = false;
      if(!req.frontImage){ flag = true }
    

      const originalName = file.originalname;
      const extension = originalName.substring(originalName.lastIndexOf('.'));
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

      let imageSideName = flag ? "front" : "back"

      if( req.body.sideFlag ){

        console.log( "-->" , req.body.sideFlag)
        imageSideName = req.body.sideFlag == "1" ? "front" : "back"
      }
      
      const filename = imageSideName + "-" +  uniqueSuffix  + extension;

      req.uploadedFileName = filename;

      if(!req.frontImage){
        req.frontImage = filename;
      }
      else{
        req.backImage = filename;
      }

      
      cb(null, filename);
    }
  });





let categoriesAssets = multer({ storage });


// Add Category
router.post("/add", 
            authMiddleware.authenticate , 
            categoriesAssets.array("file" , 2) ,  
            categoryController.addCategory
);




// Get Category
router.get("/get/:id", authMiddleware.authenticate ,  categoryController.getCategory);

// Update Category
router.post("/update/:id", authMiddleware.authenticate ,  categoryController.updateCategory);

// Delete Category
router.delete("/delete/:id", authMiddleware.authenticate ,  categoryController.deleteCategory);

// Get Categories
router.get("/list", authMiddleware.authenticate ,  categoryController.getAllCategories);



// Update Category Image
router.post("/image/update/:id", authMiddleware.authenticate , categoriesAssets.single('file') ,  categoryController.updateCategoryPicture);




module.exports = router;