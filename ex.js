function addTemplate(templateName) {
    const contentArea = document.getElementById('content-area');
    document.getElementById('page-title').textContent = templateName.charAt(0).toUpperCase() + templateName.slice(1) + ' Tracker';

    // Load the appropriate template based on the templateName
    fetch(templateName + '.html')
        .then(response => response.text())
        .then(html => {
            contentArea.innerHTML = html;
            // Execute any scripts that were in the loaded HTML
            Array.from(contentArea.querySelectorAll('script')).forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        })
        .catch(error => {
            console.error('Error loading template:', error);
            contentArea.innerHTML = '<h2>Error loading template</h2>';
        });
}