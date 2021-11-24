const orderStatus = [
    "Waiting for confirmation",
    "Waiting for the goods",
    "Delivered to the carrier",
    "Delivering",
    "Successful delivery",
    "Has received the goods",
    "Cancel order",
    "Return the goods/ Refund",
];

export const filterOrderStatus = orderStatus.map((item) => {
    const value = {
        text: item,
        value: item,
    };
    return value;
});