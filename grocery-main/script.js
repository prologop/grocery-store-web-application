// Define item structure
const items = JSON.parse(localStorage.getItem('items')) || [];
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const sales = JSON.parse(localStorage.getItem('sales')) || [];
const userDetails = JSON.parse(localStorage.getItem('userDetails')) || [];

function handlePaymentFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const address = document.getElementById('address').value;
    const pinCode = document.getElementById('pinCode').value;
    const contact = document.getElementById('contact').value;
    const paymentOption = document.getElementById('paymentOption').value;
    const date = new Date().toLocaleString();
    const amount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const user = {
        name,
        address,
        pinCode,
        contact,
        date,
        amount
    };

    userDetails.push(user);
    localStorage.setItem('userDetails', JSON.stringify(userDetails));

    const orderDate = new Date();
    const orderDateString = `${orderDate.getDate()} ${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}`;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 2);
    const deliveryDateString = `${deliveryDate.getDate()} ${deliveryDate.toLocaleString('default', { month: 'long' })} ${deliveryDate.getFullYear()}`;

    const orderDetails = `
        <h3>Order Summary</h3>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Order Placed Date & Time</th>
                    <th>Estimated Date of Delivery</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${name}</td>
                    <td>${address}</td>
                    <td>${orderDateString}</td>
                    <td>${deliveryDateString}</td>
                </tr>
            </tbody>
        </table>
    `;

    if (paymentOption === 'cod') {
        alert('Your order placed successfully!');
        document.getElementById('orderSummary').innerHTML = orderDetails;
        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
    } else if (paymentOption === 'upi') {
        document.getElementById('orderSummary').innerHTML = `
            <div class="alert alert-success mt-4" role="alert">
                Your total amount is ${amount}
            </div>
            <button class="btn btn-primary" onclick="placeOrder()">Place Order</button>
        `;
    }

    // Save order details for admin
    const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || [];
    customerDetails.push({
        name,
        address,
        pinCode,
        contact,
        orderDate: orderDateString,
        totalAmount: amount
    });
    localStorage.setItem('customerDetails', JSON.stringify(customerDetails));

    // Save sales record
    const salesRecord = {
        date: orderDateString,
        item: 'Total Order',
        quantity: cart.length,
        total: amount
    };
    sales.push(salesRecord);
    localStorage.setItem('sales', JSON.stringify(sales));
}

function placeOrder() {
    const name = document.getElementById('userName').value;
    const address = document.getElementById('address').value;
    const orderDate = new Date();
    const orderDateString = `${orderDate.getDate()} ${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}`;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 2);
    const deliveryDateString = `${deliveryDate.getDate()} ${deliveryDate.toLocaleString('default', { month: 'long' })} ${deliveryDate.getFullYear()}`;

    const orderDetails = `
        <h3>Order Summary</h3>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Order Placed Date & Time</th>
                    <th>Estimated Date of Delivery</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${name}</td>
                    <td>${address}</td>
                    <td>${orderDateString}</td>
                    <td>${deliveryDateString}</td>
                </tr>
            </tbody>
        </table>
    `;

    alert('Your order placed successfully!');
    document.getElementById('orderSummary').innerHTML = orderDetails;

    // Clear the cart
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display items in the client view
function displayItems() {
    const itemsTable = document.getElementById('itemsTable');
    itemsTable.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Items</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item =>`
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>
                        <button onclick="decreaseQuantity('${item.name}')">-</button>
                        <span id="${item.name}-quantity" class="space">0</span>
                        <button onclick="increaseQuantity('${item.name}')">+</button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

document.getElementById('addAllToCart').addEventListener('click', () => {
    items.forEach(item => {
        const quantity = parseInt(document.getElementById(`${item.name}-quantity`).textContent);
        if (quantity > 0) {
            const cartItem = cart.find(cartItem => cartItem.name === item.name);
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                cart.push({ ...item, quantity });
            }
            document.getElementById(`${item.name}-quantity`).textContent = 0;
        }
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cartIndicator').style.display = 'inline-block';
    alert('Items added to cart');
});

function increaseQuantity(itemName) {
    const quantityElement = document.getElementById(`${itemName}-quantity`);
    quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
}

function decreaseQuantity(itemName) {
    const quantityElement = document.getElementById(`${itemName}-quantity`);
    if (parseInt(quantityElement.textContent) > 0) {
        quantityElement.textContent = parseInt(quantityElement.textContent) - 1;
    }
}

function displayCart() {
    const cartDetails = document.getElementById('cartDetails');
    cartDetails.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price * item.quantity}</td>
                </tr>
                `).join('')}
                <tr>
                    <td colspan="3"><strong>Total Cost</strong></td>
                    <td><strong>${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</strong></td>
                </tr>
            </tbody>
        </table>
        <button class="btn btn-success" onclick="proceedToBuy()">Proceed to Buy</button>
        <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    `;
}

function proceedToBuy() {
    $('#cartModal').modal('hide');
    window.location.href = 'payment.html';
}

document.getElementById('cartBtn').addEventListener('click', () => {
    $('#cartModal').modal('show');
    displayCart();
});

document.getElementById('adminBtn').addEventListener('click', () => {
    $('#loginModal').modal('show');
});

// Admin panel functions
function showAddItemForm() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2>Add New Item</h2>
        <form onsubmit="addItem(event)">
            <div class="form-group">
                <label for="itemName">Item Name</label>
                <input type="text" class="form-control" id="itemName" required>
            </div>
            <div class="form-group">
                <label for="itemPrice">Item Price</label>
                <input type="text" class="form-control" id="itemPrice" required>
            </div>
            <div class="form-group">
                <label for="itemQuantity">Item Quantity</label>
                <input type="number" class="form-control" id="itemQuantity" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Item</button>
        </form>
    `;
}

function addItem(event) {
    event.preventDefault();
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);

    items.push({ name, price, quantity });
    localStorage.setItem('items', JSON.stringify(items));
    alert('Item added successfully');
    showAllItems();
}

function showAllItems() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2>All Items</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showEditItems() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2>Edit Items</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item, index) => `
                <tr>
                    <td><input type="text" class="form-control" id="editName${index}" value="${item.name}"></td>
                    <td><input type="text" class="form-control" id="editPrice${index}" value="${item.price}"></td>
                    <td><input type="number" class="form-control" id="editQuantity${index}" value="${item.quantity}"></td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        <button class="btn btn-primary mt-2" onclick="updateItems()">Update</button>
    `;
}

function updateItems() {
    items.forEach((item, index) => {
        item.name = document.getElementById(`editName${index}`).value;
        item.price = document.getElementById(`editPrice${index}`).value;
        item.quantity = parseInt(document.getElementById(`editQuantity${index}`).value);
    });
    localStorage.setItem('items', JSON.stringify(items));
    alert('Items updated successfully');
    showEditItems();
}

function showTotalSales() {
    const adminContent = document.getElementById('adminContent');

    // Function to format date
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} / ${month} / ${year}`;
    }

    // Group sales by date
    const salesByDate = sales.reduce((acc, sale) => {
        const saleDate = new Date(sale.date).toLocaleDateString(); // Normalize date to remove time
        if (!acc[saleDate]) {
            acc[saleDate] = [];
        }
        acc[saleDate].push(sale);
        return acc;
    }, {});

    const grandTotal = sales.reduce((total, sale) => total + sale.total, 0);

    adminContent.innerHTML = `
        <h2>Total Sales</h2>
        <table id="salesTable" class="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(salesByDate).map(date => `
                    <tr>
                        <td colspan="4"><strong>${formatDate(date)}</strong></td>
                    </tr>
                    ${salesByDate[date].map(sale => `
                        <tr>
                            <td></td>
                            <td>${sale.item}</td>
                            <td>${sale.quantity}</td>
                            <td>${sale.total}</td>
                        </tr>
                    `).join('')}
                `).join('')}
                <tr>
                    <td colspan="3"><strong>Grand Total</strong></td>
                    <td><strong>${grandTotal}</strong></td>
                </tr>
            </tbody>
        </table>
        <button class="btn btn-primary" onclick="exportToPDF()">Export to PDF</button>
        <button class="btn btn-primary" onclick="analyzeSales()">Analyze Sales</button>
        <button class="btn btn-danger" onclick="resetSales()">Reset</button>
    `;
}

// Function to analyze sales
function analyzeSales() {
    const adminContent = document.getElementById('adminContent');

    const salesByMonth = sales.reduce((acc, sale) => {
        const date = new Date(sale.date);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;

        if (!acc[monthYear]) {
            acc[monthYear] = { totalSales: 0, totalItems: 0, totalCustomers: 0 };
        }

        acc[monthYear].totalSales += sale.total;
        acc[monthYear].totalItems += sale.quantity;
        acc[monthYear].totalCustomers += 1;

        return acc;
    }, {});

    adminContent.innerHTML = `
        <h2>Sales Analysis</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Total Sales</th>
                    <th>Total Number of Items Sold</th>
                    <th>Total Number of Customers</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(salesByMonth).map(monthYear => `
                    <tr>
                        <td>${monthYear}</td>
                        <td>${salesByMonth[monthYear].totalSales}</td>
                        <td>${salesByMonth[monthYear].totalItems}</td>
                        <td>${salesByMonth[monthYear].totalCustomers}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Function to export table data as a pdf
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get the sales table element
    const salesTable = document.getElementById('salesTable');

    // Use html2canvas to convert the table to a canvas
    const canvas = await html2canvas(salesTable);

    // Get the image data from the canvas
    const imgData = canvas.toDataURL('image/png');

    // Calculate the width and height to fit the content
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const margin = 12.7; // 1 inch margin in mm
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = margin;

    // Add the image to the PDF with margins
    doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 2 * margin;

    // Handle multiple pages with margins
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 2 * margin;
    }

    // Save the PDF
    doc.save('TotalSales.pdf');
}

// Function to reset all sales records
function resetSales() {
    sales.length = 0;
    localStorage.setItem('sales', JSON.stringify(sales));
    alert('All sales records have been reset.');
    showTotalSales();
}

function showDeleteItems() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2>Delete Items</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item, index) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td><button class="btn btn-danger" onclick="deleteItem(${index})">Delete</button></td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        <button class="btn btn-danger mt-2" onclick="deleteAllItems()">Delete All Items</button>
    `;
}

function deleteItem(index) {
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    alert('Item deleted successfully');
    showDeleteItems();
}

function deleteAllItems() {
    items.length = 0;
    localStorage.setItem('items', JSON.stringify(items));
    alert('All items deleted successfully');
    showDeleteItems();
}

function showCustomerDetails() {
    const adminContent = document.getElementById('adminContent');
    const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || [];

    adminContent.innerHTML = `
        <h2>Customer Details</h2>
        <table class="table table-striped" id="customerTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Pin Code</th>
                    <th>Contact</th>
                    <th>Order Placed Date & Time</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${customerDetails.map(detail => `
                    <tr>
                        <td>${detail.name}</td>
                        <td>${detail.address}</td>
                        <td>${detail.pinCode}</td>
                        <td>${detail.contact}</td>
                        <td>${detail.orderDate}</td>
                        <td>${detail.totalAmount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <button class="btn btn-primary" onclick="exportCustomerDetails()">Export Details</button>
        <button class="btn btn-danger" onclick="resetCustomerDetails()">Reset</button>
    `;
}

async function exportCustomerDetails() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const customerTable = document.getElementById('customerTable');
    const canvas = await html2canvas(customerTable);
    const imgData = canvas.toDataURL('image/png');

    const pageWidth = 210;
    const pageHeight = 295;
    const margin = 12.7;
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = margin;
    doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 2 * margin;

    while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 2 * margin;
    }

    doc.save('CustomerDetails.pdf');
}

function resetCustomerDetails() {
    localStorage.setItem('customerDetails', JSON.stringify([]));
    alert('All customer details have been reset.');
    showCustomerDetails();
}

// Authentication for admin panel
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;
    if (adminUsername === 'Prathamesh' && adminPassword === '2405') {
        sessionStorage.setItem('isAdmin', 'true');
        $('#loginModal').modal('hide');
        document.body.style.overflow = 'auto';
        window.location.href = 'admin.html';
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        displayItems();
    }
    if (window.location.pathname.includes('admin.html')) {
        if (!sessionStorage.getItem('isAdmin')) {
            $('#loginModal').modal('show');
        } else {
            document.getElementById('loginModal').style.display = 'none';
        }
    }
});

// Payment form submission
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('payment.html')) {
        document.getElementById('paymentForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('userName').value;
            const address = document.getElementById('address').value;
            const pinCode = document.getElementById('pinCode').value;
            const contact = document.getElementById('contact').value;
            const paymentOption = document.getElementById('paymentOption').value;
            const date = new Date().toLocaleString();
            const amount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

            const user = {
                name,
                address,
                pinCode,
                contact,
                date,
                amount
            };

            userDetails.push(user);
            localStorage.setItem('userDetails', JSON.stringify(userDetails));

            const orderDate = new Date();
            const orderDateString = `${orderDate.getDate()} ${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}`;
            const deliveryDate = new Date(orderDate);
            deliveryDate.setDate(orderDate.getDate() + 2);
            const deliveryDateString = `${deliveryDate.getDate()} ${deliveryDate.toLocaleString('default', { month: 'long' })} ${deliveryDate.getFullYear()}`;

            const orderDetails = `
                <h3>Order Summary</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Order Placed Date & Time</th>
                            <th>Estimated Date of Delivery</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${name}</td>
                            <td>${address}</td>
                            <td>${orderDateString}</td>
                            <td>${deliveryDateString}</td>
                        </tr>
                    </tbody>
                </table>
            `;

            if (paymentOption === 'cod') {
                alert('Your order placed successfully!');
                document.getElementById('orderSummary').innerHTML = orderDetails;
                cart.length = 0;
                localStorage.setItem('cart', JSON.stringify(cart));
            } else if (paymentOption === 'upi') {
                document.getElementById('orderSummary').innerHTML = `
                    <div class="alert alert-success mt-4" role="alert">
                        Your total amount is ${amount}
                    </div>
                    <button class="btn btn-primary" onclick="placeOrder()">Place Order</button>
                `;
            }

            // Save order details for admin
            const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || [];
            customerDetails.push({
                name,
                address,
                pinCode,
                contact,
                orderDate: orderDateString,
                totalAmount: amount
            });
            localStorage.setItem('customerDetails', JSON.stringify(customerDetails));

            // Save sales record
            const salesRecord = {
                date: orderDateString,
                item: 'Total Order',
                quantity: cart.length,
                total: amount
            };
            sales.push(salesRecord);
            localStorage.setItem('sales', JSON.stringify(sales));
        });
    }
});

function placeOrder() {
    const name = document.getElementById('userName').value;
    const address = document.getElementById('address').value;
    const orderDate = new Date();
    const orderDateString = `${orderDate.getDate()} ${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}`;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 2);
    const deliveryDateString = `${deliveryDate.getDate()} ${deliveryDate.toLocaleString('default', { month: 'long' })} ${deliveryDate.getFullYear()}`;

    const orderDetails = `
        <h3>Order Summary</h3>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Order Placed Date & Time</th>
                    <th>Estimated Date of Delivery</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${name}</td>
                    <td>${address}</td>
                    <td>${orderDateString}</td>
                    <td>${deliveryDateString}</td>
                </tr>
            </tbody>
        </table>
    `;

    alert('Your order placed successfully!');
    document.getElementById('orderSummary').innerHTML = orderDetails;

    // Clear the cart
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display the cart items count as a green dot
function updateCartDot() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBtn = document.getElementById('cartBtn');
    if (cart.length > 0) {
        cartBtn.classList.add('dot');
    } else {
        cartBtn.classList.remove('dot');
    }
}

document.addEventListener('DOMContentLoaded', updateCartDot);
