const path = require('path');
// Load .env cạnh thư mục server (mern-demo/.env). quiet:true để tắt log "injected env".
// Nếu chạy bằng docker-compose (env_file), biến môi trường đã có sẵn nên dotenv sẽ không ghi đè.
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require("./Model/Student");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());

app.use(express.json());

// API lấy danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy danh sách sinh viên",
            error: error.message
        });
    }
});

// Xây dựng API POST /api/students để thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi thêm sinh viên",
            error: error.message
        });
    }
});
// Xây dựng API PUT /api/students/:id để cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi cập nhật sinh viên",
            error: error.message
        });
    }
});
// Xây dựng API DELETE /api/students/:id để xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student: student
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xóa sinh viên",
            error: error.message
        });
    }
});

// API kiểm tra (Đã tạo ở Câu 22) — đăng ký trước để luôn trả lời kể cả khi DB chưa nối
app.get('/api/hello', (req, res) => {
    res.json({
        status: "success",
        message: "Xác nhận: Backend đang hoạt động ổn định!"
    });
});

app.get('/api/health', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        status: "success",
        dbState: states[mongoose.connection.readyState] || mongoose.connection.readyState,
        dbName: mongoose.connection.name || null
    });
});

// Câu 36: Tiến hành kết nối Express Backend với MongoDB Atlas thông qua Mongoose
if (!MONGODB_URI) {
    console.error("Thiếu biến môi trường MONGODB_URI. Kiểm tra file mern-demo/.env hoặc env_file trong docker-compose.");
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Express Server đang chạy trên port ${PORT}`);
});

mongoose.connect(MONGODB_URI, {
    dbName: "Nghi",
    serverSelectionTimeoutMS: 10000
})
    .then(() => {
        console.log("=========================================");
        console.log("Kết nối MongoDB Atlas thành công!");
        console.log("Database:", mongoose.connection.name);
        console.log("Collection:", Student.collection.name);;
        console.log("=========================================");
    })
    .catch(err => {
        console.error("Lỗi kết nối cơ sở dữ liệu MongoDB Atlas:");
        console.error(err.message || err);
        if (err.name === 'MongooseServerSelectionError') {
            console.error("\nGợi ý khắc phục:");
            console.error("1. Atlas -> Network Access -> ADD IP ADDRESS -> cho phép IP hiện tại của bạn (dev có thể dùng 0.0.0.0/0).");
            console.error("2. Kiểm tra user/pass trong MONGODB_URI và tên database (URI hiện tại chưa có /<dbname> nên sẽ dùng db 'test').");
            console.error("3. Kiểm tra DNS/TLS outbound tới port 27017 không bị firewall chặn.");
        }
        // Không exit để /api/hello và /api/health vẫn trả lời, frontend không bị connection refused
    });