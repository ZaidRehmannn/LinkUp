# 🌐 LinkUp  

## 📌 Project Description  
LinkUp is a modern **social media platform** designed to connect people through posts, interactions, and real-time conversations. Users can share their thoughts via **text, images, or videos**, engage with others through **likes, comments, and follows**, and discover new connections seamlessly.  

The app also includes a **real-time chat system** powered by **Socket.IO**, enabling one-to-one conversations with instant updates. Notifications keep users informed about likes, comments, and follows, while the chat list dynamically shows unread messages and activity.  

With a clean UI, responsive design, **dark mode**, and smooth user experience, LinkUp brings together the best features of a social platform into one integrated app.  

---

## ✅ Features & Functionalities  

### 👤 User Authentication  
- Secure sign-up and login with **JWT** and **bcrypt**  
- Token storage in **localStorage** for authentication  

### 📝 Posts & Media Sharing  
- Create posts with text, images, or videos  
- Upload and store media via **Cloudinary**  
- View feed with posts from followed users  

### ❤️ Social Interactions  
- Like and comment on posts  
- Follow and unfollow users  
- Real-time notifications for likes, comments, and follows  

### 💬 One-to-One Chat  
- Real-time private messaging with **Socket.IO**  
- Unread message indicators in the chat list  
- Dynamic chat list highlighting for new conversations  

### 🔔 Notifications  
- Real-time updates for social interactions (likes, comments, follows)  
- Chat notifications integrated in chat list with unread counts  

### 👥 Profile & Settings  
- User profile page with **About, Posts, Followers, and Following**  
- Profile settings to **edit user information** (e.g., name, bio, profile image)  

### 🌐 Explore & Connect  
- Discover and follow new users  
- Personalized feed based on connections  

### 🌓 Dark Mode  
- Built-in **dark mode toggle** for an improved user experience  

### 📱 Responsive UI  
- Modern, mobile-friendly interface  
- Built with **Next.js** and styled for seamless cross-device usage  

---

## 🛠️ Tech Stack  

### 💻 Frontend  
- **Next.js** – React-based framework for SSR and modern frontend development  
- **Zustand** – Lightweight state management  
- **Tailwind CSS** – Utility-first CSS framework for responsive design  
- **Axios** – Promise-based HTTP client for API requests  

### 🖥️ Backend  
- **Node.js** – JavaScript runtime environment  
- **Express.js** – RESTful API framework  
- **MongoDB** – NoSQL database for user, posts, and chat data  
- **Mongoose** – Schema-based ODM for MongoDB  
- **Socket.IO** – Real-time communication for chat and notifications  

### 🔐 Authentication & Security  
- **JWT** – Token-based authentication  
- **bcrypt.js** – Password hashing  
- **dotenv** – Environment configuration  

### ☁️ Cloud Services  
- **Cloudinary** – Media (image & video) upload, storage, and optimization  

---

## 🚀 Live Demo  
Live Link: [LinkUp Live](https://link-up-frontend-fawn.vercel.app)  

---

## 👥 Demo Accounts  

To test the app without needing to create your own account, you can use the following demo accounts:

1. **Account 1:**
   - **Email:** liam.carter@demo.com
   - **Password:** password12345

2. **Account 2:**
   - **Email:** ethan.walker@demo.com
   - **Password:** password12345

3. **Account 3:**
   - **Email:** noah.bennett@demo.com
   - **Password:** password12345

Feel free to log in with any of these accounts to explore the features of the app!
---

## 🛠️ Installation  

### Prerequisites  
- **Node.js** (v18+)  
- **MongoDB** (local or cloud e.g., MongoDB Atlas)  
- **Cloudinary account** (for media uploads)  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/ZaidRehmannn/LinkUp.git
cd LinkUp
```

### 2️⃣ Backend Setup  
Navigate to the backend folder:  
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following variables:  
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the backend server:  
```bash
npm run server
```
Backend will run at: **http://localhost:8000**  

### 3️⃣ Frontend Setup  
Navigate to the frontend folder:  
```bash
cd ../web_frontend
npm install
npm run dev
```

Frontend will run at: **http://localhost:3000**  

---

✅ Now you’re all set! Open the frontend in your browser and explore LinkUp locally with full functionality.  
