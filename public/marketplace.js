const API_URL = 'http://localhost:5000/api';

let currentPage = 'marketplace';

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
  }
}

checkAuth();

// Load items on page load
document.addEventListener('DOMContentLoaded', () => {
  loadItems();
});

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };
}

async function loadItems(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.sellerType) params.append('sellerType', filters.sellerType);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await fetch(`${API_URL}/items?${params}`);
    const items = await response.json();

    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No items found</p>';
      return;
    }

    items.forEach(item => {
      const card = createItemCard(item);
      container.appendChild(card);
    });
  } catch (error) {
    showMessage('Error loading items: ' + error.message, 'error');
  }
}

function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.onclick = () => showItemDetails(item);

  const getItemIcon = (category) => {
    const icons = {
      'Electronics': '📱',
      'Art': '🎨',
      'Furniture': '🛋️',
      'Collectibles': '🏆',
      'Other': '📦',
    };
    return icons[category] || '📦';
  };

  card.innerHTML = `
    <div class="item-image">${getItemIcon(item.category)}</div>
    <div class="item-info">
      <div class="item-title">${item.title}</div>
      <div class="item-price">$${item.price.toFixed(2)}</div>
      <span class="item-category">${item.category}</span>
      <span class="item-type">${item.sellerType}</span>
      <div class="item-seller">By: ${item.seller.username}</div>
    </div>
  `;

  return card;
}

function showItemDetails(item) {
  const modal = document.getElementById('itemDetailsModal');
  const content = document.getElementById('itemDetailsContent');

  let detailsHTML = `
    <h2>${item.title}</h2>
    <div style="margin: 20px 0;">
      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Condition:</strong> ${item.condition}</p>
      <p><strong>Seller:</strong> ${item.seller.fullName} (@${item.seller.username})</p>
      <p><strong>Type:</strong> ${item.sellerType}</p>
  `;

  if (item.sellerType === 'Auction') {
    const endTime = new Date(item.auctionEndTime);
    detailsHTML += `
      <p><strong>Current Bid:</strong> $${(item.currentBid || item.price).toFixed(2)}</p>
      <p><strong>Auction Ends:</strong> ${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}</p>
      <div class="input-group">
        <input type="number" id="bidAmount" placeholder="Your bid amount" min="${(item.currentBid || item.price) + 0.01}" step="0.01">
        <button onclick="placeBid('${item._id}')" class="btn-primary">Place Bid</button>
      </div>
    `;
  }

  detailsHTML += `</div>`;
  content.innerHTML = detailsHTML;
  modal.classList.add('show');
}

function closeItemDetails() {
  document.getElementById('itemDetailsModal').classList.remove('show');
}

async function placeBid(itemId) {
  const bidAmount = parseFloat(document.getElementById('bidAmount').value);
  
  if (!bidAmount || bidAmount <= 0) {
    showMessage('Please enter a valid bid amount', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/items/${itemId}/bid`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bidAmount }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Error placing bid', 'error');
      return;
    }

    showMessage('Bid placed successfully!', 'success');
    closeItemDetails();
    loadItems();
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
}

function applyFilters() {
  const filters = {
    search: document.getElementById('searchInput').value,
    category: document.getElementById('categoryFilter').value,
    sellerType: document.getElementById('typeFilter').value,
    sortBy: document.getElementById('sortFilter').value,
  };
  loadItems(filters);
}

function showCreateItemForm() {
  document.getElementById('createItemModal').classList.add('show');
}

function closeCreateItemForm() {
  document.getElementById('createItemModal').classList.remove('show');
  document.getElementById('createItemForm').reset();
}

function toggleAuctionTime() {
  const sellerType = document.getElementById('itemSellerType').value;
  const auctionGroup = document.getElementById('auctionTimeGroup');
  auctionGroup.style.display = sellerType === 'Auction' ? 'block' : 'none';
}

async function createItem(e) {
  e.preventDefault();

  const itemData = {
    title: document.getElementById('itemTitle').value,
    description: document.getElementById('itemDescription').value,
    category: document.getElementById('itemCategory').value,
    price: parseFloat(document.getElementById('itemPrice').value),
    sellerType: document.getElementById('itemSellerType').value,
    condition: document.getElementById('itemCondition').value,
    image: '',
  };

  if (itemData.sellerType === 'Auction') {
    itemData.auctionEndTime = document.getElementById('itemAuctionEndTime').value;
  }

  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Error creating item', 'error');
      return;
    }

    showMessage('Item listed successfully!', 'success');
    closeCreateItemForm();
    loadItems();
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
}

function showMessage(message, type) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  setTimeout(() => {
    messageBox.className = 'message-box';
  }, 5000);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}
