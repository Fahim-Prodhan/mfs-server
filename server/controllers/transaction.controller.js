import bcrypt from "bcryptjs";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const createTransaction = async (req, res) => {
  const { from, to, amount } = req.body;
  

  const amountInt = parseFloat(amount)

  if (amountInt < 50) {
    return res
      .status(400)
      .send({ error: "Minimum transaction amount is 50 Taka" });
  }

  try {

    // Find sender and receiver
    const sender = await User.findOne({ phone: from })
    const receiver = await User.findOne({ phone: to })

    if (!sender || !receiver) {
      return res.status(404).send({ error: "Sender or receiver not found" });
    }

    // Calculate the transaction fee
    const transactionFee = amountInt > 100 ? 5 : 0;
    const totalAmount = amountInt + transactionFee;

    if (sender.balance < totalAmount) {
      return res.status(400).send({ error: "Insufficient balance" });
    }

    const senderId = sender._id;
    const balance = sender.balance - totalAmount;
    const receiverId = receiver._id;
    const receiverBalance = receiver.balance + amountInt;

    const updatedUser = await User.findByIdAndUpdate(
        senderId,
        { balance },
        { new: true, runValidators: true }
      );
    const updatedUser2 = await User.findByIdAndUpdate(
        receiverId,
        { balance:receiverBalance },
        { new: true, runValidators: true }
      );


    // Update balances
    sender.balance -= totalAmount;
    receiver.balance += amount;


    // Create transaction record
    const transaction = new Transaction({
      from: sender.phone,
      to: receiver.phone,
      amount,
    });
    await transaction.save();
    res.status(200).send(transaction);
  } catch (error) {
    res.status(500).send(error);
  }
};
