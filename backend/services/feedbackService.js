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

    if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
    }

    const existingOrder = await doesOrderExist(feedback.order_id);
    if (!existingOrder.result) {
        throw new Error('Order does not exist.');
    }

    if (existingOrder.order.user_id !== userId) {
        throw new Error('This is not your order.');
    }

    if (existingOrder.order.status !== 'Delivered') {
        throw new Error('Can only rate delivered orders.');
    }

    const existingFeedback = await feedbackModel.findFeedbackByOrderId(feedback.order_id);
    if (existingFeedback.length) {
        throw new Error('Feedback already submitted for this order.');
    }

    await feedbackModel.insert({
        orderId:  feedback.order_id,
        userId,
        rating:   feedback.rating,
        comment:  feedback.comment,
    });

    return 'Feedback submitted.';
}
