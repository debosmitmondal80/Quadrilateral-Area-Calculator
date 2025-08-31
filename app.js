// Quadrilateral Area Calculator using Shoelace Formula
class QuadrilateralCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.hideResult(); // Start with result hidden
    }

    initializeElements() {
        // Input elements
        this.inputs = {
            x1: document.getElementById('x1'),
            y1: document.getElementById('y1'),
            x2: document.getElementById('x2'),
            y2: document.getElementById('y2'),
            x3: document.getElementById('x3'),
            y3: document.getElementById('y3'),
            x4: document.getElementById('x4'),
            y4: document.getElementById('y4')
        };

        // Button elements
        this.calculateBtn = document.getElementById('calculate-btn');
        this.clearBtn = document.getElementById('clear-btn');

        // Result elements
        this.resultContainer = document.getElementById('result');
        this.areaResult = document.getElementById('area-result');

        // Verify elements exist
        if (!this.resultContainer || !this.areaResult) {
            console.error('Result elements not found');
            return;
        }
    }

    bindEvents() {
        if (!this.calculateBtn || !this.clearBtn) {
            console.error('Button elements not found');
            return;
        }

        this.calculateBtn.addEventListener('click', () => {
            console.log('Calculate button clicked');
            this.calculateArea();
        });
        
        this.clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
            this.clearInputs();
        });

        // Allow Enter key to trigger calculation
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.calculateArea();
                    }
                });
            }
        });
    }

    validateInputs() {
        const values = {};
        const errors = [];

        // Check if all inputs have values
        for (const [key, input] of Object.entries(this.inputs)) {
            if (!input) {
                errors.push(`Input ${key} not found`);
                continue;
            }
            
            const value = input.value.trim();
            if (value === '') {
                errors.push(`${key} is required`);
            } else if (isNaN(value)) {
                errors.push(`${key} must be a valid number`);
            } else {
                values[key] = parseFloat(value);
            }
        }

        return { values, errors };
    }

    calculateShoelaceArea(coordinates) {
        const { x1, y1, x2, y2, x3, y3, x4, y4 } = coordinates;

        // Shoelace formula for quadrilateral
        // A = (1/2) × |[(x1y2 + x2y3 + x3y4 + x4y1) – (x2y1 + x3y2 + x4y3 + x1y4)]|
        const sum1 = (x1 * y2) + (x2 * y3) + (x3 * y4) + (x4 * y1);
        const sum2 = (x2 * y1) + (x3 * y2) + (x4 * y3) + (x1 * y4);
        
        const area = Math.abs(sum1 - sum2) / 2;
        console.log('Calculated area:', area);
        return area;
    }

    calculateArea() {
        console.log('Starting calculation...');
        const { values, errors } = this.validateInputs();

        if (errors.length > 0) {
            console.log('Validation errors:', errors);
            this.showError('Please fill in all coordinate fields with valid numbers.');
            return;
        }

        try {
            console.log('Input values:', values);
            const area = this.calculateShoelaceArea(values);
            this.showResult(area);
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('Error calculating area. Please check your coordinates.');
        }
    }

    showResult(area) {
        console.log('Showing result:', area);
        if (!this.areaResult || !this.resultContainer) {
            console.error('Result elements not available');
            return;
        }

        this.areaResult.textContent = `Area = ${area.toFixed(4)} square units`;
        this.areaResult.style.color = 'var(--color-primary)';
        
        // Show the result container
        this.resultContainer.style.display = 'block';
        this.resultContainer.classList.remove('hidden');
        
        console.log('Result displayed');
        
        // Scroll to result on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                this.resultContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    }

    showError(message) {
        console.log('Showing error:', message);
        if (!this.areaResult || !this.resultContainer) {
            console.error('Result elements not available for error');
            return;
        }

        this.areaResult.textContent = message;
        this.areaResult.style.color = 'var(--color-error)';
        
        // Show the result container
        this.resultContainer.style.display = 'block';
        this.resultContainer.classList.remove('hidden');
        
        // Reset color after a delay
        setTimeout(() => {
            this.areaResult.style.color = 'var(--color-primary)';
        }, 3000);
    }

    hideResult() {
        if (!this.resultContainer) {
            console.error('Result container not available for hiding');
            return;
        }
        
        this.resultContainer.style.display = 'none';
        this.resultContainer.classList.add('hidden');
        console.log('Result hidden');
    }

    clearInputs() {
        console.log('Clearing inputs');
        // Clear all input fields
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.value = '';
            }
        });

        // Hide result
        this.hideResult();
        
        // Focus on first input for better UX
        if (this.inputs.x1) {
            this.inputs.x1.focus();
        }
    }

    // Utility method to load example coordinates for testing
    loadExample(type = 'square') {
        const examples = {
            square: { x1: 0, y1: 0, x2: 2, y2: 0, x3: 2, y3: 2, x4: 0, y4: 2 },
            rectangle: { x1: 0, y1: 0, x2: 3, y2: 0, x3: 3, y3: 2, x4: 0, y4: 2 }
        };

        const coords = examples[type];
        if (coords) {
            Object.entries(coords).forEach(([key, value]) => {
                if (this.inputs[key]) {
                    this.inputs[key].value = value;
                }
            });
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing calculator');
    window.calculator = new QuadrilateralCalculator();
});

// Prevent zoom on input focus for iOS
document.addEventListener('touchstart', {});

// Handle viewport changes for mobile
window.addEventListener('resize', () => {
    // Force viewport recalculation on orientation change
    if (window.innerHeight < window.innerWidth && window.innerHeight < 500) {
        document.body.style.minHeight = window.innerHeight + 'px';
    } else {
        document.body.style.minHeight = '100vh';
    }
});