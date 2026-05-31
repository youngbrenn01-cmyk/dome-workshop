# Dome Workshop

## Overview
Dome Workshop is a comprehensive e-commerce platform that allows users to buy, auction, and trade items. The application features a beautiful, responsive design with three main landing pages: Login, Marketplace, and About Us.

## Features

### 1. **Authentication (Login Page)**
   - User registration with validation
   - User login with JWT tokens
   - Forgot password functionality
   - Password reset capability
   - Beautiful, modern UI with gradient backgrounds and decorative shapes

### 2. **Marketplace (Shopping Page)**
   - Browse all available items
   - Search items by keyword
   - Filter by category (Electronics, Art, Furniture, Collectibles, Other)
   - Filter by transaction type (Buy, Auction, Trade)
   - Sort by price and date
   - List new items for sale
   - Place bids on auction items
   - View item details
   - Real-time bidding system

### 3. **About Us Page**
   - Company mission statement
   - Feature overview
   - Benefits list
   - Contact information
   - Team description
   - Feature cards with icons

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication token
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **JavaScript (Vanilla)** - Interactivity
- **Responsive Design** - Mobile-friendly

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/youngbrenn01-cmyk/dome-workshop.git
   cd dome-workshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and JWT secret

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
dome-workshop/
├── models/
│   ├── User.js           # User schema and model
│   └── Item.js           # Item schema and model
├── routes/
│   ├── auth.js           # Authentication routes
│   └── items.js          # Item routes
├── public/
│   ├── index.html        # Login page
│   ├── marketplace.html  # Marketplace page
│   ├── about.html        # About us page
│   ├── styles.css        # Main stylesheet
│   ├── auth.js           # Auth functionality
│   └── marketplace.js    # Marketplace functionality
├── server.js             # Express server
├── package.json          # Dependencies
└── .env.example          # Environment variables template
```

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  createdAt: Date,
  resetToken: String,
  resetTokenExpiry: Date
}
```

### Item Model
```javascript
{
  title: String,
  description: String,
  category: String (Electronics, Art, Furniture, Collectibles, Other),
  price: Number,
  sellerType: String (Buy, Auction, Trade),
  seller: ObjectId (ref: User),
  image: String,
  condition: String (New, Like New, Good, Fair),
  auctionEndTime: Date,
  currentBid: Number,
  bidders: Array of {user, bid, timestamp},
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (requires auth)

### Item Routes
- `GET /api/items` - Get all items with filters
- `GET /api/items/:id` - Get single item details
- `POST /api/items` - Create new item (requires auth)
- `PUT /api/items/:id` - Update item (requires auth)
- `DELETE /api/items/:id` - Delete item (requires auth)
- `POST /api/items/:id/bid` - Place bid on auction (requires auth)

## Usage

### Creating an Account
1. Click "Create Account" on the login page
2. Fill in your details
3. Click "Create Account"
4. You'll be redirected to the marketplace

### Logging In
1. Enter your email and password
2. Click "Login"
3. Access the marketplace

### Listing an Item
1. Click "+ Sell Item" on the marketplace
2. Fill in item details
3. Choose transaction type (Buy, Auction, Trade)
4. For auctions, set end time
5. Click "List Item"

### Buying/Bidding
1. Click on an item card to view details
2. For regular purchases, contact the seller
3. For auctions, enter bid amount and click "Place Bid"

### Searching and Filtering
1. Use search bar to find items by name
2. Filter by category
3. Filter by transaction type
4. Sort by price or date
5. Click "Search" to apply filters

## Design Features

### Visual Design
- **Gradient backgrounds** - Purple to violet gradients
- **Smooth animations** - Transitions and slide-ins
- **Responsive layout** - Works on all screen sizes
- **Card-based UI** - Clean, organized presentation
- **Interactive hover effects** - Enhanced user experience
- **Decorative shapes** - Geometric elements for visual appeal

### User Experience
- **Intuitive navigation** - Easy to find features
- **Form validation** - Client-side validation with feedback
- **Loading states** - User feedback on actions
- **Error messages** - Clear error communication
- **Success messages** - Confirmation of actions

## Security Features

- **Password hashing** with bcryptjs
- **JWT authentication** for API protection
- **Input validation** with express-validator
- **CORS enabled** for safe cross-origin requests
- **Secure token management** in localStorage

## Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] User reviews and ratings
- [ ] Real-time notifications with WebSocket
- [ ] Image upload functionality
- [ ] Transaction history
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Social features (following, messaging)
- [ ] Two-factor authentication

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
