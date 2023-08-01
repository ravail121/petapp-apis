const router = require("express").Router();
const { productController } = require("../controllers");
const {authMiddleware} = require("../middlewares");
const fs = require("fs")
let multer = require('multer');

// Create a storage object with custom filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let dirpath = `${process.env.STATIC_DIR}/${process.env.PRODUCTS_ASSETS_DIR}`;

      // Make the destination folder if not found
      if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath, { recursive: true })
      }

      // Set the destination folder where the file will be saved
      cb(null, dirpath);
    },
    filename: function (req, file, cb) {
      // Generate a custom filename
      const originalName = file.originalname;
      const extension = originalName.substring(originalName.lastIndexOf('.'));
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename =  uniqueSuffix  + extension;
      req.uploadedFileName = filename;
      cb(null, filename);
    }
});


let productsAssets = multer({ storage : storage });


const excelFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dirpath = `${process.env.STATIC_DIR}/${process.env.EXCEL_FILE_ASSETS_DIR}`;

    // Make the destination folder if not found
    if(!fs.existsSync(dirpath)){ fs.mkdirSync(dirpath, { recursive: true }) }

    // Set the destination folder where the file will be saved
    cb(null, dirpath);
  },

  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    let filename = `importData${extension}`;
    cb(null, filename);
  }
});

const uploadExcelFile = multer({ storage : excelFileStorage });



// Add Product
router.post("/add", authMiddleware.authenticate , productsAssets.single('file') ,  productController.addProduct);

// Get Product
router.get("/get/:id", authMiddleware.authenticate ,  productController.getProduct);

// Update Product
router.post("/update/:id", authMiddleware.authenticate ,  productController.updateProduct);

// Delete Product
router.delete("/delete/:id", authMiddleware.authenticate ,  productController.deleteProduct);

// Get Products
router.get("/list", authMiddleware.authenticate ,  productController.getAllProducts);

// Update Product Image
router.post("/image/update/:id", authMiddleware.authenticate , productsAssets.single('file') ,  productController.updateProductPicture);



// Delete Products
router.delete("/delete-all", authMiddleware.authenticate ,  productController.deleteProducts);


// Add Records From Excel File
router.post("/import" , authMiddleware.authenticate , uploadExcelFile.single("file") , productController.importProductsData)



module.exports = router;