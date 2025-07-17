// Mejoras de UI/UX para el dropdown y navegación por teclado
export class UIEnhancements {
  constructor() {
    this.dropdown = document.querySelector('.sh__dropdown');
    this.dropdownBtn = document.querySelector('.sh__dropdown--btn');
    this.dropdownList = document.querySelector('.sh__dropdown__list');
    this.dropdownItems = document.querySelectorAll('.sh__dropdown__list--item');
    this.isOpen = false;
    this.selectedIndex = 0;
    
    this.init();
  }

  init() {
    this.addEventListeners();
    this.addAriaSupport();
    this.addAnimationSupport();
  }

  addEventListeners() {
    // Click en el botón
    this.dropdownBtn.addEventListener('click', () => {
      this.toggleDropdown();
    });

    // Navegación por teclado
    this.dropdownBtn.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    // Click en items
    this.dropdownItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.selectItem(index);
      });
    });

    // Click fuera para cerrar
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Hover en items
    this.dropdownItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        this.highlightItem(index);
      });
    });
  }

  addAriaSupport() {
    this.dropdownBtn.setAttribute('aria-expanded', 'false');
    this.dropdownList.setAttribute('role', 'listbox');
    
    this.dropdownItems.forEach((item, index) => {
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '-1');
      item.setAttribute('id', `option-${index}`);
    });
  }

  addAnimationSupport() {
    // Añadir clases de transición
    this.dropdownList.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Añadir efecto de rebote al botón
    this.dropdownBtn.addEventListener('mousedown', () => {
      this.dropdownBtn.style.transform = 'scale(0.98)';
    });

    this.dropdownBtn.addEventListener('mouseup', () => {
      this.dropdownBtn.style.transform = 'scale(1)';
    });
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.isOpen = true;
    this.dropdownBtn.classList.add('toggled');
    this.dropdownList.classList.add('active');
    this.dropdownBtn.setAttribute('aria-expanded', 'true');
    
    // Focus en el primer item
    this.highlightItem(0);
    
    // Animación del chevron
    const chevron = this.dropdownBtn.querySelector('.chevron');
    if (chevron) {
      chevron.classList.add('toggled');
    }
  }

  closeDropdown() {
    this.isOpen = false;
    this.dropdownBtn.classList.remove('toggled');
    this.dropdownList.classList.remove('active');
    this.dropdownBtn.setAttribute('aria-expanded', 'false');
    
    // Animación del chevron
    const chevron = this.dropdownBtn.querySelector('.chevron');
    if (chevron) {
      chevron.classList.remove('toggled');
    }
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.isOpen) {
          this.selectItem(this.selectedIndex);
        } else {
          this.openDropdown();
        }
        break;
      case 'Escape':
        this.closeDropdown();
        this.dropdownBtn.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.dropdownItems.length - 1);
          this.highlightItem(this.selectedIndex);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this.isOpen) {
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
          this.highlightItem(this.selectedIndex);
        }
        break;
    }
  }

  highlightItem(index) {
    // Remover highlight anterior
    this.dropdownItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Añadir nuevo highlight
    if (this.dropdownItems[index]) {
      this.dropdownItems[index].classList.add('active');
      this.selectedIndex = index;
    }
  }

  selectItem(index) {
    const item = this.dropdownItems[index];
    if (item) {
      const value = item.dataset.value;
      const text = item.textContent.trim();
      
      // Actualizar el botón
      const defaultOption = this.dropdownBtn.querySelector('.sh__dropdown--defaultOption');
      if (defaultOption) {
        defaultOption.textContent = text;
      }
      
      // Disparar evento personalizado
      const event = new CustomEvent('dropdown-select', {
        detail: { value, text, index }
      });
      this.dropdown.dispatchEvent(event);
      
      // Cerrar dropdown
      this.closeDropdown();
      
      // Feedback visual con animación
      this.addSelectionFeedback();
    }
  }

  addSelectionFeedback() {
    // Añadir clase de success temporalmente
    this.dropdownBtn.classList.add('selected');
    
    setTimeout(() => {
      this.dropdownBtn.classList.remove('selected');
    }, 600);
  }
}

// Mejoras para formulario y validación
export class FormEnhancements {
  constructor() {
    this.filenameInput = document.getElementById('filename');
    this.recordBtn = document.getElementById('start');
    
    this.init();
  }

  init() {
    this.addInputEnhancements();
    this.addValidation();
  }

  addInputEnhancements() {
    // Placeholder animado
    this.filenameInput.addEventListener('focus', () => {
      this.filenameInput.parentElement.classList.add('focused');
    });

    this.filenameInput.addEventListener('blur', () => {
      if (!this.filenameInput.value) {
        this.filenameInput.parentElement.classList.remove('focused');
      }
    });

    // Auto-resize del input
    this.filenameInput.addEventListener('input', () => {
      this.validateFilename();
    });
  }

  addValidation() {
    // Validación en tiempo real
    this.filenameInput.addEventListener('input', (e) => {
      const value = e.target.value;
      const isValid = this.isValidFilename(value);
      
      if (value && !isValid) {
        this.showValidationError('Nombre de archivo inválido');
      } else {
        this.clearValidationError();
      }
    });
  }

  isValidFilename(filename) {
    // Regex para nombres de archivo válidos
    const invalidChars = /[<>:"/\\|?*]/g;
    return !invalidChars.test(filename);
  }

  showValidationError(message) {
    this.filenameInput.classList.add('error');
    // Mostrar tooltip de error si existe
    const tooltip = this.filenameInput.nextElementSibling;
    if (tooltip?.classList.contains('error-tooltip')) {
      tooltip.textContent = message;
      tooltip.style.display = 'block';
    }
  }

  clearValidationError() {
    this.filenameInput.classList.remove('error');
    const tooltip = this.filenameInput.nextElementSibling;
    if (tooltip?.classList.contains('error-tooltip')) {
      tooltip.style.display = 'none';
    }
  }

  validateFilename() {
    const value = this.filenameInput.value.trim();
    return !value || this.isValidFilename(value);
  }
}

// Mejoras para botones y estados de loading
export class ButtonEnhancements {
  constructor() {
    this.buttons = document.querySelectorAll('.sh__btn');
    this.init();
  }

  init() {
    this.addButtonEffects();
  }

  addButtonEffects() {
    this.buttons.forEach(button => {
      // Efecto ripple
      button.addEventListener('click', (e) => {
        this.createRipple(e, button);
      });

      // Estados de hover mejorados
      button.addEventListener('mouseenter', () => {
        button.classList.add('hovered');
      });

      button.addEventListener('mouseleave', () => {
        button.classList.remove('hovered');
      });
    });
  }

  createRipple(event, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
    
    // Remover el ripple después de la animación
    setTimeout(() => {
      if (circle.parentNode) {
        circle.remove();
      }
    }, 600);
  }

  setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
      
      // Añadir spinner si no existe
      if (!button.querySelector('.spinner')) {
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        button.prepend(spinner);
      }
    } else {
      button.classList.remove('loading');
      button.disabled = false;
      
      // Remover spinner
      const spinner = button.querySelector('.spinner');
      if (spinner) {
        spinner.remove();
      }
    }
  }
}

// Inicializar todas las mejoras
export function initializeUIEnhancements() {
  const uiEnhancements = new UIEnhancements();
  const formEnhancements = new FormEnhancements();
  const buttonEnhancements = new ButtonEnhancements();
  
  return {
    uiEnhancements,
    formEnhancements,
    buttonEnhancements
  };
}
