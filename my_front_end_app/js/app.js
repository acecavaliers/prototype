document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for navigation
    
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.getAttribute('data-url');
            const text = e.target.textContent;
            if (url) {
                fetchData(url, text);
            }
        });
    });

    // Add event listeners for the create forms
    document.getElementById('component-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createComponent();
    });

    document.getElementById('supplier-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createSupplier();
    });

    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createProduct();
    });

    
    fetchData('http://localhost:5000/api/supplier', 'Supplier');
    fetchComponents(); 
    fetchSuppliers(); 
});

function formatId(id, length = 5) {
    return String(id).padStart(length, '0');
}

async function fetchData(url, type) {
    try {
        console.log(`Fetching data from ${url}...`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        console.log('Fetched data:', data);
        
        document.querySelector('h1').textContent = type;

        document.getElementById('create-component').style.display = (type === 'Components') ? 'block' : 'none';
        document.getElementById('create-supplier').style.display = (type === 'Supplier') ? 'block' : 'none';
        document.getElementById('create-product').style.display = (type === 'Product List') ? 'block' : 'none';
        
        if (type === 'Product List') {
            displayProducts(data);
        } else if (type === 'Components') {
            displayComponents(data);
        } else if (type === 'Supplier') {
            displaySuppliers(data);
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchComponents() {
    try {
        const response = await fetch('http://localhost:5000/api/component');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const components = await response.json();
        populateComponentCheckboxes(components);
    } catch (error) {
        console.error('Error fetching components:', error);
    }
}

function populateComponentCheckboxes(components) {
    const container = document.getElementById('component-checkboxes');
    container.innerHTML = ''; // Clear existing content

    components.forEach(component => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `component-${component.id}`;
        checkbox.name = 'components';
        checkbox.value = component.id;

        const label = document.createElement('label');
        label.htmlFor = `component-${component.id}`;
        label.textContent = component.name;

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br'));
    });
}

async function fetchSuppliers() {
    try {
        const response = await fetch('http://localhost:5000/api/supplier');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const suppliers = await response.json();
        populateSupplierCheckboxes(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
}

function populateSupplierCheckboxes(suppliers) {
    const supplierContainer = document.getElementById('supplier-checkboxes');
    supplierContainer.innerHTML = ''; // Clear existing content
    suppliers.forEach(supplier => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `supplier-${supplier.id}`;
        checkbox.name = 'suppliers';
        checkbox.value = supplier.id;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.innerText = supplier.name;

        supplierContainer.appendChild(checkbox);
        supplierContainer.appendChild(label);
        supplierContainer.appendChild(document.createElement('br'));
    });
}

async function createComponent() {
    const form = document.getElementById('component-form');
    const name = document.getElementById('component-name').value;
    const description = document.getElementById('component-description').value;
    const suppliers = Array.from(document.querySelectorAll('#supplier-checkboxes input:checked'))
                           .map(checkbox => checkbox.value);

    try {
        const response = await fetch('http://localhost:5000/api/component', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, suppliers })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('Component created successfully!');
        fetchData('http://localhost:5000/api/component', 'Components');

        form.reset();
        
        fetchComponents();
    } catch (error) {
        console.error('Error creating component:', error);
    }
}

async function createSupplier() {
    const form = document.getElementById('supplier-form');
    const name = document.getElementById('supplier-name').value;
    
    const type = document.getElementById('submit-supplier').textContent;                        
    const supplierId = document.getElementById('supplier-id').value;

    if(type === 'Update Supplier'){
        try {

            const response = await fetch(`http://localhost:5000/api/supplier/${supplierId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            console.log('Supplier updated successfully!');
    
            // Clear the form
            
            
        } catch (error) {
            console.error('Error creating supplier:', error);
        }

    }else{
        try {
            const response = await fetch('http://localhost:5000/api/supplier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            console.log('Supplier created successfully!');
        } catch (error) {
            console.error('Error creating supplier:', error);
        }
    }
    
    fetchData('http://localhost:5000/api/supplier', 'Supplier');
    document.getElementById('submit-supplier').textContent = "Create Supplier";
    form.reset();
    fetchSuppliers();

    
}


async function createProduct() {
    const form = document.getElementById('product-form');
    const name = document.getElementById('product-name').value;
    const quantity_on_hand = document.getElementById('product-quantity').value;
    const components = Array.from(document.querySelectorAll('#component-checkboxes input:checked'))
                            .map(checkbox => checkbox.value);
    const type = document.getElementById('submit-button').textContent;                        
    const productId = document.getElementById('product-id').value; 

    // Validation: Check if at least one component is selected
    if (components.length === 0) {
        document.getElementById('error-message').textContent = 'At least one component must be selected.';
        return; 
    }

    console.log(`Product ID: ${productId}`); 
    console.log(`Name: ${name}`);
    console.log(`Quantity on Hand: ${quantity_on_hand}`);
    console.log(`Components: ${components.join(', ')}`);

    try {
        let response;
        if (type !== 'Create Product') {
            // Update existing product
            console.log(`Updating product with ID: ${productId}`);
            response = await fetch(`http://localhost:5000/api/product/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, quantity_on_hand, components })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('Product updated successfully!');
        } else {
            // Create new product
            console.log('Creating new product');
            response = await fetch('http://localhost:5000/api/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, quantity_on_hand, components })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('Product created successfully!');
        }

        // Refresh the product list
        fetchData('http://localhost:5000/api/product', 'Product List');

        // Clear the form and reset button text
        form.reset();
        document.querySelectorAll('#component-checkboxes input').forEach(checkbox => checkbox.checked = false); // Uncheck all checkboxes
        document.getElementById('submit-button').textContent = "Create Product";
        document.getElementById('error-message').textContent = ''; // Clear error message
        document.getElementById('product-id').value = ''; // Clear the hidden product ID field
    } catch (error) {
        console.error('Error creating/updating product:', error);
    }
}



function displayProducts(products) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; 
    
    if (products && Array.isArray(products)) {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            
            const componentsList = (product.components && Array.isArray(product.components))
                ? product.components.map(component => `<p>${component.name}</p>`).join('')
                : '<p>No components available</p>';
            
            productDiv.innerHTML = `
                <h2>${product.name}</h2>
                <p>ProductId: ${formatId(product.id)}</p>
                <p>Quantity on hand: ${product.quantity_on_hand}</p>
                <h3>Components:</h3>                
                ${componentsList}
                <div>
                    <button class="edit-button" data-product-id="${product.id}">Edit</button>
                </div>
            `;

            container.appendChild(productDiv);
        });

        //edit buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const product = products.find(p => p.id == productId);
                populateEditForm(product);
            });
        });
    } else {
        console.warn('No products available or products is not an array');
    }
}

function populateEditForm(product) {
    if (!product) return;

    // Set product data to form
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-quantity').value = product.quantity_on_hand;
    document.getElementById('product-id').value =  product.id;
    document.getElementById('submit-button').textContent = "Update Product";
    // Clear all component checkboxes
    document.querySelectorAll('#component-checkboxes input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Disable the checkbox
    const componentCheckboxes = document.querySelectorAll('#component-checkboxes input[type="checkbox"]');
    componentCheckboxes.forEach(checkbox => {
        checkbox.disabled = true; 
    });

    // Check the components checkboxes that are in product.components
    if (product.components && Array.isArray(product.components)) {
        product.components.forEach(component => {
            const checkbox = document.querySelector(`#component-checkboxes input[value="${component.id}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('product-name').focus();
}



function displayComponents(components) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // Clear existing content

    if (components && Array.isArray(components)) {
        // Create a table and its header
        const table = document.createElement('table');
        table.className = 'component-table'; // Add a class for styling

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Create table header
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Supplied By</th>
                <th>Used in Products</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table rows
        components.forEach(component => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatId(component.id)}</td>
                <td>${component.name}</td>
                <td>${component.description || 'No description available'}</td>
                <td>${(component.suppliers && component.suppliers.length > 0) ? component.suppliers.map(supplier => supplier.name).join(', ') : 'No suppliers available'}</td>
                <td>${(component.products && component.products.length > 0) ? component.products.map(product => product.name).join(', ') : 'No products available'}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Append the table to the container
        container.appendChild(table);
    } else {
        console.warn('No components available or components is not an array');
    }
}

function formatId(id) {
    return id.toString().padStart(5, '0');
}


function displaySuppliers(suppliers) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; 
    
    if (suppliers && Array.isArray(suppliers)) {
        suppliers.forEach(supplier => {
            const supplierDiv = document.createElement('div');
            supplierDiv.className = 'product'; 
            
            supplierDiv.innerHTML = `
                <h2>${supplier.name}</h2>
                <p>SupplierId: ${formatId(supplier.id)}</p>
                <p>${supplier.createdAt}</p>
                <div>
                    <button class="edit-button-spl" data-supplier-id="${supplier.id}">Edit</button>
                </div>
            `;

            container.appendChild(supplierDiv);
        });
        
        document.querySelectorAll('.edit-button-spl').forEach(button => {
            button.addEventListener('click', (e) => {
                const supplierId = e.target.getAttribute('data-supplier-id');
                const supplier = suppliers.find(p => p.id == supplierId);
                populateSupplierEditForm(supplier);
            });
        });

    } else {
        console.warn('No suppliers available or suppliers is not an array');
    }
}

function populateSupplierEditForm(supplier) {
    if (!supplier) return;

    // Set supplier data to form
    document.getElementById('supplier-name').value = supplier.name;
    document.getElementById('supplier-id').value = supplier.id;
    document.getElementById('submit-supplier').textContent = "Update Supplier";

    // Optionally, scroll to the form or focus the first input field
    document.getElementById('supplier-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('supplier-name').focus();
}



