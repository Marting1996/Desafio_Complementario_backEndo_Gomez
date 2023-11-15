import mongoose from "mongoose";

const userCollection = "users"
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts", 
      title: String,
      quantity: Number,
    },
    role: {
        type: String,
        enum: ["admin", "user", "premium"],
        default: "user"
    },
    resetPassToken: String,
    resetPassExpiry: Date
})
userSchema.pre("save", async function (next) {
  if (!this.cart) {
      try {
          const CartModel = mongoose.model("carts");
          const newCart = new CartModel();
          await newCart.save();

          this.cart = newCart._id;
          next();
      } catch (error) {
          next(error);
      }
  } else {
      next();
  }
});

userSchema.pre("find", function () {
    this.populate("carts.cart");
});

userSchema.statics.findByResetTokens = async function (requestToken) {
    return this.findOne({
        resetPassToken: requestToken,
        resetPassExpiry: {$gt: Date.now() + 30000},
    })
}

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel