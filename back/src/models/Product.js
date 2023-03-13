const ProductSchema =
  ({
    name: {
      type: String,
      required: true,
    },
    manufacturing_date: {
      type: Date,
      required: true,
    },
    perishable: {
      type: Boolean,
      required: true,
    },
    expiration_date: {
      type: Date,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true});

module.exports = model("products", ProductSchema);
