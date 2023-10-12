document.addEventListener('DOMContentLoaded', () => {
    const createResourceForm = document.getElementById('createResourceForm');
    const resourceData = document.getElementById('resourceData');

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
                    value: valueInput.value
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
                resourceData.innerHTML = 'Failed to create a resource.';
            });

        keyInput.value = '';
        valueInput.value = '';
    });

    // Initial fetch of resource data
    fetchResourceData();
});
