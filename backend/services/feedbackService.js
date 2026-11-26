import * as feedbackModel from '../models/feedbackModel.js';
import * as orderModel    from '../models/orderModel.js';

const doesOrderExist = async (id) => {
    const existing = await orderModel.findOrderById(id);
    if (existing.length > 0) {
        return { result: true, order: existing[0] };
    }
    return { result: false, order: undefined };
}

// insert
export const submitFeedback = async (userId, feedback) => {
    if (!feedback.order_id) {
        throw new Error('Order is required.');
    }

    const existingOrder = await doesOrderExist(feedback.order_id);
    if (!existingOrder.result) {
        throw new Error('Order does not exist.');
    }

    if (existingOrder.order.user_id !== userId) {
        throw new Error('This is not your order.');
    }

    await feedbackModel.insert({
        orderId:  feedback.order_id,
        userId,
        rating:   feedback.rating,
        comment:  feedback.comment,
    });

    return 'Feedback submitted.';
}
