// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const createResourceForm = document.getElementById('createResourceForm');
    const resourceData = document.getElementById('resourceData');
    const deleteResourceForm = document.getElementById('deleteResourceForm');

    // Function to fetch and display resource data
    function fetchResourceData() {
        fetch('/api/resource', {
            method: 'GET',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            displayResourceData(data);
        })
        .catch((error) => {
            console.error('Error fetching resource data:', error);
            resourceData.innerHTML = 'Failed to fetch resource data.';
        });
    }

    // Function to display resource data
    function displayResourceData(data) {
        resourceData.innerHTML = ''; // Clear previous data

        if (Object.keys(data).length === 0) {
            resourceData.innerHTML = 'No resources available.';
        } else {
            const table = document.createElement('table');
            table.classList.add('table');
            const thead = table.createTHead();
            const row = thead.insertRow();
            const th1 = document.createElement('th');
            th1.innerHTML = 'Resource Key';
            const th2 = document.createElement('th');
            th2.innerHTML = 'Resource Value';
            row.appendChild(th1);
            row.appendChild(th2);

            const tbody = table.createTBody();
            for (const key in data) {
                const row = tbody.insertRow();
                const cell1 = row.insertCell(0);
                cell1.innerHTML = key;
                const cell2 = row.insertCell(1);
                cell2.innerHTML = data[key];
            }
            resourceData.appendChild(table);
        }
    }

    // Function to update the status message
    function updateStatusMessage(message, isSuccess = true) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.className = `alert ${isSuccess ? 'alert-success' : 'alert-danger'}`;
        statusMessage.textContent = message;
    }

    // Add an event listener to the Delete Resource button
    const deleteResourceButton = document.getElementById('deleteResourceButton');
    deleteResourceButton.addEventListener('click', (event) => {
        event.preventDefault();
        const deleteKeyInput = deleteResourceForm.querySelector('#deleteKey');
    
        fetch(`/api/resource/${deleteKeyInput.value}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Change to response.text() to handle non-JSON responses
        })
        .then((data) => {
            if (data === 'Resource deleted') {
                // After deleting the resource, fetch and display the updated data
                fetchResourceData();
                updateStatusMessage('Resource deleted successfully', true);
            } else {
                updateStatusMessage('Failed to delete the resource', false);
            }
        })
        .catch((error) => {
            console.error('Error deleting resource:', error);
            updateStatusMessage('Failed to delete the resource', false);
        });
    
        deleteKeyInput.value = '';
    });

    // Submit form to create a resource
    createResourceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const keyInput = createResourceForm.querySelector('#key');
        const valueInput = createResourceForm.querySelector('#value');

        fetch(`/api/resource/${keyInput.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: valueInput.value,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            // After creating a resource, fetch and display the updated data
            fetchResourceData();
        })
        .catch((error) => {
            console.error('Error creating resource:', error);
            updateStatusMessage('Failed to create a resource', false);
        });

        keyInput.value = '';
        valueInput.value = '';
    });

    // Initial fetch of resource data
    fetchResourceData();
});
