# Bull Board Monitor

🎯 Một ứng dụng monitor queue background jobs sử dụng Bull Board để theo dõi và quản lý các queue tasks.

## Tính năng

- 📊 Giao diện web hiện đại để monitor queue
- 🔄 Real-time tracking các jobs
- 📋 Quản lý multiple queues (Email, Image Processing, Report Generation)
- 🎮 Có thể retry, remove, clean jobs
- 📈 Thống kê performance và trạng thái jobs
- 🔍 Xem chi tiết job data và logs

## Yêu cầu

- Node.js (v14+)
- Redis server
- Yarn hoặc npm

## Cài đặt

1. **Clone repository:**
```bash
git clone <your-repo-url>
cd bull-board-monitor
```

2. **Cài đặt dependencies:**
```bash
yarn install
# hoặc
npm install
```

3. **Khởi động Redis server:**
```bash
# macOS với Homebrew
brew services start redis

# Ubuntu/Debian
sudo systemctl start redis-server

# Docker
docker run -d -p 6379:6379 redis:alpine
```

4. **Khởi động ứng dụng:**
```bash
# Development mode (với auto-reload)
yarn dev

# Production mode
yarn start
```

## Sử dụng

### Truy cập Bull Board UI

Mở trình duyệt và truy cập: `http://localhost:3000/admin/queues`

### API Endpoints

| Endpoint | Mô tả |
|----------|-------|
| `GET /` | Trang chủ với danh sách endpoints |
| `GET /admin/queues` | Bull Board UI |
| `GET /jobs/email` | Thêm email job mẫu |
| `GET /jobs/image` | Thêm image processing job mẫu |
| `GET /jobs/report` | Thêm report generation job mẫu |
| `GET /health` | Health check |

### Thêm Jobs

```bash
# Thêm email job
curl http://localhost:3000/jobs/email

# Thêm image processing job
curl http://localhost:3000/jobs/image

# Thêm report generation job
curl http://localhost:3000/jobs/report
```

## Cấu hình Redis

Sử dụng environment variables để cấu hình Redis:

```bash
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_PASSWORD=your_password
export PORT=3000
```

Hoặc tạo file `.env`:
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
PORT=3000
```

## Queues được monitor

### 1. Email Processing Queue
- **Tên**: `email processing`
- **Công việc**: Gửi email
- **Thời gian xử lý**: ~2 giây

### 2. Image Processing Queue  
- **Tên**: `image processing`
- **Công việc**: Resize, compress, watermark ảnh
- **Thời gian xử lý**: ~3 giây (1s/operation)

### 3. Report Generation Queue
- **Tên**: `report generation` 
- **Công việc**: Tạo báo cáo PDF
- **Thời gian xử lý**: ~3 giây

## Tùy chỉnh

### Thêm Queue mới

```javascript
const newQueue = new Queue('new queue name', redisConfig);

// Thêm vào Bull Board
createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
    new BullAdapter(imageQueue), 
    new BullAdapter(reportQueue),
    new BullAdapter(newQueue), // Queue mới
  ],
  serverAdapter,
});

// Thêm processor
newQueue.process('job type', async (job) => {
  // Xử lý job
  return result;
});
```

### Tùy chỉnh UI

```javascript
createBullBoard({
  queues: [...],
  serverAdapter,
  options: {
    uiConfig: {
      boardTitle: 'Tên Board Tùy Chỉnh',
      boardLogo: {
        path: 'path/to/logo.png',
        width: '100px',
        height: '100px',
      },
      miscLinks: [
        { text: 'Link 1', url: '/link1' },
        { text: 'Link 2', url: '/link2' }
      ],
    },
  },
});
```

## Production Deployment

### Docker

Tạo `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

### PM2

```bash
npm install -g pm2
pm2 start index.js --name "bull-board-monitor"
pm2 startup
pm2 save
```

## Troubleshooting

### Redis Connection Error
- Kiểm tra Redis server đã khởi động
- Verify host/port/password configuration
- Kiểm tra firewall settings

### Jobs không hiển thị
- Đảm bảo job processors đã được định nghĩa
- Kiểm tra Redis connection
- Xem console logs để debug

### Performance Issues
- Monitor Redis memory usage
- Cân nhắc cleanup old jobs
- Scale workers nếu cần

## Tài liệu tham khảo

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [Bull Board Documentation](https://github.com/felixmosh/bull-board)
- [Redis Documentation](https://redis.io/documentation)

## License

MIT License 