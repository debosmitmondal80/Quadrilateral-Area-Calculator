// Quadrilateral Area Calculator using Shoelace Formula
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Quadrilateral Area Calculator...');
    
    // Get DOM elements
    const form = document.getElementById('calculatorForm');
    const resultDiv = document.getElementById('result');
    const clearBtn = document.getElementById('clearBtn');
    const squareExampleBtn = document.getElementById('squareExample');
    const rectangleExampleBtn = document.getElementById('rectangleExample');
    
    // Verify elements exist
    if (!form || !resultDiv) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form submitted');
        
        try {
            const coordinates = getCoordinates();
            console.log('Coordinates:', coordinates);
            
            const result = calculateArea(coordinates);
            console.log('Calculation result:', result);
            
            displayResult(result, coordinates);
        } catch (error) {
            console.error('Calculation error:', error);
            displayError(error.message);
        }
    });
    
    // Clear button handler
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            console.log('Clear button clicked');
            clearAllInputs();
        });
    }
    
    // Square example button handler
    if (squareExampleBtn) {
        squareExampleBtn.addEventListener('click', function() {
            console.log('Square example button clicked');
            loadSquareExample();
        });
    }
    
    // Rectangle example button handler  
    if (rectangleExampleBtn) {
        rectangleExampleBtn.addEventListener('click', function() {
            console.log('Rectangle example button clicked');
            loadRectangleExample();
        });
    }
    
    // Get coordinates from form inputs
    function getCoordinates() {
        const coords = {};
        const coordIds = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'];
        
        for (const id of coordIds) {
            const input = document.getElementById(id);
            if (!input) {
                throw new Error(`Input field ${id} not found`);
            }
            
            const value = input.value.trim();
            
            if (value === '') {
                throw new Error(`Please enter a value for ${id.toUpperCase()}`);
            }
            
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                throw new Error(`Please enter a valid number for ${id.toUpperCase()}`);
            }
            
            coords[id] = numValue;
        }
        
        return coords;
    }
    
    // Calculate area using Shoelace formula
    function calculateArea(coords) {
        const { x1, y1, x2, y2, x3, y3, x4, y4 } = coords;
        
        // Shoelace formula: A = (1/2) * |[(x1y2 + x2y3 + x3y4 + x4y1) - (x2y1 + x3y2 + x4y3 + x1y4)]|
        const positive = (x1 * y2) + (x2 * y3) + (x3 * y4) + (x4 * y1);
        const negative = (x2 * y1) + (x3 * y2) + (x4 * y3) + (x1 * y4);
        const area = Math.abs(positive - negative) / 2;
        
        return {
            area: area,
            positive: positive,
            negative: negative
        };
    }
    
    // Display successful result
    function displayResult(result, coordinates) {
        const { area, positive, negative } = result;
        
        resultDiv.innerHTML = `
            <div class="result-success">
                <h3>Area Calculated Successfully!</h3>
                <div class="area-value">${area.toFixed(4)} square units</div>
                <p><strong>Coordinates used:</strong></p>
                <p>Point 1: (${coordinates.x1}, ${coordinates.y1})</p>
                <p>Point 2: (${coordinates.x2}, ${coordinates.y2})</p>
                <p>Point 3: (${coordinates.x3}, ${coordinates.y3})</p>
                <p>Point 4: (${coordinates.x4}, ${coordinates.y4})</p>
                
                <div class="calculation-details">
                    <strong>Calculation Steps:</strong><br>
                    Positive sum: (${coordinates.x1}×${coordinates.y2}) + (${coordinates.x2}×${coordinates.y3}) + (${coordinates.x3}×${coordinates.y4}) + (${coordinates.x4}×${coordinates.y1}) = ${positive.toFixed(4)}<br>
                    Negative sum: (${coordinates.x2}×${coordinates.y1}) + (${coordinates.x3}×${coordinates.y2}) + (${coordinates.x4}×${coordinates.y3}) + (${coordinates.x1}×${coordinates.y4}) = ${negative.toFixed(4)}<br>
                    Difference: |${positive.toFixed(4)} - ${negative.toFixed(4)}| = ${Math.abs(positive - negative).toFixed(4)}<br>
                    Final area: ${Math.abs(positive - negative).toFixed(4)} ÷ 2 = ${area.toFixed(4)}
                </div>
            </div>
        `;

        // Scroll to result on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
    
    // Display error message
    function displayError(message) {
        resultDiv.innerHTML = `
            <div class="result-error">
                <h3>Error</h3>
                <p>${message}</p>
                <p>Please check your inputs and try again.</p>
            </div>
        `;

        // Scroll to result on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
    
    // Clear all input fields
    function clearAllInputs() {
        const coordIds = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'];
        
        coordIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
                input.style.borderColor = '';
                input.removeAttribute('aria-invalid');
            }
        });

        // Reset result display
        resultDiv.innerHTML = `
            <p class="result-placeholder">Enter coordinates and click "Calculate Area" to see the result</p>
        `;

        // Focus on first input
        const firstInput = document.getElementById('x1');
        if (firstInput) {
            firstInput.focus();
        }
    }
    
    // Load square example
    function loadSquareExample() {
        const squareCoords = {
            x1: 0, y1: 0,
            x2: 2, y2: 0,
            x3: 2, y3: 2,
            x4: 0, y4: 2
        };
        
        setCoordinates(squareCoords);
        
        // Automatically calculate after setting coordinates
        setTimeout(() => {
            try {
                const result = calculateArea(squareCoords);
                displayResult(result, squareCoords);
            } catch (error) {
                displayError(error.message);
            }
        }, 100);
    }
    
    // Load rectangle example
    function loadRectangleExample() {
        const rectangleCoords = {
            x1: 0, y1: 0,
            x2: 3, y2: 0,
            x3: 3, y3: 2,
            x4: 0, y4: 2
        };
        
        setCoordinates(rectangleCoords);
        
        // Automatically calculate after setting coordinates
        setTimeout(() => {
            try {
                const result = calculateArea(rectangleCoords);
                displayResult(result, rectangleCoords);
            } catch (error) {
                displayError(error.message);
            }
        }, 100);
    }
    
    // Set coordinate values in input fields
    function setCoordinates(coords) {
        Object.keys(coords).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = coords[key];
                input.style.borderColor = '';
                input.removeAttribute('aria-invalid');
            }
        });
    }
    
    // Add input validation
    function addInputValidation() {
        const inputs = document.querySelectorAll('input[type="number"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && isNaN(parseFloat(value))) {
                    this.style.borderColor = 'var(--color-error)';
                    this.setAttribute('aria-invalid', 'true');
                } else {
                    this.style.borderColor = '';
                    this.removeAttribute('aria-invalid');
                }
            });

            input.addEventListener('focus', function() {
                if (!this.hasAttribute('aria-invalid')) {
                    this.style.borderColor = 'var(--color-primary)';
                }
            });

            input.addEventListener('blur', function() {
                if (!this.hasAttribute('aria-invalid')) {
                    this.style.borderColor = '';
                }
            });
        });
    }
    
    // Add keyboard navigation
    function addKeyboardNavigation() {
        const inputs = document.querySelectorAll('input[type="number"]');
        
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    if (index < inputs.length - 1) {
                        // Move to next input
                        inputs[index + 1].focus();
                        inputs[index + 1].select();
                    } else {
                        // Last input, try to submit form
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            });
        });
    }
    
    // Add loading state to submit button
    function addLoadingState() {
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            form.addEventListener('submit', function() {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Calculating...';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Calculate Area';
                }, 500);
            });
        }
    }
    
    // Initialize all features
    addInputValidation();
    addKeyboardNavigation();
    addLoadingState();
    
    console.log('Quadrilateral Area Calculator initialized successfully');
});