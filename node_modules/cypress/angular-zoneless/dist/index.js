
/**
 * @cypress/angular-zoneless v0.0.0-development
 * (c) 2026 Cypress.io
 * Released under the MIT License
 */

import { CommonModule } from '@angular/common';
import { Injectable, Component, EventEmitter, ErrorHandler, provideZonelessChangeDetection, SimpleChange } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { getTestBed, TestComponentRenderer, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const ROOT_SELECTOR = '[data-cy-root]';
/**
 * Gets the root element used to mount the component.
 * @returns {HTMLElement} The root element
 * @throws {Error} If the root element is not found
 */
const getContainerEl = () => {
    const el = document.querySelector(ROOT_SELECTOR);
    if (el) {
        return el;
    }
    throw Error(`No element found that matches selector ${ROOT_SELECTOR}. Please add a root element with data-cy-root attribute to your "component-index.html" file so that Cypress can attach your component to the DOM.`);
};
/**
 * Utility function to register CT side effects and run cleanup code during the "test:before:run" Cypress hook
 * @param optionalCallback Callback to be called before the next test runs
 */
function setupHooks(optionalCallback) {
    // We don't want CT side effects to run when e2e
    // testing so we early return.
    // System test to verify CT side effects do not pollute e2e: system-tests/test/e2e_with_mount_import_spec.ts
    if (Cypress.testingType !== 'component') {
        return;
    }
    // When running component specs, we cannot allow "cy.visit"
    // because it will wipe out our preparation work, and does not make much sense
    // thus we overwrite "cy.visit" to throw an error
    Cypress.Commands.overwrite('visit', () => {
        throw new Error('cy.visit from a component spec is not allowed');
    });
    Cypress.Commands.overwrite('session', () => {
        throw new Error('cy.session from a component spec is not allowed');
    });
    Cypress.Commands.overwrite('origin', () => {
        throw new Error('cy.origin from a component spec is not allowed');
    });
    // @ts-ignore
    Cypress.on('test:before:after:run:async', () => {
        optionalCallback === null || optionalCallback === void 0 ? void 0 : optionalCallback();
    });
}

let activeFixture = null;
let activeInternalSubscriptions = [];
function cleanup() {
    // Not public, we need to call this to remove the last component from the DOM
    try {
        getTestBed().tearDownTestingModule();
    }
    catch (e) {
        const notSupportedError = new Error(`Failed to teardown component. The version of Angular you are using may not be officially supported.`);
        notSupportedError.docsUrl = 'https://on.cypress.io/frameworks';
        throw notSupportedError;
    }
    // clean up internal subscriptions if any exist. We use this for two-way data binding for
    // signal() models
    activeInternalSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
    });
    getTestBed().resetTestingModule();
    activeFixture = null;
    activeInternalSubscriptions = [];
}
let CypressAngularErrorHandler = class CypressAngularErrorHandler {
    handleError(error) {
        throw error;
    }
};
CypressAngularErrorHandler = __decorate([
    Injectable()
], CypressAngularErrorHandler);
/**
 * Bootstraps the TestModuleMetaData passed to the TestBed
 *
 * @param {Type<T>} component Angular component being mounted
 * @param {MountConfig} config TestBed configuration passed into the mount function
 * @returns {MountConfig} MountConfig
 */
function bootstrapModule(component, config) {
    var _a;
    const { componentProperties } = config, testModuleMetaData = __rest(config, ["componentProperties"]);
    if (!testModuleMetaData.declarations) {
        testModuleMetaData.declarations = [];
    }
    if (!testModuleMetaData.imports) {
        testModuleMetaData.imports = [];
    }
    if (!testModuleMetaData.providers) {
        testModuleMetaData.providers = [];
    }
    // Replace default error handler since it will swallow uncaught exceptions.
    // We want these to be uncaught so Cypress catches it and fails the test
    testModuleMetaData.providers.push({
        provide: ErrorHandler,
        useClass: CypressAngularErrorHandler,
    });
    // allow for zoneless change detection inside the testing module.
    // @see https://angular.dev/guide/zoneless#using-zoneless-in-testbed
    testModuleMetaData.providers.push(provideZonelessChangeDetection());
    // check if the component is a standalone component
    if ((_a = component.ɵcmp) === null || _a === void 0 ? void 0 : _a.standalone) {
        testModuleMetaData.imports.push(component);
    }
    else {
        testModuleMetaData.declarations.push(component);
    }
    if (!testModuleMetaData.imports.includes(CommonModule)) {
        testModuleMetaData.imports.push(CommonModule);
    }
    return testModuleMetaData;
}
let CypressTestComponentRenderer = class CypressTestComponentRenderer extends TestComponentRenderer {
    insertRootElement(rootElId) {
        this.removeAllRootElements();
        const rootElement = getContainerEl();
        rootElement.setAttribute('id', rootElId);
    }
    removeAllRootElements() {
        getContainerEl().innerHTML = '';
    }
};
CypressTestComponentRenderer = __decorate([
    Injectable()
], CypressTestComponentRenderer);
/**
 * Initializes the TestBed
 *
 * @param {Type<T> | string} component Angular component being mounted or its template
 * @param {MountConfig} config TestBed configuration passed into the mount function
 * @returns {Type<T>} componentFixture
 */
function initTestBed(component, config) {
    const componentFixture = createComponentFixture(component);
    getTestBed().configureTestingModule(Object.assign({}, bootstrapModule(componentFixture, config)));
    getTestBed().overrideProvider(TestComponentRenderer, { useValue: new CypressTestComponentRenderer() });
    return componentFixture;
}
// if using the Wrapper Component (template strings), the component itself cannot be
// a standalone component
let WrapperComponent = class WrapperComponent {
};
WrapperComponent = __decorate([
    Component({ selector: 'cy-wrapper-component', template: '', standalone: false })
], WrapperComponent);
/**
 * Returns the Component if Type<T> or creates a WrapperComponent
 *
 * @param {Type<T> | string} component The component you want to create a fixture of
 * @returns {Type<T> | WrapperComponent}
 */
function createComponentFixture(component) {
    if (typeof component === 'string') {
        // getTestBed().overrideTemplate is available in v14+
        // The static TestBed.overrideTemplate is available across versions
        TestBed.overrideTemplate(WrapperComponent, component);
        return WrapperComponent;
    }
    return component;
}
/**
 * Creates the ComponentFixture
 *
 * @param {Type<T>} component Angular component being mounted
 * @param {MountConfig<T>} config MountConfig

 * @returns {Promise<ComponentFixture<T>>} ComponentFixture
 */
function setupFixture(component, config) {
    const fixture = getTestBed().createComponent(component);
    setupComponent(config, fixture);
    return fixture;
}
// Best known way to currently detect whether or not a function is a signal is if the signal symbol exists.
// From there, we can take our best guess based on what exists on the object itself.
// @see https://github.com/cypress-io/cypress/issues/29731.
function isSignal(prop) {
    try {
        const symbol = Object.getOwnPropertySymbols(prop).find((symbol) => symbol.toString() === 'Symbol(SIGNAL)');
        return !!symbol;
    }
    catch (e) {
        // likely a primitive type, object, array, or something else (i.e. not a signal).
        // We can return false here.
        return false;
    }
}
// currently not a great way to detect if a function is an InputSignal.
// @see https://github.com/cypress-io/cypress/issues/29731.
function isInputSignal(prop) {
    return isSignal(prop) && typeof prop === 'function' && prop['name'] === 'inputValueFn';
}
// currently not a great way to detect if a function is a Model Signal.
// @see https://github.com/cypress-io/cypress/issues/29731.
function isModelSignal(prop) {
    return isSignal(prop) && isWritableSignal(prop) && typeof prop.subscribe === 'function';
}
// currently not a great way to detect if a function is a Writable Signal.
// @see https://github.com/cypress-io/cypress/issues/29731.
function isWritableSignal(prop) {
    return isSignal(prop) && typeof prop === 'function' && typeof prop.set === 'function';
}
function registerSignalEventsIfNeeded(propKey, propValue, componentValue, injector, fixture) {
    const isPropValueASignal = isSignal(propValue);
    if (isPropValueASignal) {
        // propValue -> componentValue
        const convertedToObservable = toObservable(propValue, {
            // @ts-expect-error - monorepo clashing types between Angular 18 and Angular 21
            injector,
        });
        // push the subscription into an array to be cleaned up at the end of the test
        // to prevent a memory leak
        activeInternalSubscriptions.push(convertedToObservable.subscribe((value) => {
            // keep the component up to date as prop signal changes
            fixture.componentRef.setInput(propKey, value);
        }));
    }
    const isComponentValueAModelSignal = isModelSignal(componentValue);
    if (isPropValueASignal && isComponentValueAModelSignal) {
        // propValue <- componentValue
        const modelChanged$ = toObservable(componentValue, {
            // @ts-expect-error - monorepo clashing types between Angular 18 and Angular 21
            injector,
        });
        activeInternalSubscriptions.push(modelChanged$.subscribe((value) => {
            propValue.set(value);
        }));
    }
}
// In the case of signals, if we need to create an output spy, we need to check first whether or not a user has one defined first or has it created through
// autoSpyOutputs. If so, we need to subscribe to the writable signal to push updates into the event emitter. We do NOT observe input signals and output spies will not
// work for input signals.
function detectAndRegisterOutputSpyToSignal(config, component, key, injector) {
    if (config.componentProperties) {
        const expectedChangeKey = `${key}Change`;
        let changeKeyIfExists = !!Object.keys(config.componentProperties).find((componentKey) => componentKey === expectedChangeKey);
        if (changeKeyIfExists) {
            component[expectedChangeKey] =
                // @ts-expect-error
                config.componentProperties[expectedChangeKey];
        }
        if (changeKeyIfExists) {
            const componentValue = component[key];
            // if the user passed in a change key or we created one due to config.autoSpyOutputs being set to true for a given signal,
            // we will create a subscriber that will emit an event every time the value inside the signal changes. We only do this
            // if the signal is writable and not an input signal.
            if (isWritableSignal(componentValue) && !isInputSignal(componentValue)) {
                activeInternalSubscriptions.push(toObservable(componentValue, {
                    // @ts-expect-error - monorepo clashing types between Angular 18 and Angular 21
                    injector,
                }).subscribe((value) => {
                    var _a;
                    (_a = component[expectedChangeKey]) === null || _a === void 0 ? void 0 : _a.emit(value);
                }));
            }
        }
    }
}
/**
 * Gets the componentInstance and Object.assigns any componentProperties() passed in the MountConfig
 *
 * @param {MountConfig} config TestBed configuration passed into the mount function
 * @param {ComponentFixture<T>} fixture Fixture for debugging and testing a component.
 * @returns {T} Component being mounted
 */
function setupComponent(config, fixture) {
    let component = fixture.componentInstance;
    const injector = fixture.componentRef.injector;
    if (config === null || config === void 0 ? void 0 : config.componentProperties) {
        if (component instanceof WrapperComponent) {
            component = Object.assign(component, config.componentProperties);
        }
        getComponentInputs(fixture.componentRef.componentType).forEach((key) => {
            var _a;
            // only assign props if they are passed into the component
            if ((_a = config === null || config === void 0 ? void 0 : config.componentProperties) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(key)) {
                // @ts-expect-error
                const passedInValue = config === null || config === void 0 ? void 0 : config.componentProperties[key];
                registerSignalEventsIfNeeded(key, passedInValue, component[key], injector, fixture);
                detectAndRegisterOutputSpyToSignal(config, component, key, injector);
                fixture.componentRef.setInput(key, isSignal(passedInValue) ? passedInValue() : passedInValue);
            }
        });
        getComponentOutputs(fixture.componentRef.componentType).forEach((key) => {
            var _a, _b;
            const property = component[key];
            // With the introduction of https://github.com/cypress-io/cypress/pull/31993, we want to make sure that component inputs are reference safe inside cy.mount().
            // However, the exception to this is if the user passes in a Cypress output spy as a property in order to maintain backwards compatibility.
            // @ts-expect-error
            if (property instanceof EventEmitter || (((_a = config === null || config === void 0 ? void 0 : config.componentProperties) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(key)) && (config === null || config === void 0 ? void 0 : config.componentProperties[key]) instanceof EventEmitter)) {
                // only assign props if they are passed into the component
                if ((_b = config === null || config === void 0 ? void 0 : config.componentProperties) === null || _b === void 0 ? void 0 : _b.hasOwnProperty(key)) {
                    // @ts-expect-error
                    const passedInValue = config === null || config === void 0 ? void 0 : config.componentProperties[key];
                    component[key] = passedInValue;
                }
            }
        });
    }
    // Manually call ngOnChanges when mounting components using the class syntax.
    // This is necessary because we are assigning input values to the class directly
    // on mount and therefore the ngOnChanges() lifecycle is not triggered.
    if (component.ngOnChanges && config.componentProperties) {
        const { componentProperties } = config;
        const simpleChanges = Object.entries(componentProperties).reduce((acc, [key, value]) => {
            acc[key] = new SimpleChange(null, value, true);
            return acc;
        }, {});
        if (Object.keys(componentProperties).length > 0) {
            component.ngOnChanges(simpleChanges);
        }
    }
}
/**
 * Gets the input properties of a component - cannot rely on Object.keys() because inclusion of optional properties depends on useDefineForClassFields=true
 *   Since Angular 15, useDefineForClassFields=false
 * @param componentType
 * @returns array of input property names
 */
function getComponentInputs(componentType) {
    var _a;
    // Access Angular's metadata to get input properties
    const propMetadata = ((_a = componentType.ɵcmp) === null || _a === void 0 ? void 0 : _a.inputs) || {};
    return Object.keys(propMetadata);
}
function getComponentOutputs(componentType) {
    var _a;
    // Access Angular's metadata to get output properties
    const propMetadata = ((_a = componentType.ɵcmp) === null || _a === void 0 ? void 0 : _a.outputs) || {};
    return Object.keys(propMetadata);
}
/**
 * Mounts an Angular component inside Cypress browser
 *
 * @param component Angular component being mounted or its template
 * @param config configuration used to configure the TestBed
 * @example
 * import { mount } from '@cypress/angular'
 * import { StepperComponent } from './stepper.component'
 * import { MyService } from 'services/my.service'
 * import { SharedModule } from 'shared/shared.module';
 * it('mounts', () => {
 *    mount(StepperComponent, {
 *      providers: [MyService],
 *      imports: [SharedModule]
 *    })
 *    cy.get('[data-cy=increment]').click()
 *    cy.get('[data-cy=counter]').should('have.text', '1')
 * })
 *
 * // or
 *
 * it('mounts with template', () => {
 *   mount('<app-stepper></app-stepper>', {
 *     declarations: [StepperComponent],
 *   })
 * })
 *
 * @see {@link https://on.cypress.io/mounting-angular} for more details.
 *
 * @returns A component and component fixture
 */
function mount(component, config = {}) {
    // Remove last mounted component if cy.mount is called more than once in a test
    if (activeFixture) {
        cleanup();
    }
    const componentFixture = initTestBed(component, config);
    let mountResponsePromiseResolver;
    let mountResponsePromiseRejector;
    let mountResponsePromise = new Promise((resolve, reject) => {
        mountResponsePromiseResolver = resolve;
        mountResponsePromiseRejector = reject;
    });
    const fixture = setupFixture(componentFixture, config);
    activeFixture = fixture;
    fixture.whenStable().then(() => {
        const mountResponse = {
            fixture,
            component: fixture.componentInstance,
        };
        const logMessage = typeof component === 'string' ? 'Component' : componentFixture.name;
        Cypress.log({
            name: 'mount',
            message: logMessage,
            consoleProps: () => ({ result: mountResponse }),
        });
        mountResponsePromiseResolver(mountResponse);
    }).catch((error) => {
        mountResponsePromiseRejector(error);
    });
    return cy.wrap(mountResponsePromise, { log: false });
}
/**
 * Creates a new Event Emitter and then spies on it's `emit` method
 *
 * @param {string} alias name you want to use for your cy.spy() alias
 * @returns EventEmitter<T>
 * @example
 * import { StepperComponent } from './stepper.component'
 * import { mount, createOutputSpy } from '@cypress/angular'
 *
 * it('Has spy', () => {
 *   mount(StepperComponent, { componentProperties: { change: createOutputSpy('changeSpy') } })
 *   cy.get('[data-cy=increment]').click()
 *   cy.get('@changeSpy').should('have.been.called')
 * })
 *
 * // Or for use with Angular Signals following the output nomenclature.
 * // see https://v17.angular.io/guide/model-inputs#differences-between-model-and-input/
 *
 * it('Has spy', () => {
 *   mount(StepperComponent, { componentProperties: { count: signal(0), countChange: createOutputSpy('countChange') } })
 *   cy.get('[data-cy=increment]').click()
 *   cy.get('@countChange').should('have.been.called')
 * })
 */
const createOutputSpy = (alias) => {
    const emitter = new EventEmitter();
    cy.spy(emitter, 'emit').as(alias);
    return emitter;
};
// Only needs to run once, we reset before each test
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false },
});
setupHooks(cleanup);

export { CypressTestComponentRenderer, createOutputSpy, mount };
