// Quadrilateral Area Calculator JavaScript

class QuadrilateralCalculator {
    constructor() {
        this.form = document.getElementById('calculatorForm');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultDiv = document.getElementById('result');
        this.errorDiv = document.getElementById('errorMessage');
        this.exampleBtns = document.querySelectorAll('.example-btn');
        
        console.log('Calculator elements found:', {
            form: !!this.form,
            clearBtn: !!this.clearBtn,
            resultDiv: !!this.resultDiv,
            errorDiv: !!this.errorDiv,
            exampleBtns: this.exampleBtns.length
        });
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted, calculating area...');
                this.calculateArea();
            });
        }

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                console.log('Clear button clicked');
                this.clearForm();
            });
        }

        // Example buttons
        this.exampleBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                console.log('Example button clicked:', index);
                const coords = e.target.getAttribute('data-coords');
                if (coords) {
                    const coordsArray = coords.split(',');
                    console.log('Loading coordinates:', coordsArray);
                    this.loadExample(coordsArray);
                } else {
                    console.error('No data-coords attribute found');
                }
            });
        });

        // Input validation on change
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.hideMessages();
            });
        });
    }

    validateInputs() {
        const inputIds = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'];
        const values = {};
        let isValid = true;
        let errorMessage = '';

        for (let i = 0; i < inputIds.length; i++) {
            const inputId = inputIds[i];
            const input = document.getElementById(inputId);
            
            if (!input) {
                console.error('Input not found:', inputId);
                continue;
            }
            
            const value = input.value.trim();
            
            if (value === '') {
                isValid = false;
                errorMessage = 'Please fill in all coordinate fields.';
                input.classList.add('error');
                console.log('Empty field found:', inputId);
            } else if (isNaN(parseFloat(value))) {
                isValid = false;
                errorMessage = 'Please enter valid numbers for all coordinates.';
                input.classList.add('error');
                console.log('Invalid number in field:', inputId, value);
            } else {
                input.classList.remove('error');
                values[inputId] = parseFloat(value);
                console.log('Valid value for', inputId, ':', values[inputId]);
            }
        }

        console.log('Validation result:', { isValid, values, errorMessage });
        return { isValid, values, errorMessage };
    }

    calculateArea() {
        console.log('Starting calculation...');
        this.hideMessages();
        
        // Add loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Calculating...';
        submitBtn.disabled = true;

        // Validate inputs
        const validation = this.validateInputs();
        
        if (!validation.isValid) {
            console.log('Validation failed:', validation.errorMessage);
            this.showError(validation.errorMessage);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        const { x1, y1, x2, y2, x3, y3, x4, y4 } = validation.values;
        console.log('Coordinates for calculation:', { x1, y1, x2, y2, x3, y3, x4, y4 });

        try {
            // Apply Shoelace formula: A = (1/2) × [(x1y2 + x2y3 + x3y4 + x4y1) – (x2y1 + x3y2 + x4y3 + x1y4)]
            const positiveTerms = (x1 * y2) + (x2 * y3) + (x3 * y4) + (x4 * y1);
            const negativeTerms = (x2 * y1) + (x3 * y2) + (x4 * y3) + (x1 * y4);
            const area = Math.abs(0.5 * (positiveTerms - negativeTerms));
            
            console.log('Calculation details:', {
                positiveTerms,
                negativeTerms,
                difference: positiveTerms - negativeTerms,
                area
            });

            this.showResult(area, validation.values);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('An error occurred while calculating the area. Please check your inputs.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showResult(area, coordinates) {
        console.log('Showing result:', area);
        const { x1, y1, x2, y2, x3, y3, x4, y4 } = coordinates;
        
        if (!this.resultDiv) {
            console.error('Result div not found');
            return;
        }
        
        this.resultDiv.innerHTML = `
            <div>
                <strong>Area of Quadrilateral</strong>
                <span class="result-value">${area.toFixed(2)} square units</span>
            </div>
            <div style="margin-top: var(--space-12); font-size: var(--font-size-sm); opacity: 0.8;">
                Points: (${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3}), (${x4}, ${y4})
            </div>
        `;
        
        this.resultDiv.classList.remove('hidden');
        this.resultDiv.classList.add('show');
        
        console.log('Result displayed successfully');
        
        // Scroll to result
        setTimeout(() => {
            this.resultDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    showError(message) {
        console.log('Showing error:', message);
        
        if (!this.errorDiv) {
            console.error('Error div not found');
            return;
        }
        
        this.errorDiv.textContent = message;
        this.errorDiv.classList.remove('hidden');
        
        console.log('Error displayed successfully');
        
        // Scroll to error
        setTimeout(() => {
            this.errorDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    hideMessages() {
        if (this.resultDiv) {
            this.resultDiv.classList.add('hidden');
            this.resultDiv.classList.remove('show');
        }
        if (this.errorDiv) {
            this.errorDiv.classList.add('hidden');
        }
        
        // Remove error styling from inputs
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    clearForm() {
        console.log('Clearing form...');
        // Reset all input fields
        const inputIds = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'];
        
        inputIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
                input.classList.remove('error');
            }
        });
        
        // Hide messages
        this.hideMessages();
        
        // Focus on first input
        const firstInput = document.getElementById('x1');
        if (firstInput) {
            firstInput.focus();
        }
        
        console.log('Form cleared successfully');
    }

    loadExample(coords) {
        console.log('Loading example with coords:', coords);
        
        if (coords.length !== 8) {
            console.error('Invalid coordinates data - expected 8 values, got:', coords.length);
            return;
        }

        const inputIds = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'];
        
        // Hide any existing messages first
        this.hideMessages();
        
        coords.forEach((value, index) => {
            const inputId = inputIds[index];
            const input = document.getElementById(inputId);
            if (input) {
                const numValue = parseFloat(value);
                input.value = numValue.toString();
                input.classList.remove('error');
                console.log(`Set ${inputId} = ${numValue}`);
            } else {
                console.error('Input not found:', inputId);
            }
        });

        // Add visual feedback
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
            input.style.transition = 'background-color 0.3s ease';
        });
        
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.backgroundColor = '';
            });
        }, 1000);

        console.log('Example loaded successfully');
    }
}

// Additional CSS for error states and animations
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: var(--color-error) !important;
            background-color: rgba(var(--color-error-rgb), 0.05) !important;
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1) !important;
        }
        
        .form-control.error:focus {
            border-color: var(--color-error) !important;
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.2) !important;
        }
        
        .result.show {
            animation: slideIn 0.4s var(--ease-standard);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing calculator...');
    addDynamicStyles();
    
    // Initialize immediately
    try {
        window.calculator = new QuadrilateralCalculator();
        console.log('Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize calculator:', error);
    }
});

// Enhanced input handling
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    console.log('Setting up input handlers for', inputs.length, 'inputs');
    
    inputs.forEach((input, index) => {
        // Auto-select content on focus
        input.addEventListener('focus', (e) => {
            e.target.select();
        });
        
        // Allow Enter to move to next field or submit
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                } else {
                    // If last input, trigger calculation
                    const form = document.getElementById('calculatorForm');
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn && !submitBtn.disabled) {
                        submitBtn.click();
                    }
                }
            }
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to clear form
    if (e.key === 'Escape') {
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.click();
        }
    }
});

// Debug function
window.debugCalculator = function() {
    console.log('Calculator debug info:');
    console.log('Calculator instance:', window.calculator);
    console.log('Form element:', document.getElementById('calculatorForm'));
    console.log('Result div:', document.getElementById('result'));
    console.log('Error div:', document.getElementById('errorMessage'));
    console.log('Example buttons:', document.querySelectorAll('.example-btn'));
};