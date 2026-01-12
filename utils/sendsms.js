

import 'dotenv/config';
// smsSend.utils.js

const API_USERNAME = process.env.API_USERNAME;
const API_KEY = process.env.API_KEY;
const SMS_API_BASE_URL = process.env.SMS_API_BASE_URL;

const validateCredentials = () => {
    if (!API_USERNAME?.trim() || !API_KEY?.trim()) {
        throw new Error('Missing SMS API credentials in environment variables');
    }
};

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'appbytesms-api-user': API_USERNAME.trim(),
    'appbytesms-api-key': API_KEY.trim(),
    'appbytesms-api-timestamp': Date.now().toString()
});

export const sendSms = async (number, message) => {
    validateCredentials();

    if (!number || !message?.trim()) {
        throw new Error('Number and message are required');
    }

    const response = await fetch(`${SMS_API_BASE_URL}/sms/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ number, message })
    });

    const data = await response.json().catch(() => ({}));
    if (!data.success) {
        throw new Error(data.error || `SMS API error: ${response.status}`);
    }

    return data;
};

export const sendBulkSms = async (recipients, { batchSize = 50, delayMs = 100 } = {}) => {
    validateCredentials();

    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new Error('Recipients array is required');
    }

    const results = { success: [], failed: [] };

    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        // Sequential processing within batch to ensure unique timestamps
        for (const { number, message } of batch) {
            try {
                const response = await sendSms(number, message);
                results.success.push({ number, response });
            } catch (error) {
                results.failed.push({ number, error: error });
            }
        }

        // Delay between batches
        if (i + batchSize < recipients.length) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return {
        total: recipients.length,
        successCount: results.success.length,
        failedCount: results.failed.length,
        ...results
    };
};

export const getBalance = async () => {
    validateCredentials();

    const response = await fetch(`${SMS_API_BASE_URL}/sms/balance`, {
        method: 'GET',
        headers: getHeaders()
    });

    const data = await response.json().catch(() => ({}));
    if (!data.success) {
        throw new Error(data.error || `SMS API error: ${response.status}`);
    }

    return data;
};



