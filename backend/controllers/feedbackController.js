import * as feedbackService from '../services/feedbackService.js';

export const getAll = async (req, res) => {
    try {
        const feedback = await feedbackService.fetchAllFeedback();
        res.status(200).json({ success: true, feedback });
    } catch(e) {
        console.log(e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
}

export const submit = async (req, res) => {
    const { order_id, rating, comment } = req.body;
    const feedback = { order_id, rating, comment };

    try {
        const user = req.session?.user;
        if (!user) {
            return res.status(401).json({ error: 'Please log in.' });
        }
        const result = await feedbackService.submitFeedback(user.id, feedback);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: `${e.message || "Internal Server Error"}`
        });
    }
}
