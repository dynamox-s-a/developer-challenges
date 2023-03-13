class ProductController {
  constructor(dao) {
    this.dao = dao;
  }

  index = async (req, res) => {
    const products = await this.dao.find();
    return res.json(products);
  };

  create = async (req, res) => {
    const product = await this.dao.create(req.body);
    return res.status(201).json(product);
  };

  update = async (req, res) => {
    const {id} = req.params;
    const {name, manufacturing_date, perishable, expiration_date, price} =
      req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        perishable,
        manufacturing_date,
        expiration_date,
      },
      {
        new: true,
      }
    );

    res.status(200).send({product});
  };

  remove = async (req, res) => {
    const {id} = req.params;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id === id);
    currentContent.splice(selectedItem, 1);
    res.send(currentContent);
  };
}
