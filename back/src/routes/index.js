const router = require("express").Router();

const loginController = require("../controllers/LoginController");
const ProductController = require("../controllers/ProductController");

router.post("/", function (req, res) {
  loginController.login(req, res);
});
router.post("/products", function (req, res) {
  ProductController.index(req, res);
});
router.post("/products", function (req, res) {
  ProductController.create(req, res);
});
router.patch("/products/:id", function (req, res) {
  ProductController.update(req, res);
});
router.delete("/products/:id", function (req, res) {
  ProductController.remove(req, res);
});

module.exports = router;
