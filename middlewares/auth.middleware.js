
// export const middleware = (req, res, next) => {
//     // 1. Record the start time of the request
//     const start = process.hrtime();
//     const requestTime = new Date().toISOString();

//     // 2. Log incoming request details immediately
//     console.log(`➡️  [${requestTime}] Request received: ${req.method} ${req.originalUrl}`);
//     console.log(`    Client IP: ${req.ip}`);
//     console.log(`    User-Agent: ${req.get('user-agent')}`);

//     // 3. Define a listener for the 'finish' event on the response object
//     // This executes once the response headers and body have been sent.
//     res.on('finish', () => {
//         // 4. Calculate the response time
//         const [seconds, nanoseconds] = process.hrtime(start);
//         const durationInMilliseconds = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

//         // 5. Get response details
//         const statusCode = res.statusCode;
//         const contentLength = res.get('content-length') || 'N/A';

//         // Determine log color based on status code for better visibility (optional)
//         let statusColor = '\x1b[32m'; // Green for 2xx
//         if (statusCode >= 500) {
//             statusColor = '\x1b[31m'; // Red for 5xx
//         } else if (statusCode >= 400) {
//             statusColor = '\x1b[33m'; // Yellow for 4xx
//         } else if (statusCode >= 300) {
//             statusColor = '\x1b[36m'; // Cyan for 3xx
//         }

//         const resetColor = '\x1b[0m'; // Reset terminal color

//         // 6. Log the response details
//         console.log(`⬅️  [${requestTime}] Response sent: ${req.method} ${req.originalUrl}`);
//         console.log(`    Status: ${statusColor}${statusCode}${resetColor}`);
//         console.log(`    Content Length: ${contentLength} bytes`);
//         console.log(`    Response Time: ${durationInMilliseconds} ms`);
//         console.log('--------------------------------------------------');
//     });

//     // 7. Pass control to the next middleware or route handler
//     next();
// };


import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";


export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const secret = process.env.JWT_SECRET;

        if (!token) {
            return res.status(401).json({ success: false, error: "You are not authenticated" });
        }

        const decoded = jwt.verify(token, secret);

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Admin no longer exists' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error("❌ Error Authenticate", error);
        return res.status(500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

// Authorization - checks roles
export const authorize = (...types) => {
    return (req, res, next) => {
        if (!types.includes(req.admin?.type)) {
            return res.status(403).json({ success: false, error: "You are not authorized" });
        }
        next();
    };
};



